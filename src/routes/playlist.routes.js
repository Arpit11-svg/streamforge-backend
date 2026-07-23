import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { createPlaylist, addVideoToPlaylist, deletePlaylist, updatePlaylist, getPlaylistById, getUserPlaylists, removeVideoFromPlaylist, } from "../controllers/playlist.controller.js";

const router = Router();
router.use(verifyJWT);

router.get("/test", (req, res) => {
    res.send("Playlist router is working");
});

router.route("/create-playlist").post(createPlaylist)
router.route("/:playlistId").patch(updatePlaylist)
router.route("/:playlistId").delete(deletePlaylist)
router.route("/:playlistId").get(getPlaylistById)
router.route("/user/:userId").get(getUserPlaylists);
router.route("/add/:playlistId/:videoId").patch(addVideoToPlaylist)
router.route("/remove/:playlistId/:videoId").patch(removeVideoFromPlaylist);

export default router;