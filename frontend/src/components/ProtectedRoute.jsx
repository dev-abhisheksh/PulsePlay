import React, { useEffect, useState,useContext } from "react";
import { Navigate } from "react-router-dom";
import axios from "axios";
import { ApiContext } from "../context/ApiContext";

// axios.defaults.withCredentials = true; // ✅ default for all requests

const ProtectedRoute = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const pp = useContext(ApiContext)

  useEffect(() => {
    const verifyUser = async () => {
      try {
        const res = await axios.get(`${pp}/api/verify`, {
          withCredentials: true
        });
        console.log("Verification response:", res.data);
        setIsAuthenticated(true);
      } catch (error) {
        console.log("Verification failed:", error);
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };

    verifyUser();
  }, []);

  if (isLoading) return <div>Loading...</div>;
  if (!isAuthenticated) return <Navigate to="/login" />;

  return children;
};

export default ProtectedRoute;
