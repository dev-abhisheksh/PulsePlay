import { Router } from "express";
import { addSongToPlaylist, createPlaylist, deletePlaylist, getPlaylist, getUsersPlaylists, removeSongFromPlaylist, renamePlaylist, reorderSongsInPlaylist } from "../controllers/playlist.controller.js";
import { verifyUser } from "../middlewares/auth.middleware.js";

const router = Router();

router.post("/create", verifyUser, createPlaylist)
router.get("/:id", verifyUser, getPlaylist)
router.get("/", verifyUser, getUsersPlaylists)
router.delete("/delete/:id", verifyUser, deletePlaylist)
router.post("/:playlistId/add-song", verifyUser, addSongToPlaylist);
router.patch("/:playlistId/remove-song", verifyUser, removeSongFromPlaylist)
router.patch("/:playlistId/rename", verifyUser, renamePlaylist)
router.patch("/:playlistId/reorder", verifyUser, reorderSongsInPlaylist);

export default router;