import { Router } from "express";
import { changeCurrentPassword, getCurrentUser, loginUser, logoutUser, refreshAccessToken, registerUser, updateAccountDetails, updateUserAvatar, updateUserCoverImage } from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js"
import { verifyJWT } from "../middlewares/auth.middleware.js";
const router = Router()

router.route("/register").post(
    upload.fields(
        [//insert middleware
            {
                name: "avatar",
                maxCount: 1,
            },
            {
                name: "coverImage",
                maxCount: 1
            },
        ]
    ),
    registerUser
)

router.route("/login").post(loginUser)

//secured routes section
router.route("/logout").post(verifyJWT, logoutUser)

router.route("/refresh-token").post(refreshAccessToken)

router.route("/change-password").post(verifyJWT, changeCurrentPassword);

router.router("/get-user").post(verifyJWT, getCurrentUser)

router.route("/update-user").post(verifyJWT, updateAccountDetails)

router.route("/update-avatar").post(
    upload.field(
        [
            {
                name: avatar,
                maxCount: 1
            }
        ]
    ),
    updateUserAvatar
)

router.route("/update-cover-image").post(
    upload.field(
        [
            {
                name: coverImage,
                maxCount: 1
            }
        ]
    ),
    updateUserCoverImage
)

export default router