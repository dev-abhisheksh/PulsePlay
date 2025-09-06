import express from "express"
import dotenv from "dotenv"
import dbConnection from "./utils/db.js";
import userRoutes from "./routes/user.route.js"
import songRoutes from "./routes/song.route.js"
import playlistRoutes from "./routes/playlist.route.js"
import cookieParser from "cookie-parser";
import cors from "cors"

dotenv.config();

const app = express();

const allowedOrigins = [
    "http://localhost:5173", // local dev
    "https://music-pulseplay.onrender.com" // deployed frontend
];
app.use(cors({
    origin: function (origin, callback) {
        if (!origin) return callback(null, true); // allow non-browser requests
        if (allowedOrigins.indexOf(origin) === -1) {
            const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
            return callback(new Error(msg), false);
        }
        return callback(null, true);
    },
    credentials: true // if using cookies or auth headers
}));

//middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true, limit: '16kb' }));
app.use(cookieParser());
app.use(cors({
    origin: process.env.CORS_ORIGIN || "https://music-pulseplay.onrender.com",
    credentials: true
}));

//routes
app.use("/api", userRoutes)
app.use("/api/song", songRoutes)
app.use("/api/playlist", playlistRoutes)


dbConnection()

app.listen(process.env.PORT || 4000, () => {
    console.log(`Server running on port ${process.env.PORT}`)
})