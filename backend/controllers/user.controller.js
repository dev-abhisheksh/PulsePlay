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
        const { username, password, role } = req.body;

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
            role: role
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
            return res.status(401).json({ message: "Both fields are required" })
        }

        const user = await User.findOne({ username })
        if (!user) {
            return res.status(404).json({ message: "User not found" })
        }

        const isPasswordValid = await user.isPasswordCorrect(password)
        if (!isPasswordValid) {
            return res.status(401).json({ message: "Invalid password" })
        }

        const { refreshToken, accessToken } = await generateAccessAndRefreshToken(user._id)

        const options = {
            httpOnly: true,
            secure: false
        }

        return res
            .status(200)
            .cookie("accessToken", accessToken, options)
            .cookie("refreshToken", refreshToken, options)
            .json({ message: "User logged in successfully" })
    } catch (error) {
        return res.status(500).json({ message: "Faild login" })
    }
}

export {
    register,
    loginUser
}