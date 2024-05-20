import { Router } from "express";
import { 
    loginUser, 
    logoutUser, 
    registerUser, 
    refreshAccessToken, 
    changeCurrentPassword, 
    getCurrentUser, 
    updateAccountDetails, 
    updateUserAvatar, 
    updateUsercoverImage, 
    getUserChannelProfile, 
    getWatchHistory 
} from "../controllers/user.js";
import  { upload }  from "../middlewares/multer.js"
import { VerifyJWT } from "../middlewares/auth.js";
import { verify } from "jsonwebtoken";

const router = Router()

router.route("/register").post(
    upload.fields([
        {
            name: "avatar",
            maxCount: 1
        },
        {
            name: "coverImage",
            maxCount: 1
        }
    ]),
    registerUser
)

router.route("/login").post(loginUser)

//secured routes
router.route("/logout").post(VerifyJWT,logoutUser)
router.route("/refresh-token").post(refreshAccessToken)
router.route("/change-password").post(VerifyJWT,changeCurrentPassword)
router.route("/current-user").get(VerifyJWT,getCurrentUser)
router.route("/update-account").patch(VerifyJWT, updateAccountDetails)
router.route("/avatar").patch(VerifyJWT, upload.single("avatar"), updateUserAvatar)
router.route("/cover-image").patch(VerifyJWT, upload.single("/coverImage"), updateUsercoverImage)
router.route("/channel/:username").get(VerifyJWT, getUserChannelProfile)
router.route("/history").get(VerifyJWT, getWatchHistory)

export default router