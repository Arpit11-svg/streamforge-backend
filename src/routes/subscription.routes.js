import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { getChannelSubscribers, getUserSubscribedChannel, toggleSubscription } from "../controllers/subscription.controller.js";
const router = Router()
router.use(verifyJWT)

router.route("/c/:channelId").post(toggleSubscription)
router.route("/c/:channelId").get(getChannelSubscribers)
router.route("/u/:userId").get(getUserSubscribedChannel)

export default router;