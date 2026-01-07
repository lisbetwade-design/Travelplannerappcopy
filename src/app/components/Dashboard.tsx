import { useState } from "react";
import { Calendar as CalendarIcon, Sparkles, Compass, Zap, Settings, LogOut } from "lucide-react";
import { Button } from "./ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { HolidayCalendar } from "./HolidayCalendar";
import { ItineraryBuilder } from "./ItineraryBuilder";
import { UpcomingTrips, type Trip } from "./UpcomingTrips";
import { LastMinuteDeals } from "./LastMinuteDeals";
import { SettingsDialog } from "./SettingsDialog";

interface DashboardProps {
  country: string;
  timeOffDates: Date[];
  totalPTODays: number;
  trips: Trip[];
  onAddTrip: (trip: Omit<Trip, "id">) => void;
  onDeleteTrip: (id: string) => void;
  onAddTimeOff: (dates: Date[]) => void;
  onRemoveTimeOff: (dates: Date[]) => void;
  onUpdatePTODays: (days: number) => void;
  onReset: () => void;
}

export function Dashboard({ country, timeOffDates, totalPTODays, trips, onAddTrip, onDeleteTrip, onAddTimeOff, onRemoveTimeOff, onUpdatePTODays, onReset }: DashboardProps) {
  const [activeTab, setActiveTab] = useState("calendar");
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-10 shadow-sm backdrop-blur-sm bg-white/95">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-br from-green-500 to-green-600 p-2.5 rounded-xl shadow-sm">
                <CalendarIcon className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold">Oooff</h1>
                <p className="text-sm text-muted-foreground">{country}</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon" onClick={() => setIsSettingsOpen(true)}>
                <Settings className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" onClick={onReset}>
                <LogOut className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4 h-auto p-1 bg-white rounded-xl shadow-sm">
            <TabsTrigger value="calendar" className="flex items-center gap-2 rounded-lg data-[state=active]:shadow-sm">
              <CalendarIcon className="h-4 w-4" />
              <span>Calendar</span>
            </TabsTrigger>
            <TabsTrigger value="itinerary" className="flex items-center gap-2 rounded-lg data-[state=active]:shadow-sm">
              <Sparkles className="h-4 w-4" />
              <span>AI Itinerary</span>
            </TabsTrigger>
            <TabsTrigger value="experiences" className="flex items-center gap-2 rounded-lg data-[state=active]:shadow-sm">
              <Compass className="h-4 w-4" />
              <span>Upcoming Trips</span>
            </TabsTrigger>
            <TabsTrigger value="deals" className="flex items-center gap-2 rounded-lg data-[state=active]:shadow-sm">
              <Zap className="h-4 w-4" />
              <span>Last-Minute</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="calendar" className="mt-6">
            <HolidayCalendar
              country={country}
              timeOffDates={timeOffDates}
              trips={trips}
              onAddTrip={onAddTrip}
              onAddTimeOff={onAddTimeOff}
              onRemoveTimeOff={onRemoveTimeOff}
              totalPTODays={totalPTODays}
            />
          </TabsContent>

          <TabsContent value="itinerary" className="space-y-6">
            <div className="space-y-2">
              <h2 className="text-2xl font-bold">AI-Powered Itinerary Builder</h2>
              <p className="text-muted-foreground">
                Let our AI create personalized travel plans tailored to your interests and budget
              </p>
            </div>
            <ItineraryBuilder />
          </TabsContent>

          <TabsContent value="experiences" className="space-y-6">
            <div className="space-y-2">
              <h2 className="text-2xl font-bold">Upcoming Trips</h2>
              <p className="text-muted-foreground">
                All your planned trips, sorted by date
              </p>
            </div>
            <UpcomingTrips trips={trips} onDeleteTrip={onDeleteTrip} />
          </TabsContent>

          <TabsContent value="deals" className="space-y-6">
            <div className="space-y-2">
              <h2 className="text-2xl font-bold">Last-Minute Travel Deals</h2>
              <p className="text-muted-foreground">
                Spontaneous getaways at incredible prices - book now before they're gone!
              </p>
            </div>
            <LastMinuteDeals />
          </TabsContent>
        </Tabs>
      </main>

      {/* Settings Dialog */}
      <SettingsDialog
        open={isSettingsOpen}
        onOpenChange={setIsSettingsOpen}
        totalPTODays={totalPTODays}
        timeOffDates={timeOffDates}
        onSave={onUpdatePTODays}
        onRemoveTimeOff={onRemoveTimeOff}
      />
    </div>
  );
}