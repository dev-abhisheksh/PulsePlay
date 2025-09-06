import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

const AdminRoute = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [redirect, setRedirect] = useState(false);

  useEffect(() => {
    const checkAdmin = async () => {
      try {
        const res = await axios.get("https://pulseplay-8e09.onrender.com/api/verify", {
          withCredentials: true,
        });

        if (res.data.user.role === "admin") {
          setIsAdmin(true);
          toast.success("Welcome, Admin!");
        } else {
          toast.error("🚫 Not an admin!");
          setRedirect(true)
        }
      } catch (err) {
        toast.error("⚠️ Unauthorized! Please login again.");
        setTimeout(() => setRedirect(true), 500); // wait for toast
      } finally {
        setLoading(false);
      }
    };

    checkAdmin();
  }, []);

  if (loading) return <p className="text-white">Checking access...</p>;

  if (redirect) return <Navigate to="/" replace />;

  return isAdmin ? children : null;
};

export default AdminRoute;
