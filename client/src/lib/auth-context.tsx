import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { apiRequest } from "./queryClient";
import { useToast } from "@/hooks/use-toast";

export type UserRole = "employer" | "jobseeker" | null;

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  avatar?: string;
  company?: string; // Mapped from backend if available, or undefined
  title?: string;
  location?: string;
  bio?: string;
  skills?: string[];
  experience?: string[];
  resumeUrl?: string;
  phone?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string, role: UserRole) => Promise<void>;
  loginWithGoogle: (role: UserRole) => Promise<void>;
  register: (email: string, password: string, name: string, role: UserRole) => Promise<void>;
  logout: () => void;
  updateProfile: (updates: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem("token");
        if (token) {
          const res = await apiRequest("GET", "/api/auth/me");
          const data = await res.json();
          if (data.success) {
            setUser({
              id: data.user._id,
              email: data.user.email,
              name: data.user.name,
              role: data.user.role,
              company: data.user.companyName,
              title: data.user.title,
              location: data.user.location,
              bio: data.user.bio,
              skills: data.user.skills,
              experience: data.user.experience,
              resumeUrl: data.user.resumeUrl,
              phone: data.user.phone,
            });
          } else {
            localStorage.removeItem("token");
          }
        }
      } catch (error) {
        console.error("Auth check failed:", error);
        localStorage.removeItem("token");
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (email: string, password: string, role: UserRole) => {
    try {
      const res = await apiRequest("POST", "/api/auth/login", { email, password });
      const data = await res.json();

      if (!data.success) {
        throw new Error(data.message || "Login failed");
      }

      localStorage.setItem("token", data.jwtToken);
      setUser({
        id: data._id || "unknown",
        email: data.email,
        name: data.name,
        role: data.role,
        // Login might not return full profile, so we might need to fetch it or just rely on checkAuth on reload. 
        // Better approach: Let login set basic info, and a separate effect or the component can fetch profile details if needed.
        // However, given the current structure, we should at least try to map what we have.
        // PROPER FIX: After login, immediately fetch full profile.
      });

      // Fetch full profile immediately after login to populate state
      if (data.role) {
        try {
          // We can reuse the logic from checkAuth effectively by just calling the API
          const profileRes = await apiRequest("GET", "/api/auth/me"); // Use the updated /me endpoint
          const profileData = await profileRes.json();
          if (profileData.success) {
            setUser({
              id: profileData.user._id,
              email: profileData.user.email,
              name: profileData.user.name,
              role: profileData.user.role,
              company: profileData.user.companyName,
              title: profileData.user.title,
              location: profileData.user.location,
              bio: profileData.user.bio,
              skills: profileData.user.skills,
              experience: profileData.user.experience,
              resumeUrl: profileData.user.resumeUrl,
              phone: profileData.user.phone,
            });
          }
        } catch (e) {
          console.error("Failed to fetch full profile after login", e);
        }
      }

      toast({
        title: "Welcome back!",
        description: "You have successfully logged in.",
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Login failed",
        description: error.message || "Please check your credentials.",
      });
      throw error;
    }
  };

  const loginWithGoogle = async (role: UserRole) => {
    // Placeholder for actual Google Login implementation
    // This requires @react-oauth/google integration in the UI components
    toast({
      title: "Google Login",
      description: "Google Login integration requires additional frontend setup. Please use Email/Password for now.",
    });
    console.log("Google login initiated for role:", role);
  };

  const register = async (email: string, password: string, name: string, role: UserRole) => {
    try {
      const res = await apiRequest("POST", "/api/auth/signup", { email, password, name, role });
      const data = await res.json();

      if (!data.success) {
        throw new Error(data.message || "Registration failed");
      }

      toast({
        title: "Account created",
        description: "Please log in with your new account.",
      });

      // Optionally auto-login here if backend returns token on signup
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Registration failed",
        description: error.message || "Could not create account.",
      });
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
    toast({
      title: "Logged out",
      description: "You have been logged out successfully.",
    });
  };

  const updateProfile = async (updates: Partial<User>) => {
    if (!user) return;

    // Optimistic update
    setUser({ ...user, ...updates });

    try {
      const endpoint = user.role === "employer"
        ? "/api/profile/employer"
        : "/api/profile/jobseeker";

      // Map fields to backend expectations
      let payload: any = { ...updates };

      if (user.role === "jobseeker") {
        if (updates.name) payload.fullName = updates.name;
        // title, bio, location, phone, skills, experience match
      } else if (user.role === "employer") {
        if (updates.company) payload.companyName = updates.company;
        if (updates.bio) payload.description = updates.bio;
        // location, phone, website match (if added to User)
      }

      const res = await apiRequest("POST", endpoint, payload);

      if (!res.ok) {
        throw new Error("Failed to save profile");
      }

      const data = await res.json();
      if (!data.success) {
        throw new Error(data.message || "Failed to update");
      }

      // Optionally update with server response to be sure
      // setUser(current => ({ ...current, ...updates })); 

      toast({
        title: "Profile saved",
        description: "Your profile information has been updated.",
      });
    } catch (error) {
      console.error("Update profile error:", error);
      toast({
        variant: "destructive",
        title: "Save failed",
        description: "Could not save your profile changes. Please try again.",
      });
      // Revert optimistic update if needed? For now, we leave it as user might retry.
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        loginWithGoogle,
        register,
        logout,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
