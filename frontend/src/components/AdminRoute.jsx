import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import axios from "axios";

const AdminRoute = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const pp = "https://pulseplay-8e09.onrender.com" /*"http://localhost:4000"*/;
  useEffect(() => {
    const checkAdmin = async () => {
      try {
        const res = await axios.get(`${pp}/api/verify`, {
          withCredentials: true
        })
        console.log(res.data.user.role)
        setIsAdmin(res.data.user.role === "admin")

      } catch (error) {
        setIsAdmin(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkAdmin();
  }, []);

  if (isLoading) return <div>Loading...</div>;
  if (!isAdmin) return <Navigate to="/" />;

  return children;
};

export default AdminRoute;