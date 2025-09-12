
import { Playlist } from "../models/playlist.model.js";
import { User } from "../models/user.model.js"
import { Song } from "../models/song.model.js"

const createPlaylist = async (req, res) => {
    try {
        const { name } = req.body;
        const userId = req.user._id;

        const playlist = await Playlist.create({
            name,
            userId,
            songs: []
        })
        return res.status(200).json({ message: "Playlist created successfully", playlist })
    } catch (error) {
        return res.status(500).json({ message: "Failed to create playlist" })

    }
}

const addSongToPlaylist = async (req, res) => {
    try {
        const { playlistId } = req.params;
        const { songId } = req.body;

        const song = await Song.findById(songId);
        if (!song) return res.status(404).json({ message: "Song not found" });

        const playlist = await Playlist.findByIdAndUpdate(
            playlistId,
            { $addToSet: { songs: songId } }, // avoid duplicates
            { new: true }
        ).populate("songs");

        res.json({ message: "Song added to playlist", playlist });
    } catch (error) {
        console.error("Error adding song to playlist:", error);
        res.status(500).json({ message: "Failed to add song to playlist" });
    }
};

const removeSongFromPlaylist = async (req, res) => {
    try {
        const { playlistId } = req.params;
        const { songId } = req.body;

        const playlist = await Playlist.findByIdAndUpdate(
            playlistId,
            { $pull: { songs: songId } }, // remove song
            { new: true }
        ).populate("songs");

        if (!playlist) {
            return res.status(404).json({ message: "Playlist not found" });
        }

        return res.json({
            message: "Song removed from playlist",
            playlist,
        });
    } catch (error) {
        console.error("Error removing song from playlist:", error);
        return res.status(500).json({ message: "Failed to remove song from playlist" });
    }
};


// controllers/playlist.controller.js
const getPlaylist = async (req, res) => {
    try {
        const { id } = req.params;

        const playlist = await Playlist.findById(id).populate("songs"); // shows song details
        if (!playlist) {
            return res.status(404).json({ message: "Playlist not found" });
        }

        return res.json(playlist);
    } catch (error) {
        console.error("Error fetching playlist:", error);
        return res.status(500).json({ message: "Failed to fetch playlist" });
    }
};

const getUsersPlaylists = async (req, res) => {
    try {
        const playlists = await Playlist.find({ userId: req.user?._id }).populate("songs")
        return res.json({ playlists })
    } catch (error) {
        console.error("Error fetching user playlists:", error);
        return res.status(500).json({ message: "Failed to fetch playlists" });
    }
}

const deletePlaylist = async (req, res) => {
    try {
        const { id } = req.params;

        const playlist = await Playlist.findOneAndDelete({
            _id: id,
            userId: req.user._id,
        });

        if (!playlist) return res.status(404).json({ message: "Playlist not found" });

        return res.json({ message: "Playlist deleted successfully" });
    } catch (error) {
        console.error("Error deleting playlist:", error);
        return res.status(500).json({ message: "Failed to delete playlist" });
    }
};

const renamePlaylist = async (req, res) => {
    try {
        const { name } = req.body;
        const { playlistId } = req.params;

        if (!name) {
            return res.status(400).json({ message: "New name is required" });
        }

        const updatedPlaylist = await Playlist.findByIdAndUpdate(
            playlistId,
            { $set: { name } },
            { new: true }
        ).populate("songs");

        if (!updatedPlaylist) {
            return res.status(404).json({ message: "Playlist not found" });
        }

        return res.json({
            message: "Playlist renamed successfully",
            playlist: updatedPlaylist,
        });
    } catch (error) {
        console.error("Error renaming playlist:", error);
        return res.status(500).json({ message: "Failed to rename playlist" });
    }
};

const reorderSongsInPlaylist = async (req, res) => {
    try {
        const { playlistId } = req.params;
        const { newOrder } = req.body;

        if (!Array.isArray(newOrder)) {
            return res.status(400).json({ message: "newrder must be an array of song ids" })
        }

        const playlist = await Playlist.findById(playlistId)
        if (!playlist) {
            return res.status(404).json({ message: "Playlist does not exists" })
        }

        const invalidId = newOrder.filter(id => !playlist.songs.includes(id));
        if (invalidId.length > 0) {
            return res.status(400).json({ message: "Invalid song Ids in newOrder", invalidId })
        }

        playlist.songs = newOrder;
        await playlist.save();

        const updatedPlaylist = await Playlist.findById(playlistId).populate("songs")

        return res.json({
            message: "Playlist reordered successfully",
            playlist: updatedPlaylist
        })
    } catch (error) {
        console.error("Error reordering playlist:", error);
        return res.status(500).json({ message: "Failed to reorder playlist" });
    }
}

export {
    createPlaylist,
    addSongToPlaylist,
    getPlaylist,
    getUsersPlaylists,
    deletePlaylist,
    renamePlaylist,
    reorderSongsInPlaylist,
    removeSongFromPlaylist
};