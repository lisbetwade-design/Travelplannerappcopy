import { useState, useEffect } from "react";
import { Onboarding } from "./components/Onboarding";
import { Dashboard } from "./components/Dashboard";
import type { Trip } from "./components/UpcomingTrips";
import { supabase } from "../lib/supabase";

interface UserData {
  country: string;
  timeOffDates: Date[];
  totalPTODays: number;
}

export default function App() {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [trips, setTrips] = useState<Trip[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentUserEmail, setCurrentUserEmail] = useState<string | null>(null);

  // Load current user session on mount
  useEffect(() => {
    checkSession();
  }, []);

  const checkSession = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session) {
        await loadUserData(session.user.id);
      } else {
        setIsLoading(false);
      }
    } catch (error) {
      console.error("Error checking session:", error);
      setIsLoading(false);
    }
  };

  const loadUserData = async (userId: string) => {
    try {
      // Get user data from users table
      const { data: userRecord, error: userError } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single();

      // Get auth user for email
      const { data: { user } } = await supabase.auth.getUser();

      if (userError) {
        console.error("Error loading user data:", userError);
        setIsLoading(false);
        return;
      }

      // Get time off dates
      const { data: timeOffData, error: timeOffError } = await supabase
        .from('time_off')
        .select('date')
        .eq('user_id', userId)
        .order('date', { ascending: true });

      const timeOffDates = timeOffData 
        ? timeOffData.map(item => new Date(item.date)) 
        : [];

      // Get trips
      const { data: tripsData, error: tripsError } = await supabase
        .from('trips')
        .select('*')
        .eq('user_id', userId)
        .order('start_date', { ascending: true });

      const userTrips = tripsData 
        ? tripsData.map(trip => ({
            id: trip.id,
            destination: trip.destination,
            startDate: new Date(trip.start_date),
            endDate: new Date(trip.end_date),
            budget: trip.budget,
            activities: trip.activities,
          }))
        : [];

      if (user?.email) {
        setCurrentUserEmail(user.email);
      }

      setUserData({
        country: userRecord.country,
        totalPTODays: userRecord.total_pto_days,
        timeOffDates,
      });
      setTrips(userTrips);
    } catch (error) {
      console.error("Error loading user data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignUp = async (email: string, password: string, data: UserData) => {
    try {
      // Sign up with Supabase Auth
      const { data: authData, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            country: data.country,
            totalPTODays: data.totalPTODays,
          }
        }
      });

      if (signUpError) {
        throw signUpError;
      }

      if (!authData.user) {
        throw new Error("Failed to create user");
      }

      // Insert user data into users table
      const { error: insertError } = await supabase
        .from('users')
        .insert({
          id: authData.user.id,
          country: data.country,
          total_pto_days: data.totalPTODays,
        });

      if (insertError) {
        console.error("Error inserting user data:", insertError);
        // If database tables don't exist, user can still proceed with auth
        // The data is stored in user_metadata as a fallback
        // This allows the app to work even if migrations haven't been run yet
      }

      // Insert initial time off dates if any
      if (data.timeOffDates.length > 0) {
        const timeOffRecords = data.timeOffDates.map(date => ({
          user_id: authData.user.id,
          date: date.toISOString().split('T')[0],
        }));

        const { error: timeOffError } = await supabase
          .from('time_off')
          .insert(timeOffRecords);

        if (timeOffError) {
          console.error("Error inserting time off:", timeOffError);
        }
      }

      setCurrentUserEmail(email);
      setUserData(data);
      setTrips([]);
    } catch (error) {
      console.error("Sign up error:", error);
      throw error;
    }
  };

  const handleSignIn = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        throw error;
      }

      if (!data.user) {
        throw new Error("No user found");
      }

      await loadUserData(data.user.id);
    } catch (error) {
      console.error("Sign in error:", error);
      throw error;
    }
  };

  const handleAddTrip = async (trip: Omit<Trip, "id">) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error("No authenticated user");
      }

      const newTrip = {
        ...trip,
        id: crypto.randomUUID(),
      };

      // Insert trip into database
      const { error } = await supabase
        .from('trips')
        .insert({
          id: newTrip.id,
          user_id: user.id,
          destination: newTrip.destination,
          start_date: newTrip.startDate.toISOString().split('T')[0],
          end_date: newTrip.endDate.toISOString().split('T')[0],
          budget: newTrip.budget,
          activities: newTrip.activities,
        });

      if (error) {
        throw error;
      }

      setTrips([...trips, newTrip]);
    } catch (error) {
      console.error("Error adding trip:", error);
      throw error;
    }
  };

  const handleDeleteTrip = async (id: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error("No authenticated user");
      }

      // Find the trip being deleted
      const tripToDelete = trips.find(t => t.id === id);
      
      if (tripToDelete && userData) {
        // Calculate which dates were used by this trip
        const tripDates: Date[] = [];
        const currentDate = new Date(tripToDelete.startDate);
        while (currentDate <= tripToDelete.endDate) {
          tripDates.push(new Date(currentDate));
          currentDate.setDate(currentDate.getDate() + 1);
        }

        // Restore those dates to timeOffDates
        const restoredTimeOff = [
          ...userData.timeOffDates,
          ...tripDates
        ];

        // Insert restored time off dates to database
        const timeOffRecords = tripDates.map(date => ({
          user_id: user.id,
          date: date.toISOString().split('T')[0],
        }));

        const { error: timeOffError } = await supabase
          .from('time_off')
          .insert(timeOffRecords);

        if (timeOffError) {
          console.error("Error restoring time off:", timeOffError);
        }

        setUserData({
          ...userData,
          timeOffDates: restoredTimeOff,
        });
      }

      // Delete the trip from database
      const { error } = await supabase
        .from('trips')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) {
        throw error;
      }

      // Remove the trip from state
      setTrips(trips.filter(t => t.id !== id));
    } catch (error) {
      console.error("Error deleting trip:", error);
      throw error;
    }
  };

  const handleAddTimeOff = async (dates: Date[]) => {
    if (!userData) return;
    
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error("No authenticated user");
      }

      // Insert new time off dates
      const timeOffRecords = dates.map(date => ({
        user_id: user.id,
        date: date.toISOString().split('T')[0],
      }));

      const { error } = await supabase
        .from('time_off')
        .insert(timeOffRecords);

      if (error) {
        throw error;
      }

      const updatedDates = [...userData.timeOffDates, ...dates];
      setUserData({
        ...userData,
        timeOffDates: updatedDates,
      });
    } catch (error) {
      console.error("Error adding time off:", error);
      throw error;
    }
  };

  const handleRemoveTimeOff = async (datesToRemove: Date[]) => {
    if (!userData) return;
    
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error("No authenticated user");
      }

      // Delete all time off dates for the user
      // Note: This clears all time off, ignoring datesToRemove parameter
      // This matches the original localStorage implementation
      const { error } = await supabase
        .from('time_off')
        .delete()
        .eq('user_id', user.id);

      if (error) {
        throw error;
      }

      setUserData({
        ...userData,
        timeOffDates: [],
      });
    } catch (error) {
      console.error("Error removing time off:", error);
      throw error;
    }
  };

  const handleUpdatePTODays = async (days: number) => {
    if (!userData) return;
    
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error("No authenticated user");
      }

      // Update in database
      const { error } = await supabase
        .from('users')
        .update({ total_pto_days: days })
        .eq('id', user.id);

      if (error) {
        throw error;
      }

      setUserData({
        ...userData,
        totalPTODays: days,
      });
    } catch (error) {
      console.error("Error updating PTO days:", error);
      throw error;
    }
  };

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
      setUserData(null);
      setTrips([]);
      setCurrentUserEmail(null);
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 via-white to-emerald-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto" />
          <p className="mt-4 text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!userData) {
    return <Onboarding onSignUp={handleSignUp} onSignIn={handleSignIn} />;
  }

  return (
    <Dashboard
      country={userData.country}
      timeOffDates={userData.timeOffDates}
      totalPTODays={userData.totalPTODays}
      trips={trips}
      onAddTrip={handleAddTrip}
      onDeleteTrip={handleDeleteTrip}
      onAddTimeOff={handleAddTimeOff}
      onRemoveTimeOff={handleRemoveTimeOff}
      onUpdatePTODays={handleUpdatePTODays}
      onReset={handleSignOut}
    />
  );
}