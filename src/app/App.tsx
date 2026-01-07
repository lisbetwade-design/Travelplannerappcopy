import { useState, useEffect } from "react";
import { Onboarding } from "./components/Onboarding";
import { Dashboard } from "./components/Dashboard";
import type { Trip } from "./components/UpcomingTrips";
import { supabase, API_BASE_URL } from "../lib/supabase";
import type { Session } from '@supabase/supabase-js';

interface UserData {
  country: string;
  timeOffDates: Date[];
  totalPTODays: number;
}

export default function App() {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [trips, setTrips] = useState<Trip[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [session, setSession] = useState<Session | null>(null);

  // Load current user session on mount
  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session) {
        loadUserData(session);
      } else {
        setIsLoading(false);
      }
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session) {
        loadUserData(session);
      } else {
        setUserData(null);
        setTrips([]);
        setIsLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const loadUserData = async (session: Session) => {
    try {
      const response = await fetch(`${API_BASE_URL}/user/data`, {
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to load user data');
      }

      const data = await response.json();

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
    } catch (error) {
      console.error("Error loading user data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const saveUserData = async (userData: UserData, trips: Trip[]) => {
    if (!session) return;

    try {
      // Save time off dates
      await fetch(`${API_BASE_URL}/user/timeoff`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({
          timeOffDates: userData.timeOffDates.map(d => d.toISOString()),
        }),
      });

      // Save trips
      await fetch(`${API_BASE_URL}/user/trips`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({
          trips: trips.map(trip => ({
            id: trip.id,
            destination: trip.destination,
            startDate: trip.startDate.toISOString(),
            endDate: trip.endDate.toISOString(),
            budget: trip.budget,
            activities: trip.activities,
          })),
        }),
      });
    } catch (error) {
      console.error("Error saving user data:", error);
    }
  };

  // Save user data whenever it changes
  useEffect(() => {
    if (userData && session) {
      saveUserData(userData, trips);
    }
  }, [userData, trips, session]);

  const handleSignUp = (newSession: Session, data: { country: string; totalPTODays: number }) => {
    setSession(newSession);
    setUserData({
      country: data.country,
      timeOffDates: [],
      totalPTODays: data.totalPTODays,
    });
    setTrips([]);
    setIsLoading(false);
  };

  const handleSignIn = (newSession: Session) => {
    setSession(newSession);
    loadUserData(newSession);
  };

  const handleAddTrip = (trip: Omit<Trip, "id">) => {
    const newTrip = {
      ...trip,
      id: Date.now().toString(),
    };
    setTrips([...trips, newTrip]);
  };

  const handleDeleteTrip = async (id: string) => {
    if (!session) return;

    try {
      // Delete from backend
      await fetch(`${API_BASE_URL}/user/trips/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
        },
      });

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

        setUserData({
          ...userData,
          timeOffDates: restoredTimeOff,
        });
      }

      // Remove the trip
      setTrips(trips.filter(t => t.id !== id));
    } catch (error) {
      console.error("Error deleting trip:", error);
    }
  };

  const handleAddTimeOff = (dates: Date[]) => {
    if (!userData) return;
    const updatedDates = [...userData.timeOffDates, ...dates];
    setUserData({
      ...userData,
      timeOffDates: updatedDates,
    });
  };

  const handleRemoveTimeOff = (datesToRemove: Date[]) => {
    if (!userData) return;
    setUserData({
      ...userData,
      timeOffDates: [],
    });
  };

  const handleUpdatePTODays = async (days: number) => {
    if (!userData || !session) return;
    
    try {
      await fetch(`${API_BASE_URL}/user/metadata`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({
          totalPTODays: days,
        }),
      });

      setUserData({
        ...userData,
        totalPTODays: days,
      });
    } catch (error) {
      console.error("Error updating PTO days:", error);
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setUserData(null);
    setTrips([]);
    setSession(null);
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