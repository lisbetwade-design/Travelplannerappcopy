import { useState } from "react";
import { MapPin, ArrowRight, Calendar } from "lucide-react";
import { Button } from "./ui/button";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { countries } from "../data/holidays";

interface ProfileSetupProps {
  onComplete: (country: string, totalPTODays: number) => void;
  userEmail: string;
}

export function ProfileSetup({ onComplete, userEmail }: ProfileSetupProps) {
  const [country, setCountry] = useState("");
  const [totalPTODays, setTotalPTODays] = useState("20");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (country && totalPTODays && parseInt(totalPTODays) > 0) {
      setIsLoading(true);
      onComplete(country, parseInt(totalPTODays));
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && country && totalPTODays) {
      handleSubmit(e as any);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50 flex items-center justify-center p-4">
      <div className="w-full max-w-lg">
        {/* Progress Indicator */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 bg-green-100 px-4 py-2 rounded-full mb-4">
            <div className="w-2 h-2 bg-green-600 rounded-full" />
            <span className="text-sm font-medium text-green-800">Step 2 of 2</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Tell us about yourself</h1>
          <p className="text-gray-600">
            Signed in as <span className="font-medium text-green-600">{userEmail}</span>
          </p>
        </div>

        {/* Setup Card */}
        <Card className="shadow-xl border-0">
          <CardHeader>
            <CardTitle className="text-2xl">Set up your profile</CardTitle>
            <CardDescription>
              We'll use this information to personalize your travel planning experience
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Country Selection */}
              <div className="space-y-3">
                <Label htmlFor="country" className="flex items-center gap-2 text-base">
                  <MapPin className="h-5 w-5 text-green-600" />
                  Your Country
                </Label>
                <Select onValueChange={setCountry} value={country}>
                  <SelectTrigger id="country" className="w-full h-12 text-base">
                    <SelectValue placeholder="Select your country" />
                  </SelectTrigger>
                  <SelectContent>
                    {countries.map((c) => (
                      <SelectItem key={c} value={c}>
                        {c}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="text-sm text-gray-600 flex items-start gap-2">
                  <span className="text-green-600 mt-0.5">💡</span>
                  We'll automatically show you local bank holidays for your country
                </p>
              </div>

              {/* PTO Days Input */}
              <div className="space-y-3">
                <Label htmlFor="ptoDays" className="flex items-center gap-2 text-base">
                  <Calendar className="h-5 w-5 text-green-600" />
                  Annual Vacation Days
                </Label>
                <Input
                  id="ptoDays"
                  type="number"
                  min="0"
                  max="365"
                  value={totalPTODays}
                  onChange={(e) => setTotalPTODays(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="e.g., 20"
                  className="h-12 text-base"
                  disabled={isLoading}
                />
                <p className="text-sm text-gray-600 flex items-start gap-2">
                  <span className="text-green-600 mt-0.5">💡</span>
                  How many vacation/PTO days do you get per year? We'll help you track them.
                </p>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={!country || !totalPTODays || parseInt(totalPTODays) <= 0 || isLoading}
                className="w-full h-12 bg-green-600 hover:bg-green-700 text-base mt-8"
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                    <span>Setting up your profile...</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <span>Get Started</span>
                    <ArrowRight className="h-5 w-5" />
                  </div>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Info Box */}
        <div className="mt-6 p-4 bg-white/60 backdrop-blur rounded-lg border border-green-100">
          <p className="text-sm text-gray-600 text-center">
            You can always change these settings later from your dashboard
          </p>
        </div>
      </div>
    </div>
  );
}
