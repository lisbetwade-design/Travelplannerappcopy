import { useState, useEffect } from "react";
import { Onboarding } from "./components/Onboarding";
import { Dashboard } from "./components/Dashboard";
import type { Trip } from "./components/UpcomingTrips";

interface UserData {
  country: string;
  timeOffDates: Date[];
  totalPTODays: number;
}

interface StoredUser {
  email: string;
  password: string;
  userData: {
    country: string;
    timeOffDates: string[];
    totalPTODays: number;
  };
  trips: any[];
}

export default function App() {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [trips, setTrips] = useState<Trip[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentUserEmail, setCurrentUserEmail] = useState<string | null>(null);

  // Load current user session on mount
  useEffect(() => {
    const loadSession = () => {
      try {
        const sessionEmail = localStorage.getItem('oooff_current_user');
        
        if (sessionEmail) {
          loadUserData(sessionEmail);
        } else {
          setIsLoading(false);
        }
      } catch (error) {
        console.error("Error loading session:", error);
        setIsLoading(false);
      }
    };

    loadSession();
  }, []);

  const loadUserData = (email: string) => {
    try {
      const users = JSON.parse(localStorage.getItem('oooff_users') || '{}');
      const user = users[email];

      if (user) {
        setCurrentUserEmail(email);
        setUserData({
          ...user.userData,
          timeOffDates: user.userData.timeOffDates.map((d: string) => new Date(d)),
        });
        setTrips(user.trips.map((trip: any) => ({
          ...trip,
          startDate: new Date(trip.startDate),
          endDate: new Date(trip.endDate),
        })));
      }
    } catch (error) {
      console.error("Error loading user data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const saveUserData = (email: string, userData: UserData, trips: Trip[]) => {
    try {
      const users = JSON.parse(localStorage.getItem('oooff_users') || '{}');
      
      if (users[email]) {
        users[email].userData = {
          ...userData,
          timeOffDates: userData.timeOffDates.map(d => d.toISOString()),
        };
        users[email].trips = trips.map(trip => ({
          ...trip,
          startDate: trip.startDate.toISOString(),
          endDate: trip.endDate.toISOString(),
        }));

        localStorage.setItem('oooff_users', JSON.stringify(users));
      }
    } catch (error) {
      console.error("Error saving user data:", error);
    }
  };

  // Save user data whenever it changes
  useEffect(() => {
    if (userData && currentUserEmail) {
      saveUserData(currentUserEmail, userData, trips);
    }
  }, [userData, trips, currentUserEmail]);

  const handleSignUp = (email: string, password: string, data: UserData) => {
    try {
      const users = JSON.parse(localStorage.getItem('oooff_users') || '{}');

      // Check if user already exists
      if (users[email]) {
        throw new Error("An account with this email already exists. Please sign in instead.");
      }

      // Create new user
      const newUser: StoredUser = {
        email,
        password,
        userData: {
          ...data,
          timeOffDates: data.timeOffDates.map(d => d.toISOString()),
        },
        trips: [],
      };

      users[email] = newUser;
      localStorage.setItem('oooff_users', JSON.stringify(users));
      localStorage.setItem('oooff_current_user', email);

      setCurrentUserEmail(email);
      setUserData(data);
      setTrips([]);
    } catch (error) {
      console.error("Sign up error:", error);
      throw error;
    }
  };

  const handleSignIn = (email: string, password: string) => {
    try {
      const users = JSON.parse(localStorage.getItem('oooff_users') || '{}');
      const user = users[email];

      if (!user) {
        throw new Error("No account found with this email. Please sign up first.");
      }

      if (user.password !== password) {
        throw new Error("Invalid password. Please try again.");
      }

      // Sign in successful
      localStorage.setItem('oooff_current_user', email);
      loadUserData(email);
    } catch (error) {
      console.error("Sign in error:", error);
      throw error;
    }
  };

  const handleAddTrip = (trip: Omit<Trip, "id">) => {
    const newTrip = {
      ...trip,
      id: Date.now().toString(),
    };
    setTrips([...trips, newTrip]);
  };

  const handleDeleteTrip = (id: string) => {
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

  const handleUpdatePTODays = (days: number) => {
    if (!userData) return;
    setUserData({
      ...userData,
      totalPTODays: days,
    });
  };

  const handleSignOut = () => {
    localStorage.removeItem('oooff_current_user');
    setUserData(null);
    setTrips([]);
    setCurrentUserEmail(null);
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