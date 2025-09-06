import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { Navigate } from 'react-router-dom'

const ProtectedRoute = ({children}) => {
    const [isLoading, setIsLoading] = useState(true)
    const [isAuthenticated, setIsAuthenticated] = useState(false)
    const navigate = useNavigate()

    useEffect(() => {
        const verifyUser = async () => {
            try {
                await axios.get("https://pulseplay-8e09.onrender.com/api/verify", {
                    withCredentials: true
                })
                setIsAuthenticated(true)
            } catch (error) {
                setIsAuthenticated(false)
            } finally {
                setIsLoading(false)
            }
        }
        verifyUser();
    }, [])
    if (isLoading) return <div>Loading...</div>;

    if (!isAuthenticated) return <Navigate to="/login" />;

    return children;
}

export default ProtectedRoute