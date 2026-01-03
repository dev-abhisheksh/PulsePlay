import mongoose from "mongoose";
import { User } from "./user.model.js";

const songSchema = mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    artist: {
        type: String,
        required: true
    },
    genre: {
        type: String,
        required: true,
        enum: [
            "Pop",
            "Rock",
            "Hip-Hop",
            "Rap",
            "R&B",
            "Jazz",
            "Blues",
            "Classical",
            "Electronic",
            "EDM",
            "House",
            "Techno",
            "Trance",
            "Dubstep",
            "Lo-fi",
            "Phonk",
            "Ambient",
            "Instrumental",

            // 😔 Mood / Vibe
            "Sad",
            "Chill",
            "Romantic",
            "Workout",
            "Party",
            "Feel Good",
            "Sleep",
            "Motivational",

            // 🇮🇳 Indian
            "Bollywood",
            "Indian Classical",
            "Carnatic",
            "Hindustani",
            "Punjabi",
            "Desi Hip-Hop",
            "Indie Indian",
            "Bhajan",
            "Qawwali",
            "Sufi",
            "Garba",
            "Bhangra",

            // 🎌 Anime / Japanese
            "Anime",
            "J-Pop",
            "J-Rock",
            "Anime OST",
            "Vocaloid",
            "City Pop",

            // 🌍 Regional / World
            "K-Pop",
            "Latin",
            "Reggae",
            "Afrobeats",
            "Folk",
            "Country",
            "Metal",
            "Heavy Metal",
            "Alternative",
            "Indie",

            // 🎮 / Media
            "Game OST",
            "Movie OST",
            "Web Series OST",
            "Background Score",

            // 🧪 Experimental / Niche
            "Synthwave",
            "Retrowave",
            "Drill",
            "Trap",
            "Experimental"
        ]

    },
    audioUrl: {
        type: String,
        required: true  //cloudinary
    },
    coverImage: {
        type: String //cloudinary
    },
    hidden: { type: Boolean, default: false }
}, { timestamps: true })

songSchema.index({ title: 'text', artist: 'text', genre: 'text' }) //gonna be used for searhign

export const Song = mongoose.model("Song", songSchema)