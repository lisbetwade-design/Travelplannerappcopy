import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.4";
import { JWT } from "https://deno.land/x/jose@v5.6.3/index.ts";
import { jwtVerify } from "https://deno.land/x/jose@v5.6.3/index.ts";
import { importSPKI } from "https://deno.land/x/jose@v5.6.3/index.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "authorization, x-client-info, content-type",
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  const url = new URL(req.url);
  const path = url.pathname;

  try {
    // Public endpoints (no JWT validation required)
    if (path === "/health") {
      return new Response(JSON.stringify({ status: "ok" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Protected endpoints requiring JWT validation with SERVICE_ROLE_KEY
    const protectedEndpoints = [
      "/user/data",
      "/user/timeoff",
      "/user/trips",
      "/user/metadata",
    ];

    const isProtectedEndpoint =
      protectedEndpoints.some((endpoint) => path.startsWith(endpoint)) ||
      /^\/user\/trips\/[^/]+$/.test(path); // Matches /user/trips/:tripId

    if (isProtectedEndpoint) {
      const authHeader = req.headers.get("authorization");
      if (!authHeader) {
        return new Response(
          JSON.stringify({ error: "Missing authorization header" }),
          {
            status: 401,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
      }

      const token = authHeader.replace("Bearer ", "");

      // Initialize Supabase client with SERVICE_ROLE_KEY for JWT validation
      const supabaseUrl = Deno.env.get("SUPABASE_URL");
      const supabaseServiceRoleKey = Deno.env.get(
        "SUPABASE_SERVICE_ROLE_KEY"
      );

      if (!supabaseUrl || !supabaseServiceRoleKey) {
        return new Response(
          JSON.stringify({ error: "Missing Supabase configuration" }),
          {
            status: 500,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
      }

      const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);

      // Verify JWT token
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser(token);

        if (!user) {
          return new Response(JSON.stringify({ error: "Invalid token" }), {
            status: 401,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          });
        }

        // Route to appropriate handler
        if (path === "/user/data" && req.method === "GET") {
          return handleGetUserData(supabase, user.id);
        }

        if (path === "/user/timeoff" && req.method === "GET") {
          return handleGetUserTimeoff(supabase, user.id);
        }

        if (path === "/user/timeoff" && req.method === "POST") {
          return handleCreateTimeoff(supabase, user.id, req);
        }

        if (path === "/user/trips" && req.method === "GET") {
          return handleGetUserTrips(supabase, user.id);
        }

        if (path === "/user/trips" && req.method === "POST") {
          return handleCreateTrip(supabase, user.id, req);
        }

        if (/^\/user\/trips\/[^/]+$/.test(path) && req.method === "GET") {
          const tripId = path.split("/")[3];
          return handleGetTripDetails(supabase, user.id, tripId);
        }

        if (/^\/user\/trips\/[^/]+$/.test(path) && req.method === "PUT") {
          const tripId = path.split("/")[3];
          return handleUpdateTrip(supabase, user.id, tripId, req);
        }

        if (/^\/user\/trips\/[^/]+$/.test(path) && req.method === "DELETE") {
          const tripId = path.split("/")[3];
          return handleDeleteTrip(supabase, user.id, tripId);
        }

        if (path === "/user/metadata" && req.method === "GET") {
          return handleGetUserMetadata(supabase, user.id);
        }

        if (path === "/user/metadata" && req.method === "PUT") {
          return handleUpdateUserMetadata(supabase, user.id, req);
        }
      } catch (error) {
        return new Response(JSON.stringify({ error: "Token verification failed" }), {
          status: 401,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
    }

    // 404 for unknown routes
    return new Response(JSON.stringify({ error: "Not found" }), {
      status: 404,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Server error:", error);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});

// Handler functions
async function handleGetUserData(supabase: any, userId: string) {
  try {
    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("id", userId)
      .single();

    if (error) {
      return new Response(JSON.stringify({ error: error.message }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify(data), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}

async function handleGetUserTimeoff(supabase: any, userId: string) {
  try {
    const { data, error } = await supabase
      .from("timeoff")
      .select("*")
      .eq("user_id", userId);

    if (error) {
      return new Response(JSON.stringify({ error: error.message }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify(data), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}

async function handleCreateTimeoff(
  supabase: any,
  userId: string,
  req: Request
) {
  try {
    const body = await req.json();

    const { data, error } = await supabase
      .from("timeoff")
      .insert([{ user_id: userId, ...body }])
      .select();

    if (error) {
      return new Response(JSON.stringify({ error: error.message }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify(data[0]), {
      status: 201,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}

async function handleGetUserTrips(supabase: any, userId: string) {
  try {
    const { data, error } = await supabase
      .from("trips")
      .select("*")
      .eq("user_id", userId);

    if (error) {
      return new Response(JSON.stringify({ error: error.message }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify(data), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}

async function handleCreateTrip(supabase: any, userId: string, req: Request) {
  try {
    const body = await req.json();

    const { data, error } = await supabase
      .from("trips")
      .insert([{ user_id: userId, ...body }])
      .select();

    if (error) {
      return new Response(JSON.stringify({ error: error.message }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify(data[0]), {
      status: 201,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}

async function handleGetTripDetails(
  supabase: any,
  userId: string,
  tripId: string
) {
  try {
    const { data, error } = await supabase
      .from("trips")
      .select("*")
      .eq("id", tripId)
      .eq("user_id", userId)
      .single();

    if (error) {
      return new Response(JSON.stringify({ error: error.message }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify(data), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}

async function handleUpdateTrip(
  supabase: any,
  userId: string,
  tripId: string,
  req: Request
) {
  try {
    const body = await req.json();

    const { data, error } = await supabase
      .from("trips")
      .update(body)
      .eq("id", tripId)
      .eq("user_id", userId)
      .select();

    if (error) {
      return new Response(JSON.stringify({ error: error.message }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify(data[0]), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}

async function handleDeleteTrip(
  supabase: any,
  userId: string,
  tripId: string
) {
  try {
    const { error } = await supabase
      .from("trips")
      .delete()
      .eq("id", tripId)
      .eq("user_id", userId);

    if (error) {
      return new Response(JSON.stringify({ error: error.message }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ message: "Trip deleted successfully" }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}

async function handleGetUserMetadata(supabase: any, userId: string) {
  try {
    const { data, error } = await supabase
      .from("user_metadata")
      .select("*")
      .eq("user_id", userId)
      .single();

    if (error) {
      return new Response(JSON.stringify({ error: error.message }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify(data), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}

async function handleUpdateUserMetadata(
  supabase: any,
  userId: string,
  req: Request
) {
  try {
    const body = await req.json();

    const { data, error } = await supabase
      .from("user_metadata")
      .update(body)
      .eq("user_id", userId)
      .select();

    if (error) {
      return new Response(JSON.stringify({ error: error.message }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify(data[0]), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}