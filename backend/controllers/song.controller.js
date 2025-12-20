import cloudinary from "cloudinary"
import { Song } from "../models/song.model.js"
import { streamUpload } from "../middlewares/upload.middleware.js";
import { client } from "../utils/redisClient.js";

const ALLOWED_GENRES = [
    "Phonk",
    "Pop",
    "Rock",
    "Hip-Hop",
    "R&B",
    "Electronic",
    "Jazz",
    "Classical",
    "Reggae",
    "Metal",
    "Country"
];



const addSong = async (req, res) => {
    try {
        const { title, artist, genre } = req.body;

        if (!title || !artist || !genre) {
            return res.status(400).json({ message: "Title, artist, and genre are required" });
        }

        // ✅ validate genre
        if (!ALLOWED_GENRES.includes(genre)) {
            return res.status(400).json({ message: `Invalid genre. Allowed: ${ALLOWED_GENRES.join(", ")}` });
        }

        if (!req.files || !req.files.audio || !req.files.coverImage) {
            return res.status(400).json({ message: "Audio and CoverImage are required" })
        }

        const audioUpload = await streamUpload(req.files.audio[0].buffer, "video");
        const coverUpload = await streamUpload(req.files.coverImage[0].buffer, "image");

        const song = await Song.create({
            title,
            artist,
            genre,
            audioUrl: audioUpload.secure_url,
            coverImage: coverUpload.secure_url
        });
        await client.del("allsongs")
        return res.status(201).json({ message: "Song added successfully", song });
    } catch (error) {
        console.log("Error adding song: ", error);
        return res.status(500).json({ message: "Failed to add song" });
    }
};


// import { client } from "../config/redis.js";
// import { Song } from "../models/song.model.js";

const getSongs = async (req, res) => {
    try {
        console.time("⏱️ Total Request Time");

        // ✅ Check Redis connection
        if (!client.status || client.status !== "ready") {
            console.warn("⚠️ Redis not connected, using MongoDB directly");
        }

        // ✅ 1. Try fetching from Redis cache
        console.time("Redis GET");
        const songsCache = await client.get("allsongs");
        console.timeEnd("Redis GET");

        if (songsCache) {
            console.timeEnd("⏱️ Total Request Time");
            console.log("✅ Served from Redis cache");
            return res.status(200).json({
                source: "cache",
                songs: JSON.parse(songsCache),
            });
        }

        // ✅ 2. Fetch from MongoDB if not cached
        console.time("MongoDB Fetch");
        const songs = await Song.find()
            .sort({ createdAt: -1 })
            .select("title artist cover duration"); // only send necessary fields
        console.timeEnd("MongoDB Fetch");

        // ✅ 3. Cache the result (1 hour TTL)
        console.time("Redis SET");
        await client.set("allsongs", JSON.stringify(songs), "EX", 3600);
        console.timeEnd("Redis SET");

        console.log("💾 Cached new songs list in Redis");

        console.timeEnd("⏱️ Total Request Time");

        return res.status(200).json({
            source: "database",
            songs,
        });
    } catch (error) {
        console.error("❌ Error in getSongs:", error);
        return res.status(500).json({
            message: "Failed to fetch songs",
            error: error.message,
        });
    }
};





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

const editSong = async (req, res) => {
    const { id } = req.params;
    const { title, artist, genre } = req.body || {};

    const updateData = {};
    if (title) updateData.title = title;
    if (artist) updateData.artist = artist;

    if (genre) {
        if (!ALLOWED_GENRES.includes(genre)) {
            return res.status(400).json({ message: `Invalid genre. Allowed: ${ALLOWED_GENRES.join(", ")}` });
        }
        updateData.genre = genre;
    }

    try {
        if (req.files?.coverImage) {
            const coverUpload = await streamUpload(req.files.coverImage[0].buffer, "image");
            updateData.coverImage = coverUpload.secure_url;
        }
        if (req.files?.audio) {
            const audioUpload = await streamUpload(req.files.audio[0].buffer, "video");
            updateData.audioUrl = audioUpload.secure_url;
        }

        if (Object.keys(updateData).length === 0) {
            return res.status(400).json({ message: "At least one field is required to update" });
        }

        const updatedSong = await Song.findByIdAndUpdate(id, { $set: updateData }, { new: true });
        if (!updatedSong) return res.status(404).json({ message: "Song not found" });
        await client.del("allsongs")
        res.status(200).json({ message: "Song updated successfully", song: updatedSong });
    } catch (err) {
        console.error("Error editing song:", err);
        res.status(500).json({ message: "Server error" });
    }
};








export {
    addSong,
    getSongs,
    searchSongs,
    hideMultipleSongs,
    hideSong,
    unhideSong,
    editSong
}