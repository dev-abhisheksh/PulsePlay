import mongoose from "mongoose";

const changelogSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    date: {
        type: Date,
        default: Date.now
    }
});

export const Changelog = mongoose.model("Changelog", changelogSchema)