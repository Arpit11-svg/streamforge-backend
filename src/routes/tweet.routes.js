import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { createTweet, deleteTweet, getUserTweets, updateTweet } from "../controllers/tweet.controller.js"

const router = Router()
router.use(verifyJWT);

router.route("/create-tweet").post(createTweet)
router.route("/user/:userId").get(getUserTweets);
router.route("/:tweetId").delete(deleteTweet)
router.route("/:tweetId").patch(updateTweet)

export default router;