// src/pages/RootRedirect.tsx
import { Navigate } from "react-router-dom";
import { ROUTES } from "../../config/routes";

function RootRedirect() {
  const token = localStorage.getItem("token");

  if (token) {
    return <Navigate to={ROUTES.STUDENTS} replace />;
  } else {
    return <Navigate to={ROUTES.LOGIN} replace />;
  }
}

export default RootRedirect;
