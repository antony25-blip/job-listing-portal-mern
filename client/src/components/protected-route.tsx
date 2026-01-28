import { useAuth, UserRole } from "@/lib/auth-context";
import { Loader2 } from "lucide-react";
import { Navigate } from "react-router-dom";
import { ReactNode } from "react";

interface ProtectedRouteProps {
    children: ReactNode;
    allowedRole?: UserRole;
}

export default function ProtectedRoute({
    children,
    allowedRole,
}: ProtectedRouteProps) {
    const { user, isLoading } = useAuth();

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
        );
    }

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    if (allowedRole && user.role !== allowedRole) {
        // Redirect to appropriate dashboard if role mismatch
        return <Navigate to={user.role === "employer" ? "/employer/dashboard" : "/seeker/dashboard"} replace />;
    }

    return <>{children}</>;
}
