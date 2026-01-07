import { useState } from "react";
import { Sparkles, MapPin, Calendar as CalendarIcon, DollarSign, Loader } from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Badge } from "./ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { generateAIItinerary, type Itinerary } from "../data/mockData";
import { format } from "date-fns";

const interestOptions = [
  "Culture",
  "Adventure",
  "Food & Drink",
  "Beach",
  "Shopping",
  "Nightlife",
  "Nature",
  "History",
  "Art",
  "Wellness",
];

export function ItineraryBuilder() {
  const [destination, setDestination] = useState("");
  const [startDate, setStartDate] = useState("");
  const [days, setDays] = useState(3);
  const [budget, setBudget] = useState(1000);
  const [interests, setInterests] = useState<string[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [itinerary, setItinerary] = useState<Itinerary | null>(null);

  const toggleInterest = (interest: string) => {
    if (interests.includes(interest)) {
      setInterests(interests.filter((i) => i !== interest));
    } else {
      setInterests([...interests, interest]);
    }
  };

  const handleGenerate = async () => {
    if (!destination || !startDate) return;

    setIsGenerating(true);
    // Simulate AI processing
    await new Promise((resolve) => setTimeout(resolve, 2000));

    const generatedItinerary = generateAIItinerary(
      destination,
      new Date(startDate),
      days,
      budget,
      interests
    );

    setItinerary(generatedItinerary);
    setIsGenerating(false);
  };

  const canGenerate = destination && startDate && interests.length > 0;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <div className="bg-gradient-to-br from-green-500 to-green-600 p-1.5 rounded-lg">
              <Sparkles className="h-5 w-5 text-white" />
            </div>
            <CardTitle>AI Itinerary Builder</CardTitle>
          </div>
          <CardDescription>
            Let AI create a personalized travel itinerary based on your preferences
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="destination">
                <MapPin className="h-4 w-4 inline mr-1" />
                Destination
              </Label>
              <Input
                id="destination"
                placeholder="e.g., Paris, Tokyo, New York"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="startDate">
                <CalendarIcon className="h-4 w-4 inline mr-1" />
                Start Date
              </Label>
              <Input
                id="startDate"
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                min={new Date().toISOString().split("T")[0]}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="days">Number of Days: {days}</Label>
              <input
                id="days"
                type="range"
                min="1"
                max="14"
                value={days}
                onChange={(e) => setDays(Number(e.target.value))}
                className="w-full accent-green-600"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="budget">
                <DollarSign className="h-4 w-4 inline mr-1" />
                Budget (USD): ${budget}
              </Label>
              <input
                id="budget"
                type="range"
                min="500"
                max="5000"
                step="100"
                value={budget}
                onChange={(e) => setBudget(Number(e.target.value))}
                className="w-full accent-green-600"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Select Your Interests</Label>
            <div className="flex flex-wrap gap-2">
              {interestOptions.map((interest) => (
                <Badge
                  key={interest}
                  variant={interests.includes(interest) ? "default" : "outline"}
                  className="cursor-pointer hover:scale-105 transition-all"
                  onClick={() => toggleInterest(interest)}
                >
                  {interest}
                </Badge>
              ))}
            </div>
          </div>

          <Button
            onClick={handleGenerate}
            disabled={!canGenerate || isGenerating}
            className="w-full"
            size="lg"
          >
            {isGenerating ? (
              <>
                <Loader className="h-4 w-4 mr-2 animate-spin" />
                Generating Your Perfect Itinerary...
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4 mr-2" />
                Generate AI Itinerary
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {itinerary && (
        <Card className="animate-in fade-in duration-500">
          <CardHeader>
            <CardTitle>Your Personalized Itinerary</CardTitle>
            <CardDescription>
              {itinerary.totalDays}-day trip to {itinerary.destination} • Estimated budget: $
              {itinerary.budget}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="day-1" className="w-full">
              <TabsList className="w-full flex-wrap h-auto p-1 bg-white rounded-xl shadow-sm">
                {itinerary.days.map((day) => (
                  <TabsTrigger key={day.day} value={`day-${day.day}`} className="rounded-lg data-[state=active]:shadow-sm">
                    Day {day.day}
                  </TabsTrigger>
                ))}
              </TabsList>

              {itinerary.days.map((day) => (
                <TabsContent key={day.day} value={`day-${day.day}`} className="space-y-4 mt-4">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold">{format(day.date, "EEEE, MMMM d, yyyy")}</h3>
                    <Badge variant="secondary">
                      ${day.activities.reduce((sum, a) => sum + a.cost, 0)} total
                    </Badge>
                  </div>

                  <div className="space-y-4">
                    {day.activities.map((activity, idx) => (
                      <div
                        key={idx}
                        className="relative pl-8 pb-4 border-l-2 border-gray-200 last:border-0"
                      >
                        <div className="absolute left-0 top-0 -translate-x-1/2 w-4 h-4 rounded-full bg-green-600 border-2 border-white shadow-sm" />
                        
                        <div className="space-y-2">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <p className="text-sm text-muted-foreground">{activity.time}</p>
                              <h4 className="font-semibold">{activity.title}</h4>
                              <p className="text-sm text-muted-foreground">{activity.description}</p>
                              <p className="text-sm flex items-center gap-1 mt-1">
                                <MapPin className="h-3 w-3" />
                                {activity.location}
                              </p>
                            </div>
                            <Badge variant="outline" className="ml-4">
                              ${activity.cost}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </TabsContent>
              ))}
            </Tabs>
          </CardContent>
        </Card>
      )}
    </div>
  );
}