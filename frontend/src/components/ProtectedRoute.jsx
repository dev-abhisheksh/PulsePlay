import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import axios from "axios";

const ProtectedRoute = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const pp = "https://pulseplay-8e09.onrender.com";
  const localhost = "http://localhost:4000";

  useEffect(() => {
    const verifyUser = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        if (!token) {
          setIsAuthenticated(false);
          setIsLoading(false);
          return;
        }

        const res = await axios.get(`${pp}/api/verify`, {
          headers: {
            Authorization: `Bearer ${token}`, // ✅ Send token to backend
          },
        });

        console.log("Verification response:", res.data);
        setIsAuthenticated(res.status === 200);
      } catch (error) {
        console.log(
          "Verification failed:",
          error.response?.status,
          error.message
        );
        setIsAuthenticated(false);

        // Clear any stored tokens if verification fails
        localStorage.removeItem("accessToken");
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
