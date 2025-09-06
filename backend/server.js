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

const corsOptions = {
  origin: [
    'http://localhost:5173',  // Your Vite dev server
    'https://music-pulseplay.onrender.com', 
  
  ],
  credentials: true, // Allow cookies
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: [
    'Content-Type',
    'Authorization',
    'X-Requested-With',
    'Accept',
    'Origin'
  ],
  optionsSuccessStatus: 200 // For legacy browsers
};
app.use(cors(corsOptions))

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
