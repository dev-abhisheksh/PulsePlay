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

//middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true, limit: '16kb' }));
app.use(cookieParser());
app.use(cors({
    origin: process.env.CORS_ORIGIN || "http://localhost:4000",
    credentials: true
}));

//routes
app.use("/api", userRoutes)
app.use("/api/song", songRoutes)
app.use("/api/playlist", playlistRoutes)


dbConnection()

app.listen(process.env.PORT || 3000, () => {
    console.log(`Server running on port ${process.env.PORT}`)
})