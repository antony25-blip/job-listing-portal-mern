import { useState, useEffect } from "react";
import { Link, useLocation, useSearch } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Briefcase, Mail, Lock, Building2, User, UserCircle } from "lucide-react";
import { useAuth, UserRole } from "@/lib/auth-context";


export default function Register() {
  const [, setLocation] = useLocation();
  const searchString = useSearch();
  const { register, loginWithGoogle, error } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<UserRole>(null); // Default to null

  useEffect(() => {
    const params = new URLSearchParams(searchString);
    const roleParam = params.get("role");
    if (roleParam === "employer" || roleParam === "jobseeker") {
      setRole(roleParam);
    }
  }, [searchString]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!role) return;
    try {
      await register(email, password, name, role);
      setLocation(role === "employer" ? "/employer/dashboard" : "/seeker/dashboard");
    } catch (error) {
      // Error is handled by auth context
    }
  };

  const handleGoogleSignup = async () => {
    if (!role) {
      // We should ideally show an error or highlight the role selection
      return;
    }
    try {
      // Note: register doesn't support Google directly unless it's just login
      await loginWithGoogle(role);
      setLocation(role === "employer" ? "/employer/dashboard" : "/seeker/dashboard");
    } catch (error) {
      // Error handled by auth context
    }
  };

  return (
    <div className="min-h-screen gradient-hero flex items-center justify-center p-4">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-accent/10 rounded-full blur-3xl animate-float" style={{ animationDelay: "-3s" }} />
      </div>

      <div className="relative w-full max-w-md animate-slide-up">
        <Link href="/" className="flex items-center justify-center gap-2 mb-8">
          <div className="w-10 h-10 gradient-primary rounded-xl flex items-center justify-center">
            <Briefcase className="w-6 h-6 text-white" />
          </div>
          <span className="text-2xl font-bold text-white" style={{ fontFamily: "var(--font-display)" }}>
            JobFlow
          </span>
        </Link>

        <Card className="border-0 shadow-2xl">
          <CardHeader className="text-center pb-2">
            <CardTitle className="text-2xl" style={{ fontFamily: "var(--font-display)" }}>
              Create Account
            </CardTitle>
            <CardDescription>Start your journey with JobFlow</CardDescription>
          </CardHeader>
          <CardContent className="pt-4">
            <Tabs value={role || ""} className="w-full" onValueChange={(v) => setRole(v as UserRole)}>
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="jobseeker" className="gap-2" data-testid="tab-register-jobseeker">
                  <User className="w-4 h-4" />
                  Job Seeker
                </TabsTrigger>
                <TabsTrigger value="employer" className="gap-2" data-testid="tab-register-employer">
                  <Building2 className="w-4 h-4" />
                  Employer
                </TabsTrigger>
              </TabsList>

              {error && (
                <div className="bg-destructive/15 text-destructive text-sm p-3 rounded-md mb-4">
                  {error}
                </div>
              )}

              {/* Show message if no role selected */}
              {!role && (
                <div className="text-center text-muted-foreground py-8 border-2 border-dashed rounded-lg mb-4">
                  <UserCircle className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p>Please select a role above to continue</p>
                </div>
              )}

              <TabsContent value="jobseeker">
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <div className="relative">
                      <UserCircle className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                      <Input
                        id="name"
                        placeholder="John Doe"
                        className="pl-10"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        data-testid="input-name"
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                      <Input
                        id="email"
                        type="email"
                        placeholder="you@example.com"
                        className="pl-10"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        data-testid="input-register-email"
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                      <Input
                        id="password"
                        type="password"
                        placeholder="••••••••"
                        className="pl-10"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        data-testid="input-register-password"
                        required
                      />
                    </div>
                  </div>
                  <Button type="submit" className="w-full gradient-primary text-white border-0" data-testid="button-register-submit">
                    Create Account
                  </Button>
                </form>
              </TabsContent>

              <TabsContent value="employer">
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="company-name">Company Name</Label>
                    <div className="relative">
                      <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                      <Input
                        id="company-name"
                        placeholder="TechCorp Inc."
                        className="pl-10"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        data-testid="input-company-name"
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email-employer">Work Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                      <Input
                        id="email-employer"
                        type="email"
                        placeholder="you@company.com"
                        className="pl-10"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        data-testid="input-register-email-employer"
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password-employer">Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                      <Input
                        id="password-employer"
                        type="password"
                        placeholder="••••••••"
                        className="pl-10"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        data-testid="input-register-password-employer"
                        required
                      />
                    </div>
                  </div>
                  <Button type="submit" className="w-full gradient-primary text-white border-0" data-testid="button-register-employer-submit">
                    Create Employer Account
                  </Button>
                </form>
              </TabsContent>
            </Tabs>

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card px-2 text-muted-foreground">Or continue with</span>
              </div>
            </div>

            <Button
              variant="outline"
              className="w-full gap-2"
              onClick={handleGoogleSignup}
              data-testid="button-google-register"
              disabled={!role} // Disable Google signup if no role is selected
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="currentColor"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="currentColor"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="currentColor"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              Sign up with Google
            </Button>

            <p className="text-center text-sm text-muted-foreground mt-6">
              Already have an account?{" "}
              <Link href="/login" className="text-primary hover:underline font-medium" data-testid="link-login">
                Sign in
              </Link>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
