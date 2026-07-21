import { Router } from "express";
import {verifyJWT} from "../middlewares/auth.middleware.js"
import { addComment, deleteComment, updateComment, getVideoComments } from "../controllers/comment.controller.js";

const router = Router()
router.use(verifyJWT);

router.route("/:videoId").post(addComment)
router.route("/c/:commentId").delete(deleteComment)
router.route("/c/:commentId").patch(updateComment)
router.route("/:videoId").get(getVideoComments)


export default router;