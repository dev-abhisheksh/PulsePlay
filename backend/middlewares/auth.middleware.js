import jwt from "jsonwebtoken";
import {User} from "../models/user.model.js"


export const verifyUser = async (req, res, next) => {
    try {
        const token = req.cookies?.accessToken || req.header('Authorization')?.replace("Bearer ", "")

        if (!token) {
            return res.status(401).json({ message: "Not authorized" })
        }

        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)

        const user = await User.findOne({
            $or: [
                {email: decodedToken.email},
                {username: decodedToken.username}
            ]
        }).select("-password -refreshToken")

        if(!user){
            return res.status(404).json({message: "User not found"})
        }

        req.user = user;
        next();
    } catch (error) {
        return res.status(401).json({message: "Invalid or expired token!"})
    }
}
