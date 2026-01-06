import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import { createClient } from "jsr:@supabase/supabase-js@2";
import * as kv from "./kv_store.tsx";
const app = new Hono();

// Enable logger
app.use('*', logger(console.log));

// Enable CORS for all routes and methods
app.use(
  "/*",
  cors({
    origin: "*",
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
  }),
);

// Health check endpoint
app.get("/make-server-fe35748f/health", (c) => {
  return c.json({ status: "ok" });
});

// Sign up endpoint
app.post("/make-server-fe35748f/signup", async (c) => {
  try {
    const { email, password, name, country, totalPTODays } = await c.req.json();

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
    );

    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password,
      user_metadata: { name, country, totalPTODays },
      // Automatically confirm the user's email since an email server hasn't been configured.
      email_confirm: true
    });

    if (error) {
      console.log(`Sign up error: ${error.message}`);
      return c.json({ error: error.message }, 400);
    }

    // Try to insert user data into users table
    try {
      const { error: insertError } = await supabase
        .from('users')
        .insert({
          id: data.user.id,
          country,
          total_pto_days: totalPTODays,
        });

      if (insertError) {
        console.log(`Error inserting user data: ${insertError.message}`);
        // Check if it's a "table doesn't exist" error
        if (insertError.message.includes('relation "public.users" does not exist')) {
          console.log('WARNING: Database tables not created. Please run the migration from /supabase/migrations/20240104_create_tables.sql');
        }
        // Continue even if insert fails, user is already created in auth
      }
    } catch (dbError) {
      console.log(`Database error (continuing): ${dbError}`);
    }

    return c.json({ user: data.user });
  } catch (error) {
    console.log(`Sign up error: ${error}`);
    return c.json({ error: "Failed to create user" }, 500);
  }
});

// Get user data endpoint
app.get("/make-server-fe35748f/user/data", async (c) => {
  try {
    const authHeader = c.req.header('Authorization');
    console.log('Auth header received:', authHeader ? 'present' : 'missing');
    
    const accessToken = authHeader?.replace('Bearer ', '');
    
    if (!accessToken) {
      console.log('No access token provided');
      return c.json({ error: 'Unauthorized' }, 401);
    }
    
    console.log('Access token length:', accessToken.length);
    console.log('Access token first 20 chars:', accessToken.substring(0, 20));
    
    // Use ANON key to verify the JWT
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_ANON_KEY')!,
    );

    // Pass the token directly to getUser
    const { data: { user }, error } = await supabase.auth.getUser(accessToken);
    
    console.log('getUser result:', { hasUser: !!user, error: error?.message });
    
    if (error || !user?.id) {
      console.log(`Authorization error while getting user data: ${error?.message}`);
      return c.json({ error: 'Unauthorized', details: error?.message }, 401);
    }

    // Get user data from users table using service role key
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
    );

    // Get user data from users table
    const { data: userData, error: userError } = await supabaseAdmin
      .from('users')
      .select('*')
      .eq('id', user.id)
      .single();

    // Get user's time off dates
    const { data: timeOffData, error: timeOffError } = await supabaseAdmin
      .from('time_off')
      .select('date')
      .eq('user_id', user.id)
      .order('date', { ascending: true });

    const timeOffDates = timeOffData ? timeOffData.map(item => item.date) : [];

    // Get user's trips
    const { data: tripsData, error: tripsError } = await supabaseAdmin
      .from('trips')
      .select('*')
      .eq('user_id', user.id)
      .order('start_date', { ascending: true });

    const trips = tripsData ? tripsData.map(trip => ({
      id: trip.id,
      destination: trip.destination,
      startDate: trip.start_date,
      endDate: trip.end_date,
      budget: trip.budget,
      activities: trip.activities,
    })) : [];

    return c.json({
      user: {
        id: user.id,
        email: user.email,
        name: user.user_metadata?.name,
        country: userData?.country || user.user_metadata?.country,
        totalPTODays: userData?.total_pto_days || user.user_metadata?.totalPTODays || 0,
      },
      timeOffDates,
      trips,
    });
  } catch (error) {
    console.log(`Error getting user data: ${error}`);
    return c.json({ error: "Failed to get user data" }, 500);
  }
});

// Save time off dates
app.post("/make-server-fe35748f/user/timeoff", async (c) => {
  try {
    const authHeader = c.req.header('Authorization');
    const accessToken = authHeader?.replace('Bearer ', '');
    
    if (!accessToken) {
      return c.json({ error: 'Unauthorized' }, 401);
    }
    
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_ANON_KEY')!,
    );

    const { data: { user }, error } = await supabase.auth.getUser(accessToken);
    
    if (error || !user?.id) {
      console.log(`Authorization error while saving time off: ${error?.message}`);
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const { timeOffDates } = await c.req.json();
    
    // Use service role key for database operations
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
    );
    
    // Delete all existing time off dates for the user
    await supabaseAdmin
      .from('time_off')
      .delete()
      .eq('user_id', user.id);

    // Insert new time off dates
    if (timeOffDates && timeOffDates.length > 0) {
      const timeOffRecords = timeOffDates.map((date: string) => ({
        user_id: user.id,
        date: date.split('T')[0], // Extract just the date part
      }));

      const { error: insertError } = await supabaseAdmin
        .from('time_off')
        .insert(timeOffRecords);

      if (insertError) {
        console.log(`Error inserting time off: ${insertError.message}`);
        return c.json({ error: insertError.message }, 400);
      }
    }

    return c.json({ success: true });
  } catch (error) {
    console.log(`Error saving time off: ${error}`);
    return c.json({ error: "Failed to save time off" }, 500);
  }
});

// Save trips
app.post("/make-server-fe35748f/user/trips", async (c) => {
  try {
    const authHeader = c.req.header('Authorization');
    const accessToken = authHeader?.replace('Bearer ', '');
    
    if (!accessToken) {
      return c.json({ error: 'Unauthorized' }, 401);
    }
    
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_ANON_KEY')!,
    );

    const { data: { user }, error } = await supabase.auth.getUser(accessToken);
    
    if (error || !user?.id) {
      console.log(`Authorization error while saving trips: ${error?.message}`);
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const { trips } = await c.req.json();
    
    // Use service role key for database operations
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
    );
    
    // Delete all existing trips for the user
    await supabaseAdmin
      .from('trips')
      .delete()
      .eq('user_id', user.id);

    // Insert new trips
    if (trips && trips.length > 0) {
      const tripRecords = trips.map((trip: any) => ({
        id: trip.id,
        user_id: user.id,
        destination: trip.destination,
        start_date: trip.startDate.split('T')[0],
        end_date: trip.endDate.split('T')[0],
        budget: trip.budget || null,
        activities: trip.activities || null,
      }));

      const { error: insertError } = await supabaseAdmin
        .from('trips')
        .insert(tripRecords);

      if (insertError) {
        console.log(`Error inserting trips: ${insertError.message}`);
        return c.json({ error: insertError.message }, 400);
      }
    }

    return c.json({ success: true });
  } catch (error) {
    console.log(`Error saving trips: ${error}`);
    return c.json({ error: "Failed to save trips" }, 500);
  }
});

// Delete a single trip and its associated time off dates
app.delete("/make-server-fe35748f/user/trips/:tripId", async (c) => {
  try {
    const authHeader = c.req.header('Authorization');
    const accessToken = authHeader?.replace('Bearer ', '');
    const tripId = c.req.param('tripId');
    
    if (!accessToken) {
      return c.json({ error: 'Unauthorized' }, 401);
    }
    
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_ANON_KEY')!,
    );

    const { data: { user }, error } = await supabase.auth.getUser(accessToken);
    
    if (error || !user?.id) {
      console.log(`Authorization error while deleting trip: ${error?.message}`);
      return c.json({ error: 'Unauthorized' }, 401);
    }

    // Use service role key for database operations
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
    );

    // Get the trip to find its dates
    const { data: trip, error: tripError } = await supabaseAdmin
      .from('trips')
      .select('start_date, end_date')
      .eq('id', tripId)
      .eq('user_id', user.id)
      .single();

    if (tripError || !trip) {
      console.log(`Error finding trip: ${tripError?.message}`);
      return c.json({ error: 'Trip not found' }, 404);
    }

    // Delete time off dates associated with this trip
    // Get all dates between start and end
    const startDate = new Date(trip.start_date);
    const endDate = new Date(trip.end_date);
    const dates = [];
    
    for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
      dates.push(d.toISOString().split('T')[0]);
    }

    // Delete time off records for these dates
    const { error: deleteTimeOffError } = await supabaseAdmin
      .from('time_off')
      .delete()
      .eq('user_id', user.id)
      .in('date', dates);

    if (deleteTimeOffError) {
      console.log(`Error deleting time off: ${deleteTimeOffError.message}`);
    }

    // Delete the trip
    const { error: deleteTripError } = await supabaseAdmin
      .from('trips')
      .delete()
      .eq('id', tripId)
      .eq('user_id', user.id);

    if (deleteTripError) {
      console.log(`Error deleting trip: ${deleteTripError.message}`);
      return c.json({ error: deleteTripError.message }, 400);
    }

    return c.json({ success: true });
  } catch (error) {
    console.log(`Error deleting trip: ${error}`);
    return c.json({ error: "Failed to delete trip" }, 500);
  }
});

// Update user metadata (totalPTODays)
app.put("/make-server-fe35748f/user/metadata", async (c) => {
  try {
    const authHeader = c.req.header('Authorization');
    const accessToken = authHeader?.replace('Bearer ', '');
    
    if (!accessToken) {
      return c.json({ error: 'Unauthorized' }, 401);
    }
    
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_ANON_KEY')!,
    );

    const { data: { user }, error } = await supabase.auth.getUser(accessToken);
    
    if (error || !user?.id) {
      console.log(`Authorization error while updating metadata: ${error?.message}`);
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const { totalPTODays } = await c.req.json();

    // Use service role key for admin operations
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
    );

    // Update user metadata in auth
    const { error: updateError } = await supabaseAdmin.auth.admin.updateUserById(
      user.id,
      { user_metadata: { ...user.user_metadata, totalPTODays } }
    );

    if (updateError) {
      console.log(`Error updating user metadata: ${updateError.message}`);
      return c.json({ error: updateError.message }, 400);
    }

    // Update users table
    const { error: dbUpdateError } = await supabaseAdmin
      .from('users')
      .update({ total_pto_days: totalPTODays })
      .eq('id', user.id);

    if (dbUpdateError) {
      console.log(`Error updating users table: ${dbUpdateError.message}`);
    }

    return c.json({ success: true });
  } catch (error) {
    console.log(`Error updating metadata: ${error}`);
    return c.json({ error: "Failed to update metadata" }, 500);
  }
});

Deno.serve(app.fetch);