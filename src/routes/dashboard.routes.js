import { Router } from 'express';
import { getChannelVideos, getChannelStats, } from "../controllers/dashboard.controller.js"
import { verifyJWT } from "../middlewares/auth.middleware.js"

const router = Router();

router.use(verifyJWT);

router.route("/videos").get(getChannelVideos)
router.route("/stats").get(getChannelStats)

export default router;