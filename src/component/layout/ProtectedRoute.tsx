import { Navigate, useLocation } from "react-router";
import { useAuthStore } from "../../Auth/authStore";
import { ReactNode } from "react";

const ProtectedRoute = ({ children }: { children: ReactNode }) => {
  const { token } = useAuthStore();
  const location = useLocation();

  const isInternalNavigation = new URLSearchParams(location.search).get("fromApp");

  if (!token) {
    // Si l'utilisateur n'est pas connecté et vient directement sans "fromApp" → Redirige vers /interdit
    if (!isInternalNavigation) {
      return <Navigate to="/interdit" replace />;
    }
    // Si l'utilisateur vient du menu (clic interne), ne fait rien pour laisser la modale s'afficher
    return null;
  }

  return children;
};

export default ProtectedRoute;
