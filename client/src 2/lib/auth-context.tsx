import { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { apiRequest } from "./queryClient";

declare const google: any;

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
  login: (email: string, password: string, role: UserRole) => Promise<void>;
  loginWithGoogle: (role: UserRole) => Promise<void>;
  register: (email: string, password: string, name: string, role: UserRole) => Promise<void>;
  logout: () => void;
  updateProfile: (updates: Partial<User>) => void;
  isLoading: boolean;
  error: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Check for existing session on mount
  useEffect(() => {
    const token = localStorage.getItem('jwtToken');
    if (token) {
      // TODO: Validate token with backend
      // For now, we'll assume it's valid
    }
  }, []);

  const login = async (email: string, password: string, role: UserRole) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await apiRequest("POST", "/api/auth/login", {
        email,
        password,
        role,
      });

      const data = await response.json();

      if (data.success) {
        const userData: User = {
          id: data._id || data.id,
          email: data.email,
          name: data.name,
          role: data.role,
          avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${data.email}`,
        };

        setUser(userData);
        localStorage.setItem('jwtToken', data.jwtToken);
      } else {
        throw new Error(data.message || 'Login failed');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const loginWithGoogle = async (role: UserRole) => {
    setIsLoading(true);
    setError(null);
    return new Promise<void>((resolve, reject) => {
      try {
        const client = google.accounts.oauth2.initCodeClient({
          client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
          scope: 'openid profile email',
          ux_mode: 'popup',
          callback: async (response: any) => {
            if (response.code) {
              try {
                const apiRes = await apiRequest("POST", "/api/auth/google", {
                  code: response.code,
                  role,
                });

                const data = await apiRes.json();

                if (data.token) {
                  const userData: User = {
                    id: data._id || data.id,
                    email: data.email,
                    name: data.name,
                    role: data.role,
                    avatar: data.picture || `https://api.dicebear.com/7.x/avataaars/svg?seed=${data.email}`,
                  };

                  setUser(userData);
                  localStorage.setItem('jwtToken', data.token);
                  resolve();
                } else {
                  throw new Error(data.message || 'Google login failed');
                }
              } catch (err) {
                const message = err instanceof Error ? err.message : 'Google login failed';
                setError(message);
                reject(new Error(message));
              } finally {
                setIsLoading(false);
              }
            }
          },
          error_callback: (err: any) => {
            setError('Google sign in failed');
            setIsLoading(false);
            reject(err);
          }
        });
        client.requestCode();
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Google login initialization failed';
        setError(message);
        setIsLoading(false);
        reject(new Error(message));
      }
    });
  };

  const register = async (email: string, password: string, name: string, role: UserRole) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await apiRequest("POST", "/api/auth/signup", {
        name,
        email,
        password,
        role,
      });

      const data = await response.json();

      if (data.success) {
        // After successful registration, automatically log them in
        await login(email, password, role);
      } else {
        throw new Error(data.message || 'Registration failed');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Registration failed');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('jwtToken');
    setError(null);
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
        isLoading,
        error,
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
