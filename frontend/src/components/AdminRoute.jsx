import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import axios from "axios";

const AdminRoute = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const checkAdmin = async () => {
      try {
        console.log("=== AdminRoute Debug ===");
        
        // Get token from localStorage
        const token = localStorage.getItem('accessToken');
        console.log("Token from localStorage:", token ? "Token exists" : "No token");
        
        const config = {
          withCredentials: true, // for cookies
        };
        
        // If we have a token in localStorage, add it to headers
        if (token) {
          config.headers = {
            'Authorization': `Bearer ${token}`
          };
          console.log("Added Authorization header");
        }

        console.log("Making request to verify endpoint...");
        const res = await axios.get(
          "https://pulseplay-8e09.onrender.com/api/verify",
          config
        );

        console.log("Verify response:", res.data);
        
        // Check if user has admin role
        if (res.data.user && res.data.user.role === 'admin') {
          setIsAdmin(true);
          console.log("✅ User is admin");
        } else {
          console.log("❌ User is not admin, role:", res.data.user?.role);
          setIsAdmin(false);
        }
        
      } catch (error) {
        console.log("❌ Admin verification failed:", error.response?.status, error.message);
        setIsAdmin(false);
        
        // Clear token if it's invalid
        if (error.response?.status === 401) {
          localStorage.removeItem('accessToken');
        }
      } finally {
        setIsLoading(false);
      }
    };

    checkAdmin();
  }, []);

  if (isLoading) return <div>Loading...</div>;
  if (!isAdmin) return <Navigate to="/login" />;

  return children;
};

export default AdminRoute;