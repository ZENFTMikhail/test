import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ login, children }) => {
  return login ? children : <Navigate to="/signin" />;
};

export default ProtectedRoute;
