import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { MapPin, Calendar as CalendarIcon, Trash2 } from "lucide-react";
import { format, differenceInDays } from "date-fns";

export interface Trip {
  id: string;
  destination: string;
  startDate: Date;
  endDate: Date;
}

interface UpcomingTripsProps {
  trips: Trip[];
  onDeleteTrip: (id: string) => void;
}

export function UpcomingTrips({ trips, onDeleteTrip }: UpcomingTripsProps) {
  const sortedTrips = [...trips].sort((a, b) => a.startDate.getTime() - b.startDate.getTime());

  return (
    <div className="grid gap-4">
      {sortedTrips.length === 0 ? (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-8">
              <div className="bg-gradient-to-br from-green-100 to-emerald-100 p-4 rounded-2xl w-fit mx-auto mb-4">
                <MapPin className="h-12 w-12 text-green-600" />
              </div>
              <h3 className="font-semibold mb-2">No Upcoming Trips</h3>
              <p className="text-sm text-muted-foreground">
                Select dates on the calendar to plan your next adventure
              </p>
            </div>
          </CardContent>
        </Card>
      ) : (
        sortedTrips.map((trip) => {
          const duration = differenceInDays(trip.endDate, trip.startDate) + 1;
          const isUpcoming = trip.startDate >= new Date();
          const isPast = trip.endDate < new Date();

          return (
            <Card key={trip.id} className={`transition-all hover:shadow-md ${isPast ? "opacity-60" : ""}`}>
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <div className="bg-gradient-to-br from-green-500 to-green-600 p-1.5 rounded-lg">
                        <MapPin className="h-4 w-4 text-white" />
                      </div>
                      <CardTitle className="text-lg">{trip.destination}</CardTitle>
                    </div>
                    <CardDescription>
                      <div className="flex flex-col gap-2 mt-2">
                        <div className="flex items-center gap-2 text-sm">
                          <CalendarIcon className="h-3 w-3" />
                          <span>
                            {format(trip.startDate, "MMM d")} - {format(trip.endDate, "MMM d, yyyy")}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant="secondary" className="text-xs">
                            {duration} {duration === 1 ? "day" : "days"}
                          </Badge>
                          {isPast && (
                            <Badge variant="outline" className="text-xs">
                              Completed
                            </Badge>
                          )}
                          {isUpcoming && !isPast && (
                            <Badge className="text-xs bg-green-600">
                              Upcoming
                            </Badge>
                          )}
                        </div>
                      </div>
                    </CardDescription>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onDeleteTrip(trip.id)}
                    className="h-8 w-8 text-muted-foreground hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
            </Card>
          );
        })
      )}
    </div>
  );
}