// src/components/RequireAuth.tsx
import { Navigate } from "react-router-dom";
import { ROUTES } from "../../config/routes";

function RequireAuth({ children }: { children: React.ReactNode }) {
  const token = localStorage.getItem("token");

  if (!token) {
    return <Navigate to={ROUTES.LOGIN} replace />;
  }

  return children;
}

export default RequireAuth;
