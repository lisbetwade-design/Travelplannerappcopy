import { useState } from "react";
import { Plane, Mail, Lock, ArrowRight, Eye, EyeOff } from "lucide-react";
import { Button } from "./ui/button";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "./ui/card";
import { Alert, AlertDescription } from "./ui/alert";

interface AuthScreenProps {
  onSignIn: (email: string, password: string) => Promise<void>;
  onSignUp: (email: string, password: string) => Promise<void>;
  onForgotPassword: (email: string) => Promise<void>;
}

export function AuthScreen({ onSignIn, onSignUp, onForgotPassword }: AuthScreenProps) {
  const [mode, setMode] = useState<"signin" | "signup" | "forgot">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    // Validation
    if (!email || !email.includes("@")) {
      setError("Please enter a valid email address");
      return;
    }

    if (mode !== "forgot" && password.length < 6) {
      setError("Password must be at least 6 characters long");
      return;
    }

    if (mode === "signup" && password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setIsLoading(true);

    try {
      if (mode === "signin") {
        await onSignIn(email, password);
      } else if (mode === "signup") {
        await onSignUp(email, password);
      } else if (mode === "forgot") {
        await onForgotPassword(email);
        setSuccess("Password reset email sent! Check your inbox.");
        setTimeout(() => setMode("signin"), 3000);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !isLoading) {
      handleSubmit(e as any);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo/Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center bg-green-600 p-4 rounded-2xl mb-4 shadow-lg">
            <Plane className="h-10 w-10 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900">Oooff</h1>
          <p className="text-gray-600 mt-2">Your Smart Travel Planner</p>
        </div>

        {/* Auth Card */}
        <Card className="shadow-xl border-0">
          <CardHeader>
            <CardTitle className="text-2xl">
              {mode === "signin" && "Welcome back"}
              {mode === "signup" && "Create an account"}
              {mode === "forgot" && "Reset password"}
            </CardTitle>
            <CardDescription>
              {mode === "signin" && "Sign in to your account to continue"}
              {mode === "signup" && "Sign up to start planning your trips"}
              {mode === "forgot" && "Enter your email to reset your password"}
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Error/Success Alert */}
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              
              {success && (
                <Alert className="bg-green-50 text-green-900 border-green-200">
                  <AlertDescription>{success}</AlertDescription>
                </Alert>
              )}

              {/* Email Field */}
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="you@example.com"
                    className="pl-10 h-11"
                    disabled={isLoading}
                    autoComplete="email"
                  />
                </div>
              </div>

              {/* Password Field (not shown for forgot password) */}
              {mode !== "forgot" && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password">Password</Label>
                    {mode === "signin" && (
                      <button
                        type="button"
                        onClick={() => setMode("forgot")}
                        className="text-sm text-green-600 hover:text-green-700 hover:underline"
                      >
                        Forgot password?
                      </button>
                    )}
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder="Enter your password"
                      className="pl-10 pr-10 h-11"
                      disabled={isLoading}
                      autoComplete={mode === "signup" ? "new-password" : "current-password"}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? (
                        <EyeOff className="h-5 w-5" />
                      ) : (
                        <Eye className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                </div>
              )}

              {/* Confirm Password Field (only for signup) */}
              {mode === "signup" && (
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <Input
                      id="confirmPassword"
                      type={showPassword ? "text" : "password"}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder="Confirm your password"
                      className="pl-10 h-11"
                      disabled={isLoading}
                      autoComplete="new-password"
                    />
                  </div>
                </div>
              )}

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full h-11 bg-green-600 hover:bg-green-700 text-base"
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                    <span>Please wait...</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <span>
                      {mode === "signin" && "Sign In"}
                      {mode === "signup" && "Create Account"}
                      {mode === "forgot" && "Send Reset Link"}
                    </span>
                    <ArrowRight className="h-4 w-4" />
                  </div>
                )}
              </Button>
            </form>
          </CardContent>

          <CardFooter className="flex flex-col space-y-4">
            <div className="relative w-full">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-2 text-gray-500">
                  {mode === "forgot" ? "Remember your password?" : "Or"}
                </span>
              </div>
            </div>

            {/* Mode Toggle */}
            {mode === "signin" && (
              <div className="text-center text-sm">
                <span className="text-gray-600">Don't have an account? </span>
                <button
                  type="button"
                  onClick={() => {
                    setMode("signup");
                    setError(null);
                    setSuccess(null);
                  }}
                  className="text-green-600 hover:text-green-700 font-semibold hover:underline"
                >
                  Sign up
                </button>
              </div>
            )}

            {mode === "signup" && (
              <div className="text-center text-sm">
                <span className="text-gray-600">Already have an account? </span>
                <button
                  type="button"
                  onClick={() => {
                    setMode("signin");
                    setError(null);
                    setSuccess(null);
                  }}
                  className="text-green-600 hover:text-green-700 font-semibold hover:underline"
                >
                  Sign in
                </button>
              </div>
            )}

            {mode === "forgot" && (
              <div className="text-center text-sm">
                <button
                  type="button"
                  onClick={() => {
                    setMode("signin");
                    setError(null);
                    setSuccess(null);
                  }}
                  className="text-green-600 hover:text-green-700 font-semibold hover:underline"
                >
                  Back to sign in
                </button>
              </div>
            )}
          </CardFooter>
        </Card>

        {/* Footer */}
        <p className="text-center text-sm text-gray-500 mt-8">
          By continuing, you agree to Oooff's Terms of Service and Privacy Policy
        </p>
      </div>
    </div>
  );
}
