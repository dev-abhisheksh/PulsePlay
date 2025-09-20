import { User } from "../models/user.model.js";

const updateRole = async (req, res) => {
    try {
        const { username, role } = req.body;

        if (!username || !role) {
            res.status(400).json({ message: "Both fields are required" })
        }

        const user = await User.findOneAndUpdate(
            { username: username },
            { role: role },
            { new: true }
        ).select("-password")

        res.status(200).json({ message: "Role upadted successfully" })
    } catch (error) {
        res.status(200).json({ message: "Role updation failed" })
    }
}

const deleteUser = async (req, res) => {
    try {
        const { username } = req.body;
        if (!username) {
            return res.status(404).json({ message: `User with the ${username} not found` })
        }

        const user = await User.findOneAndDelete(
            { username: username },
            { new: true }
        ).select("-password")

        return res.status(200).json({ message: "User deleted successfully" })
    } catch (error) {
        return res.status(500).json({ message: "Failed to delete user" })
    }
}


export {
    updateRole,
    deleteUser,
}