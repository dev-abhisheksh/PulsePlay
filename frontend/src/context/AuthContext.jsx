// context/AuthContext.jsx
import { createContext, useEffect, useState } from "react";
import axios from "axios";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [authChecked, setAuthChecked] = useState(false);

    useEffect(() => {
        const verify = async () => {
            try {
                const res = await axios.get("/api/verify", {
                    withCredentials: true,
                });
                setUser(res.data.user);
            } catch {
                setUser(null);
            } finally {
                setAuthChecked(true);
            }
        };

        verify();
    }, []);

    return (
        <AuthContext.Provider value={{ user, authChecked, setUser }}>
            {children}
        </AuthContext.Provider>
    );
};
