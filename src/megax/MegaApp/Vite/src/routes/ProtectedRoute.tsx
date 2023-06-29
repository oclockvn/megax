import { Navigate, Outlet } from "react-router-dom";
import storage from "../lib/storage";

export const ProtectedRoute = () => {
  const token = storage.get("token");

  if (!token) {
    return <Navigate to="/login" />;
  }
  return <Outlet />;
};
