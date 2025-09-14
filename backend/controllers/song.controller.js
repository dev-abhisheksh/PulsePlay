import cloudinary from "cloudinary"
import { Song } from "../models/song.model.js"
import { streamUpload } from "../middlewares/upload.middleware.js";

const addSong = async (req, res) => {
    try {
        const { title, artist, genre } = req.body;
        if (!title || !artist || !genre) {
            return res.status(400).json({ message: "Title, artist, and genre are required" });
        }

        if (!req.files || !req.files.audio || !req.files.coverImage) {
            return res.status(400).json({ message: "Audio and CoverImage are required" })
        }

        const audioUpload = await streamUpload(req.files.audio[0].buffer, "video")
        const coverUpload = await streamUpload(req.files.coverImage[0].buffer, "image")

        const song = await Song.create({
            title,
            artist,
            genre,
            audioUrl: audioUpload.secure_url,
            coverImage: coverUpload.secure_url
        })

        return res.status(201).json({ message: "Song added successfully", song })
    } catch (error) {
        console.log("Error adding song: ", error)
        return res.status(500).json({ message: "Failed to add song" })

    }
}

const getSongs = async (req, res) => {
    try {
        const songs = await Song.find().sort({ createdAt: -1 }).select("-createdAt -updatedAt")

        return res.status(200).json({ songs })
    } catch (error) {
        return res.status(500).json({ message: "Failed to fetch the songs" })
    }
}

const searchSongs = async (req, res) => {
    try {
        const { title, artist, genre, page = 1, limit = 10 } = req.query;

        const query = {};
        if (title) query.title = { $regex: title, $options: "i" };
        if (artist) query.artist = { $regex: artist, $options: "i" };
        if (genre) query.genre = { $regex: genre, $options: "i" };

        const skip = (page - 1) * limit;

        const songs = await Song.find(query)
            .sort({ createdAt: -1 }) 
            .skip(skip)
            .limit(Number(limit));

        const total = await Song.countDocuments(query);

        return res.json({
            page: Number(page),
            totalPages: Math.ceil(total / limit),
            totalResults: total,
            songs,
        });
    } catch (error) {
        console.error("Error searching songs:", error);
        return res.status(500).json({ message: "Failed to search songs" });
    }
};

// Hide one song
const hideSong = async (req, res) => {
    const { id } = req.params;
    try {
        const song = await Song.findByIdAndUpdate(
            id, 
            { hidden: true }, 
            { new: true }
        );
        if (!song) return res.status(404).json({ message: "Song not found" });
        return res.json({ message: "Song hidden successfully", song });
    } catch (error) {
        return res.status(500).json({ message: "Failed to hide song" });
    }
};

// Unhide one song
const unhideSong = async (req, res) => {
    const { id } = req.params;
    try {
        const song = await Song.findByIdAndUpdate(
            id, 
            { hidden: false }, 
            { new: true }
        );
        if (!song) return res.status(404).json({ message: "Song not found" });
        return res.json({ message: "Song unhidden successfully", song });
    } catch (error) {
        return res.status(500).json({ message: "Failed to unhide song" });
    }
};

// Hide or unhide multiple songs at once
const hideMultipleSongs = async (req, res) => {
    const { ids, hidden } = req.body; // hidden: true to hide, false to unhide
    try {
        if (!ids || !Array.isArray(ids)) {
            return res.status(400).json({ message: "Invalid IDs array" });
        }

        await Song.updateMany(
            { _id: { $in: ids } }, 
            { $set: { hidden } }
        );

        return res.json({
            message: hidden 
                ? "Songs hidden successfully" 
                : "Songs unhidden successfully"
        });
    } catch (error) {
        return res.status(500).json({ message: "Failed to update songs" });
    }
};


export {
    addSong,
    getSongs,
    searchSongs,
    hideMultipleSongs,
    hideSong,
    unhideSong
}