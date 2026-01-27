import { useAuth, UserRole } from "@/lib/auth-context";
import { Loader2 } from "lucide-react";
import { Redirect, Route, Switch } from "wouter";

interface ProtectedRouteProps {
    component: React.ComponentType<any>;
    path: string;
    allowedRole?: UserRole;
}

export default function ProtectedRoute({
    component: Component,
    path,
    allowedRole,
}: ProtectedRouteProps) {
    const { user, isLoading } = useAuth();

    return (
        <Route path={path}>
            {(params) => {
                if (isLoading) {
                    return (
                        <div className="flex justify-center items-center h-screen">
                            <Loader2 className="w-8 h-8 animate-spin text-primary" />
                        </div>
                    );
                }

                if (!user) {
                    return <Redirect to="/login" />;
                }

                if (allowedRole && user.role !== allowedRole) {
                    // Redirect to appropriate dashboard if role mismatch
                    return <Redirect to={user.role === "employer" ? "/employer/dashboard" : "/seeker/dashboard"} />;
                }

                return <Component {...params} />;
            }}
        </Route>
    );
}
