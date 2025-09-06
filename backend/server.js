import express from "express";
import dotenv from "dotenv";
import dbConnection from "./utils/db.js";
import userRoutes from "./routes/user.route.js";
import songRoutes from "./routes/song.route.js";
import playlistRoutes from "./routes/playlist.route.js";
import cookieParser from "cookie-parser";
import cors from "cors";

dotenv.config();

const app = express();

// Allowed origins
const allowedOrigins = [
  "http://localhost:5173",                // local dev
  "https://music-pulseplay.onrender.com" // deployed frontend
];

// CORS middleware
app.use(cors({
  origin: function(origin, callback) {
    if (!origin) return callback(null, true); // allow non-browser requests
    if (!allowedOrigins.includes(origin)) {
      return callback(new Error("CORS not allowed"), false);
    }
    return callback(null, true);
  },
  credentials: true
}));

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true, limit: '16kb' }));
app.use(cookieParser());

// Routes
app.use("/api", userRoutes);
app.use("/api/song", songRoutes);
app.use("/api/playlist", playlistRoutes);

// Database connection
dbConnection();

// Start server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
