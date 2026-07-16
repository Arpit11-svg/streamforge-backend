import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";
import { getAllVideos, publishVideo } from "../controllers/video.controller.js";

const router = Router()
router.use(verifyJWT);

router.route("/publish-video").post(
    upload.fields([
        {
            name: "videoFile",
            maxCount: 1,
        },
        {
            name: "thumbnail",
            maxCount: 1
        }
    ]),
    publishVideo
);
router.route("/").get(getAllVideos);

export default router;

