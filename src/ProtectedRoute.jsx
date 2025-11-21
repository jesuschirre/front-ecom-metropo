import { useAuth } from "./context/AuthContext";
import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children }) {
  const { usuario } = useAuth();
  // Si NO hay usuario → redirigir al home
  if (!usuario) {
    return <Navigate to="/" replace />;
  }

  return children;
}