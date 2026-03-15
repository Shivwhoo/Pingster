import { Router } from "express";
import { changeCurrentPassword, getAllUsers, getCurrentUser, loginUser, logoutUser, refreshAccessToken, registerUser, removeUserAvatar, updateAccountDetails, updateUserAvatar } from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import {verifyJWT} from '../middlewares/auth.middlewares.js'

const router=Router()


router.route('/register').post(upload.fields([{name:'avatar',maxCount:1}]),registerUser)
router.route('/login').post(loginUser)
router.route("/refresh-token").post(refreshAccessToken)

router.route('/logout').post(verifyJWT,logoutUser)
router.route('/change-password').post(verifyJWT,changeCurrentPassword)
router.route('/current-user').get(verifyJWT,getCurrentUser)
router.route('/update-account').patch(verifyJWT,updateAccountDetails)
router.route('/avatar').patch(verifyJWT,upload.single("avatar"),updateUserAvatar)
router.route("/avatar").delete(verifyJWT, removeUserAvatar);

router.route("/").get(verifyJWT, getAllUsers);

export default router
