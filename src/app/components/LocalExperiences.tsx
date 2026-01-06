import { useState, useEffect } from "react";
import { Star, Clock, MapPin, DollarSign } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { generateExperiences, type Experience } from "../data/mockData";

interface LocalExperiencesProps {
  timeOffDates: Date[];
}

export function LocalExperiences({ timeOffDates }: LocalExperiencesProps) {
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");

  useEffect(() => {
    if (timeOffDates.length > 0) {
      const startDate = timeOffDates[0];
      const endDate = timeOffDates[timeOffDates.length - 1];
      setExperiences(generateExperiences(startDate, endDate));
    }
  }, [timeOffDates]);

  const categories = ["All", "Culture", "Food & Drink", "Adventure"];

  const filteredExperiences = experiences.filter((exp) => {
    const matchesSearch =
      searchQuery === "" ||
      exp.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      exp.location.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "All" || exp.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Discover Local Experiences</CardTitle>
        <CardDescription>
          Find unique activities and events based on your travel dates
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <Input
            placeholder="Search experiences..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1"
          />
          <div className="flex gap-2 flex-wrap">
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(category)}
              >
                {category}
              </Button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredExperiences.map((experience) => (
            <Card key={experience.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className="relative h-48 bg-gray-200">
                <img
                  src={experience.imageUrl}
                  alt={experience.title}
                  className="w-full h-full object-cover"
                />
                <Badge className="absolute top-2 right-2 bg-white text-black">
                  {experience.category}
                </Badge>
              </div>
              <CardContent className="p-4 space-y-3">
                <div>
                  <h3 className="font-semibold line-clamp-1">{experience.title}</h3>
                  <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                    <MapPin className="h-3 w-3" />
                    {experience.location}
                  </p>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="font-medium">{experience.rating}</span>
                  </div>
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    {experience.duration}
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t">
                  <div className="flex items-center gap-1">
                    <DollarSign className="h-4 w-4" />
                    <span className="font-semibold">${experience.price}</span>
                  </div>
                  <Button size="sm">Book Now</Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredExperiences.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">
            <p>No experiences found matching your criteria</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
