import { Router } from "express";
import { verifyUser } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/upload.middleware.js";
import { addSong, getSongs, searchSongs, hideMultipleSongs, hideSong, unhideSong, editSong } from "../controllers/song.controller.js";

import { addSongToPlaylist, createPlaylist, getPlaylist } from "../controllers/playlist.controller.js";
import { verifyAdmin } from "../middlewares/auth.middleware.js";

const router = Router();

//Admin only
router.post("/add", upload.fields([{ name: "audio", maxCount: 1 }, { name: "coverImage", maxCount: 1 }]), addSong);
router.patch("/:id/hide", verifyUser, verifyAdmin, hideSong);
router.patch("/:id/unhide", verifyUser, verifyAdmin, unhideSong);
router.patch("/:id/edit-song", upload.fields([{ name: "audio", maxCount: 1 }, { name: "coverImage", maxCount: 1 }]), verifyUser, verifyAdmin, editSong)
router.post("/hide-many", verifyAdmin, hideMultipleSongs);

//Common user routes,
router.get("/songs", getSongs)
router.get("/search", verifyUser, searchSongs)


export default router;