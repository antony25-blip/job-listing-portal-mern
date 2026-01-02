import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function RoleRoute({ allowedRole, children }) {
  const auth = useAuth();

  // 🔐 Context not ready yet
  if (!auth) return <Navigate to="/login" />;

  const { user } = auth;

  if (!user) return <Navigate to="/login" />;

  if (user.role !== allowedRole) {
    return <Navigate to="/dashboard" />;
  }

  return children;
}
