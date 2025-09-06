import cors from "cors"
import express from "express"
const app = express()
app.use(cors())
import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js"


const verifyUser = async (req, res, next) => {
    try {
        const token =
            req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "");

        if (!token) {
            return res.status(401).json({ message: "Not authorized" });
        }

        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

        // Use id from token
        const user = await User.findById(decodedToken.id).select("-password -refreshToken");

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        req.user = user; // full user doc with role
        next();
    } catch (error) {
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
