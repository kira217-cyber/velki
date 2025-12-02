import { AuthContext } from "@/context/AuthContext";
import { useContext } from "react";
import { Navigate, useLocation } from "react-router-dom";



const PrivateRoute = ({ children }) => {
  const {user} = useContext(AuthContext)
  const location = useLocation();

  // Check if user is logged in and has role "Mother Admin"
  if (!user || user.role !== "US") {
    return <Navigate to="/login" state={{ from: location?.pathname }} />;
  }

  return children;
};

export default PrivateRoute;