import { Router } from 'express';
import { getChannelVideos, } from "../controllers/dashboard.controller.js"
import { verifyJWT } from "../middlewares/auth.middleware.js"

const router = Router();

router.use(verifyJWT);

router.route("/videos").get(getChannelVideos);

export default router;