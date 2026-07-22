import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { toggleVideoLike, toggleCommentLike, toggleTweetLike, } from "../controllers/like.controller.js";

const router = Router()
router.use(verifyJWT)

router.route("/toggle/v/:videoId").post(toggleVideoLike);
router.route("/toggle/v/:commentId").post(toggleCommentLike);
router.route("/toggle/v/:tweetId").post(toggleTweetLike);

export default router;