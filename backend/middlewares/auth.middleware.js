import cors from "cors"
import express from "express"
const app = express()
app.use(cors())
import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js"
import cookieParser from "cookie-parser";
app.use(cookieParser());



const verifyUser = async (req, res, next) => {
    try {
        const token = req.cookies?.accessToken;
        if (!token) {
            return res.status(401).json({ message: "Not authorized" });
        }

        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        const user = await User.findById(decodedToken.id).select("-password -refreshToken");

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        req.user = user;

        // If this is the /verify route, respond directly
        if (req.path === '/verify') {
            return res.json({ success: true, user });
        }

        // Otherwise, continue to next middleware
        next();
    } catch (error) {
        return res.status(401).json({ message: "Invalid or expired token!" });
    }
};



// middleware/verifyAdmin.js
const verifyAdmin = (req, res, next) => {
    if (req.user && req.user.role === "admin") {
        console.log("Is admin")
        next();
    } else {
        return res.status(403).json({ message: "Access denied: Admins only" });
    }
};

export {
    verifyUser,
    verifyAdmin
}
