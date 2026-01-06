import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";
import { Onboarding } from "./components/Onboarding";
import { Dashboard } from "./components/Dashboard";
import type { Trip } from "./components/UpcomingTrips";
import { projectId, publicAnonKey } from "../../utils/supabase/info";

interface UserData {
  country: string;
  timeOffDates: Date[];
  totalPTODays: number;
}

const supabase = createClient(
  `https://${projectId}.supabase.co`,
  publicAnonKey
);

export default function App() {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [trips, setTrips] = useState<Trip[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [accessToken, setAccessToken] = useState<string | null>(null);

  // Check for existing session and load user data
  useEffect(() => {
    const initAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session?.access_token) {
        setAccessToken(session.access_token);
        await loadUserData(session.access_token);
      } else {
        setIsLoading(false);
      }
    };

    initAuth();
  }, []);

  const loadUserData = async (token: string) => {
    try {
      console.log("Loading user data with token...");
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-fe35748f/user/data`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        }
      );

      console.log("User data response status:", response.status);

      if (response.ok) {
        const data = await response.json();
        console.log("User data loaded:", data);
        
        setUserData({
          country: data.user.country,
          timeOffDates: data.timeOffDates.map((d: string) => new Date(d)),
          totalPTODays: data.user.totalPTODays,
        });

        setTrips(data.trips.map((trip: any) => ({
          ...trip,
          startDate: new Date(trip.startDate),
          endDate: new Date(trip.endDate),
        })));
      } else {
        console.error("Failed to load user data, status:", response.status);
        const errorText = await response.text();
        console.error("Error response:", errorText);
      }
    } catch (error) {
      console.error("Error loading user data from server:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOnboardingComplete = async (data: UserData, email: string, password: string) => {
    try {
      console.log("Starting signup process...");
      
      // Sign up the user
      const signupResponse = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-fe35748f/signup`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${publicAnonKey}`,
          },
          body: JSON.stringify({
            email,
            password,
            name: email.split('@')[0],
            country: data.country,
            totalPTODays: data.totalPTODays,
          }),
        }
      );

      if (!signupResponse.ok) {
        const errorData = await signupResponse.json();
        console.error("Signup error:", errorData.error);
        
        // Check if user already exists
        if (errorData.error && errorData.error.includes("already been registered")) {
          alert("An account with this email already exists. Please sign in instead.");
        } else {
          alert(`Signup failed: ${errorData.error}`);
        }
        return;
      }

      // Sign in the user
      const { data: signInData, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error || !signInData.session?.access_token) {
        console.error("Sign in error:", error);
        alert("Failed to sign in after signup");
        return;
      }

      setAccessToken(signInData.session.access_token);
      setUserData(data);

      // Save initial time off dates if any
      if (data.timeOffDates.length > 0) {
        await saveTimeOff(data.timeOffDates, signInData.session.access_token);
      }
    } catch (error) {
      console.error("Error during onboarding:", error);
      if (error instanceof TypeError && error.message === 'Failed to fetch') {
        alert("Network error: Unable to connect to server. Please check your connection.");
      } else {
        alert(`An error occurred during signup: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    }
  };

  const handleSignIn = async (email: string, password: string) => {
    try {
      // Sign in the user
      const { data: signInData, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error("Sign in error:", error);
        
        // Provide more user-friendly error messages and throw error to be caught by Onboarding
        if (error.message.includes("Invalid login credentials")) {
          throw new Error("Invalid email or password. Please check your credentials and try again.");
        } else if (error.message.includes("Email not confirmed")) {
          throw new Error("Please confirm your email address before signing in.");
        } else {
          throw new Error(error.message);
        }
      }

      if (!signInData.session?.access_token) {
        throw new Error("Failed to sign in - no session token received");
      }

      setAccessToken(signInData.session.access_token);
      
      // Load user data from the database
      await loadUserData(signInData.session.access_token);
    } catch (error) {
      console.error("Error during sign in:", error);
      // Re-throw the error so it can be caught by the Onboarding component
      throw error;
    }
  };

  const saveTimeOff = async (dates: Date[], token?: string) => {
    const authToken = token || accessToken;
    if (!authToken) return;

    try {
      await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-fe35748f/user/timeoff`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${authToken}`,
          },
          body: JSON.stringify({
            timeOffDates: dates.map(d => d.toISOString()),
          }),
        }
      );
    } catch (error) {
      console.error("Error saving time off:", error);
    }
  };

  const saveTrips = async (tripsData: Trip[]) => {
    if (!accessToken) return;

    try {
      await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-fe35748f/user/trips`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`,
          },
          body: JSON.stringify({
            trips: tripsData.map(trip => ({
              ...trip,
              startDate: trip.startDate.toISOString(),
              endDate: trip.endDate.toISOString(),
            })),
          }),
        }
      );
    } catch (error) {
      console.error("Error saving trips:", error);
    }
  };

  const handleAddTrip = async (trip: Omit<Trip, "id">) => {
    const newTrip = {
      ...trip,
      id: Date.now().toString(),
    };
    const updatedTrips = [...trips, newTrip];
    setTrips(updatedTrips);
    await saveTrips(updatedTrips);
  };

  const handleDeleteTrip = async (id: string) => {
    if (!accessToken) return;

    try {
      // Call the delete endpoint which will delete both trip and associated time off
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-fe35748f/user/trips/${id}`,
        {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${accessToken}`,
          },
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Error deleting trip:", errorData.error);
        alert("Failed to delete trip");
        return;
      }

      // Reload user data to get updated trips and time off
      await loadUserData(accessToken);
    } catch (error) {
      console.error("Error deleting trip:", error);
      alert("An error occurred while deleting the trip");
    }
  };

  const handleAddTimeOff = async (dates: Date[]) => {
    if (!userData) return;
    const updatedDates = [...userData.timeOffDates, ...dates];
    const updatedData = {
      ...userData,
      timeOffDates: updatedDates,
    };
    setUserData(updatedData);
    await saveTimeOff(updatedDates);
  };

  const handleRemoveTimeOff = async (datesToRemove: Date[]) => {
    if (!userData) return;
    const updatedData = {
      ...userData,
      timeOffDates: [],
    };
    setUserData(updatedData);
    await saveTimeOff([]);
  };

  const handleUpdatePTODays = async (days: number) => {
    if (!userData || !accessToken) return;
    
    try {
      await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-fe35748f/user/metadata`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`,
          },
          body: JSON.stringify({ totalPTODays: days }),
        }
      );

      const updatedData = {
        ...userData,
        totalPTODays: days,
      };
      setUserData(updatedData);
    } catch (error) {
      console.error("Error updating PTO days:", error);
    }
  };

  const handleReset = async () => {
    await supabase.auth.signOut();
    setUserData(null);
    setTrips([]);
    setAccessToken(null);
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
    return <Onboarding onComplete={handleOnboardingComplete} onSignIn={handleSignIn} />;
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
      onReset={handleReset}
    />
  );
}