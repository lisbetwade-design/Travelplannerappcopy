import { useEffect, useState } from "react";
import { Zap, Plane, Hotel, Calendar as CalendarIcon, TrendingDown } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { generateLastMinuteDeals, type LastMinuteDeal } from "../data/mockData";
import { format, differenceInDays } from "date-fns";

export function LastMinuteDeals() {
  const [deals, setDeals] = useState<LastMinuteDeal[]>([]);

  useEffect(() => {
    setDeals(generateLastMinuteDeals());
  }, []);

  const getDaysUntilDeparture = (departureDate: Date) => {
    return differenceInDays(departureDate, new Date());
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <div className="bg-gradient-to-br from-green-500 to-green-600 p-1.5 rounded-lg">
            <Zap className="h-5 w-5 text-white" />
          </div>
          <CardTitle>Last-Minute Travel Deals</CardTitle>
        </div>
        <CardDescription>
          Spontaneous getaways at amazing prices - limited availability!
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {deals.map((deal) => {
            const daysUntil = getDaysUntilDeparture(deal.departureDate);
            const tripDays = differenceInDays(deal.returnDate, deal.departureDate);

            return (
              <Card key={deal.id} className="overflow-hidden hover:shadow-lg transition-all border-0 shadow-md">
                <div className="relative h-48 bg-gray-200">
                  <img
                    src={deal.imageUrl}
                    alt={deal.destination}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-3 left-3 right-3 flex justify-between">
                    <Badge className="bg-orange-600 text-white shadow-lg">
                      <Zap className="h-3 w-3 mr-1" />
                      {deal.discount}% OFF
                    </Badge>
                    <Badge variant="secondary" className="bg-white shadow-lg">
                      Leaves in {daysUntil} days
                    </Badge>
                  </div>
                </div>

                <CardContent className="p-5 space-y-4">
                  <div>
                    <h3 className="font-semibold text-lg">{deal.destination}</h3>
                    <p className="text-sm text-muted-foreground">{deal.country}</p>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                      <span>
                        {format(deal.departureDate, "MMM d")} - {format(deal.returnDate, "MMM d, yyyy")}
                      </span>
                      <Badge variant="outline" className="ml-auto">
                        {tripDays} days
                      </Badge>
                    </div>

                    <div className="flex gap-2">
                      {deal.flightIncluded && (
                        <Badge variant="secondary" className="flex items-center gap-1">
                          <Plane className="h-3 w-3" />
                          Flight
                        </Badge>
                      )}
                      {deal.hotelIncluded && (
                        <Badge variant="secondary" className="flex items-center gap-1">
                          <Hotel className="h-3 w-3" />
                          Hotel
                        </Badge>
                      )}
                    </div>
                  </div>

                  <div className="flex items-end justify-between pt-3 border-t">
                    <div>
                      <p className="text-sm text-muted-foreground line-through">
                        ${deal.originalPrice}
                      </p>
                      <div className="flex items-center gap-1">
                        <TrendingDown className="h-4 w-4 text-green-600" />
                        <p className="text-2xl font-bold text-green-600">${deal.price}</p>
                      </div>
                    </div>
                    <Button className="shadow-sm">Book Now</Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {deals.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">
            <p>No last-minute deals available at the moment</p>
            <p className="text-sm mt-2">Check back soon for new opportunities!</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}