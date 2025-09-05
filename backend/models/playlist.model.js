import mongoose from "mongoose"

const playlistSchema = mongoose.Schema({
    name: {
        type: String,
        reuired: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    songs: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Song"
        }
    ]
}, { timestamps: true })



export const Playlist = mongoose.model("Playlist", playlistSchema)