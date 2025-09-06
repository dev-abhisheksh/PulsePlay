import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import axios from "axios";

const ProtectedRoute = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const verifyUser = async () => {
      try {
        // Get token from localStorage as fallback
        const token = localStorage.getItem('accessToken');
        
        const config = {
          withCredentials: true, // for cookies
        };
        
        // If we have a token in localStorage, add it to headers
        if (token) {
          config.headers = {
            'Authorization': `Bearer ${token}`
          };
        }

        const res = await axios.get(
          "https://pulseplay-8e09.onrender.com/api/verify",
          config
        );

        setIsAuthenticated(res.status === 200);
      } catch (error) {
        console.log("Verification failed:", error.response?.status, error.message);
        setIsAuthenticated(false);
        
        // Clear any stored tokens if verification fails
        localStorage.removeItem('accessToken');
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