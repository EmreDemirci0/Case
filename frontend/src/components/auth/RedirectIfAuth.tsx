// src/components/RedirectIfAuth.tsx
import { Navigate } from "react-router-dom";
import { ROUTES } from "../../config/routes";

function RedirectIfAuth({ children }: { children: React.ReactNode }) {
  const token = localStorage.getItem("token");

  if (token) {
    return <Navigate to={ROUTES.STUDENTS} replace />;
  }

  return children;
}

export default RedirectIfAuth;
