import { Router } from "express";
import { verifyUser } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/upload.middleware.js";
import { addSong, getSongs, searchSongs } from "../controllers/song.controller.js";
import { addSongToPlaylist, createPlaylist, getPlaylist } from "../controllers/playlist.controller.js";

const router = Router();

//Admin only
router.post("/add", upload.fields([{ name: "audio", maxCount: 1 }, { name: "coverImage", maxCount: 1 }]), addSong);


//Common user routes
router.get("/songs", getSongs)
router.get("/search", verifyUser, searchSongs)


export default router;