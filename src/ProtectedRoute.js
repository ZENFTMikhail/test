import { Navigate } from "react-router-dom";

function ProtectedRoute({ children }) {
  const token = localStorage.getItem("token");

  return token ? <Navigate to="/profile" /> : children;
}

export default ProtectedRoute;