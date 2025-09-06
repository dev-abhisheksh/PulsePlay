import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import axios from "axios";

const ProtectedRoute = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const verifyUser = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setIsAuthenticated(false);
        setIsLoading(false);
        return;
      }

      try {
        const res = await axios.get(
          "https://pulseplay-8e09.onrender.com/api/verify",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setIsAuthenticated(res.status === 200);
      } catch (error) {
        if (error.response?.status === 401) {
          console.log("Unauthorized: Token missing or invalid");
        } else {
          console.log("Verification failed:", error.message);
        }
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
