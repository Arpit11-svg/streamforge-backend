import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { createPlaylist, addVideoToPlaylist, } from "../controllers/playlist.controller.js";

const router = Router();
router.use(verifyJWT);

router.get("/test", (req, res) => {
    res.send("Playlist router is working");
});

router.route("/create-playlist").post(createPlaylist)
router.route("/add/:playlistId/:videoId").patch(addVideoToPlaylist);

export default router;