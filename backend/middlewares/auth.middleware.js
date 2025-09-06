import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js"


const verifyUser = async (req, res, next) => {
    try {
        console.log("=== Token Verification Debug ===");
        console.log("Cookies:", req.cookies);
        console.log("Authorization header:", req.header("Authorization"));

        const token =
            req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "");

        console.log("Extracted token:", token ? "Token exists" : "No token found");

        if (!token) {
            console.log("❌ No token provided");
            return res.status(401).json({ message: "Not authorized" });
        }

        console.log("🔍 Attempting to verify token...");
        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        console.log("✅ Token decoded successfully:", decodedToken);

        // Use id from token
        const user = await User.findById(decodedToken.id).select("-password -refreshToken");
        console.log("User found:", user ? `User: ${user.username}` : "No user found");

        if (!user) {
            console.log("❌ User not found in database");
            return res.status(404).json({ message: "User not found" });
        }

        req.user = user; // full user doc with role
        console.log("✅ User verification successful");
        next();
    } catch (error) {
        console.log("❌ Token verification failed:", error.message);
        return res.status(401).json({ message: "Invalid or expired token!" });
    }
};


// middleware/verifyAdmin.js
const verifyAdmin = (req, res, next) => {
    if (req.user && req.user.role === "admin") {
        next();
    } else {
        return res.status(403).json({ message: "Access denied: Admins only" });
    }
};

export {
    verifyUser,
    verifyAdmin
}
