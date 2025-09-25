import { Changelog } from "../models/changelog.model.js";

const addChangelog = async (req, res) => {
    try {
        const { title, description } = req.body;

        if (!title || !description) {
            return res.status(400).json({ message: "Both fields are required" })
        }

        const changelog = await Changelog.create({ title, description })
        res.status(200).json(changelog)
    } catch (error) {
        console.log("Error occured while creating the changelog file")
        return res.status(500).json({ message: "Server Error" })
    }
}

const getChangelog = async (req, res) => {
    try {
        const changelogs = await Changelog.find().sort({ date: -1 })
        res.status(200).json(changelogs)
    } catch (error) {
        return res.status(500).json({ message: "Failed to fetch the changelogs" })
    }
}

const updateChangelog = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, description } = req.body;

        if (!title && !description) {
            return res.status(400).json({ message: "Both fields are required" })
        }

        const updatedlogs = await Changelog.findByIdAndUpdate(
            id,
            { title, description },
            { new: true }
        );
        res.json(updatedlogs)
    } catch (error) {
        console.error("Failed to update changelog:", error.message);
        return res.status(500).json({ message: "Server error while updating changelog" })
    }
}

const deleteChangelog = async (req, res) => {
    try {
        const { id } = req.params;
        if (!id) {
            return res(404).json({ message: "Changelog doesnt exists" })
        }

        const deletedLog = await Changelog.findByIdAndDelete(id)
        if (!deletedLog) {
            return res.status(404).json({ message: "Changelog not found" });
        }

        res.status(200).json({ message: "Changelog deleted successfully" });
    } catch (error) {
        return res.status(500).json({ message: "Failed to delete changelog" })
    }
}

export {
    addChangelog,
    getChangelog,
    updateChangelog,
    deleteChangelog
}