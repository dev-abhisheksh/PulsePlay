import { User } from "../models/user.model.js"

const generateAccessAndRefreshToken = async (userId) => {
    try {
        const user = await User.findById(userId)
        const accessToken = user.generateAccessToken()
        const refreshToken = user.generateRefreshToken()

        user.refreshToken = refreshToken
        await user.save({ validateBeforeSave: false })

        return { accessToken, refreshToken }
    } catch (error) {
        throw new Error("Something went wrong while generating tokens");
    }
}

const register = async (req, res) => {
    try {
        console.log("Registration request received:", req.body)
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(401).json({ message: "Both fields are required" })
        }

        const existingUser = await User.findOne({ username })
        if (existingUser) {
            return res.status(400).json({ message: "Username is not available" })
        }

        const user = await User.create({
            username: username.toLowerCase(),
            password,
            role: "user"
        })

        const userResponse = await User.findById(user._id).select("-password")


        return res.status(200).json({ message: "User created successfully", user })
    } catch (error) {
        console.log("Error occured during registeration")
        return res.status(500).json({ message: "Failed to create user" })
    }
}

const loginUser = async (req, res) => {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(401).json({ message: "Both fields are required" });
        }

        const user = await User.findOne({ username });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const isPasswordValid = await user.isPasswordCorrect(password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: "Invalid password" });
        }

        const { refreshToken, accessToken } = await generateAccessAndRefreshToken(user._id);

        // Determine cookie options based on environment
        const isProduction = process.env.NODE_ENV === "production";
        const cookieOptions = {
            httpOnly: true,
            secure: isProduction,           // true for deployed HTTPS
            sameSite: isProduction ? "none" : "lax", // cross-origin for deployed frontend
            maxAge: 7 * 24 * 60 * 60 * 1000
        };

        console.log(user);

        return res
            .status(200)
            .cookie("accessToken", accessToken, cookieOptions)
            .cookie("refreshToken", refreshToken, cookieOptions)
            .json({
                message: "User logged in successfully",
                user: {
                    id: user._id,
                    username: user.username,
                    role: user.role
                }
            });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Failed login" });
    }
};



const logoutUser = async (req, res) => {
    res
        .clearCookie("accessToken", { httpOnly: true, secure: false })
        .clearCookie("refreshToken", { httpOnly: true, secure: false })
        .status(200)
        .json({ message: "User logged out successfully" });
};

const usersCount = async (req, res) => {
    try {
        // This should fetch ALL users, not just req.user
        const users = await User.find({})  // Get ALL users
        // console.log("All users found:", users.length)
        res.json(users)
    } catch (error) {
        console.log("Error:", error)
        res.status(500).json({ error: error.message })
    }
}


export {
    register,
    loginUser,
    logoutUser,
    usersCount
}