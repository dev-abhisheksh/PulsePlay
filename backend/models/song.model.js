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
        enum: ["Phonk", "Rock", "Sad", "Pop", "Hip-Hop", "Jazz"]
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