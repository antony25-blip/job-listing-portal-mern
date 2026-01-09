import { createContext, useContext, useState, ReactNode } from "react";

export type UserRole = "employer" | "jobseeker" | null;

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  avatar?: string;
  company?: string;
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
  login: (email: string, password: string, role: UserRole) => void;
  loginWithGoogle: (role: UserRole) => void;
  register: (email: string, password: string, name: string, role: UserRole) => void;
  logout: () => void;
  updateProfile: (updates: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  const login = (email: string, _password: string, role: UserRole) => {
    const mockUser: User = {
      id: "1",
      email,
      name: email.split("@")[0],
      role,
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${email}`,
      company: role === "employer" ? "TechCorp Inc." : undefined,
      title: role === "jobseeker" ? "Software Developer" : "HR Manager",
      location: "San Francisco, CA",
      bio: "Passionate about technology and innovation.",
      skills: role === "jobseeker" ? ["React", "TypeScript", "Node.js", "Python"] : [],
      experience: role === "jobseeker" ? ["3 years at StartupXYZ", "2 years at BigTech Co."] : [],
    };
    setUser(mockUser);
  };

  const loginWithGoogle = (role: UserRole) => {
    const mockUser: User = {
      id: "google-1",
      email: "user@gmail.com",
      name: "Google User",
      role,
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=google",
      company: role === "employer" ? "Google Corp" : undefined,
      title: role === "jobseeker" ? "Full Stack Developer" : "Talent Acquisition",
      location: "Mountain View, CA",
      bio: "Signed in with Google",
      skills: role === "jobseeker" ? ["JavaScript", "React", "Cloud"] : [],
    };
    setUser(mockUser);
  };

  const register = (email: string, _password: string, name: string, role: UserRole) => {
    const mockUser: User = {
      id: Date.now().toString(),
      email,
      name,
      role,
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${email}`,
      company: role === "employer" ? "New Company" : undefined,
      title: "",
      location: "",
      bio: "",
      skills: [],
      experience: [],
    };
    setUser(mockUser);
  };

  const logout = () => {
    setUser(null);
  };

  const updateProfile = (updates: Partial<User>) => {
    if (user) {
      setUser({ ...user, ...updates });
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
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
