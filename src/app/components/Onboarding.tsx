import { useState } from "react";
import { Plane, MapPin, Mail, Lock, ArrowRight, ArrowLeft } from "lucide-react";
import { Button } from "./ui/button";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { countries } from "../data/holidays";

interface OnboardingProps {
  onSignUp: (email: string, password: string, data: { country: string; timeOffDates: Date[]; totalPTODays: number }) => Promise<void>;
  onSignIn: (email: string, password: string) => Promise<void>;
}

export function Onboarding({ onSignUp, onSignIn }: OnboardingProps) {
  const [step, setStep] = useState(1);
  const [isSignUp, setIsSignUp] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [country, setCountry] = useState("");
  const [totalPTODays, setTotalPTODays] = useState("20");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAuthSubmit = async () => {
    if (email && password) {
      setError(null);
      
      if (isSignUp) {
        // For sign up, go to step 2 to collect country and PTO
        setStep(2);
      } else {
        // For sign in, directly call onSignIn with loading state
        setIsLoading(true);
        try {
          await onSignIn(email, password);
        } catch (error) {
          console.error("Sign in error:", error);
          setError(error instanceof Error ? error.message : "Sign in failed. Please try again.");
          setIsLoading(false);
        }
      }
    }
  };

  const handleComplete = async () => {
    if (country && totalPTODays) {
      setIsLoading(true);
      setError(null);
      try {
        await onSignUp(email, password, { country, timeOffDates: [], totalPTODays: parseInt(totalPTODays) });
      } catch (error) {
        console.error("Sign up error:", error);
        setError(error instanceof Error ? error.message : "Sign up failed. Please try again.");
        setIsLoading(false);
      }
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !isLoading) {
      if (step === 1) {
        handleAuthSubmit();
      } else if (step === 2 && country && totalPTODays) {
        handleComplete();
      }
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b px-6 py-4 bg-white shadow-sm">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-2">
            <div className="bg-gradient-to-br from-green-500 to-green-600 p-1.5 rounded-lg">
              <Plane className="h-5 w-5 text-white" />
            </div>
            <span className="font-semibold text-xl">Oooff</span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-2xl mx-auto px-6 py-16">
        {/* Mascot/Icon */}
        <div className="flex justify-center mb-8">
          <div className="bg-gradient-to-br from-green-100 to-emerald-100 p-6 rounded-3xl shadow-sm">
            <Plane className="h-16 w-16 text-green-600" />
          </div>
        </div>

        {/* Step 1: Sign In/Sign Up */}
        {step === 1 && (
          <div className="space-y-8 animate-in fade-in duration-300">
            <div className="text-center space-y-4">
              <h1 className="text-3xl">Welcome to Oooff!</h1>
              <p className="text-lg text-gray-600">
                {isSignUp ? "Create an account to get started" : "Sign in to continue"}
              </p>
            </div>

            <div className="max-w-md mx-auto space-y-6">
              <div className="flex gap-2 p-1 bg-gray-100 rounded-lg">
                <button
                  onClick={() => {
                    setIsSignUp(true);
                    setError(null);
                  }}
                  className={`flex-1 py-2 px-4 rounded-md transition-colors ${
                    isSignUp ? "bg-green-600 text-white shadow-sm" : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  Sign Up
                </button>
                <button
                  onClick={() => {
                    setIsSignUp(false);
                    setError(null);
                  }}
                  className={`flex-1 py-2 px-4 rounded-md transition-colors ${
                    !isSignUp ? "bg-green-600 text-white shadow-sm" : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  Sign In
                </button>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email"
                      className="pl-10 h-12"
                      onKeyPress={handleKeyPress}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <Input
                      id="password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter your password"
                      className="pl-10 h-12"
                      onKeyPress={handleKeyPress}
                    />
                  </div>
                </div>
              </div>

              <Button
                onClick={handleAuthSubmit}
                disabled={!email || !password || isLoading}
                size="lg"
                className="w-full h-12 bg-green-600 hover:bg-green-700"
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                    <span>Signing in...</span>
                  </div>
                ) : (
                  isSignUp ? "Continue" : "Sign In"
                )}
              </Button>

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg text-sm">
                  {error}
                </div>
              )}

              <p className="text-center text-sm text-gray-600">
                {isSignUp ? "Already have an account? " : "Don't have an account? "}
                <button
                  onClick={() => {
                    setIsSignUp(!isSignUp);
                    setError(null);
                  }}
                  className="text-green-600 hover:underline font-medium"
                >
                  {isSignUp ? "Sign In" : "Sign Up"}
                </button>
              </p>
            </div>
          </div>
        )}

        {/* Step 2: Country and PTO Selection */}
        {step === 2 && (
          <div className="space-y-8 animate-in fade-in duration-300">
            <div className="text-center space-y-2">
              <p className="text-sm text-gray-600">Step 2 of 2</p>
              <h1 className="text-3xl">Tell us about yourself</h1>
              <p className="text-lg text-gray-600">
                We'll use this to personalize your travel planning experience
              </p>
            </div>

            <div className="max-w-md mx-auto space-y-6">
              <div className="space-y-3">
                <Label htmlFor="country" className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  Your Country
                </Label>
                <Select onValueChange={setCountry} value={country}>
                  <SelectTrigger id="country" className="w-full h-12">
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
                <p className="text-sm text-gray-600">
                  We'll show you local bank holidays
                </p>
              </div>

              <div className="space-y-3">
                <Label htmlFor="ptoDays">
                  Annual PTO Days
                </Label>
                <Input
                  id="ptoDays"
                  type="number"
                  min="0"
                  max="365"
                  value={totalPTODays}
                  onChange={(e) => setTotalPTODays(e.target.value)}
                  placeholder="e.g., 20"
                  className="h-12"
                  onKeyPress={handleKeyPress}
                />
                <p className="text-sm text-gray-600">
                  How many vacation days do you get per year?
                </p>
              </div>
            </div>

            {error && (
              <div className="max-w-md mx-auto bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex items-center justify-center gap-3 mt-12">
          {step === 2 && (
            <>
              <Button
                onClick={() => setStep(1)}
                variant="outline"
                size="lg"
                className="gap-2 h-12 border-green-600 text-green-600 hover:bg-green-50"
              >
                <ArrowLeft className="h-4 w-4" />
                Back
              </Button>
              <Button
                onClick={handleComplete}
                disabled={!country || !totalPTODays || isLoading}
                size="lg"
                className="gap-2 px-8 h-12 bg-green-600 hover:bg-green-700"
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                    <span>Creating account...</span>
                  </div>
                ) : (
                  <>
                    Get Started
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </Button>
            </>
          )}
        </div>
      </main>
    </div>
  );
}