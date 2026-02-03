import { Router } from "express";
import { login, register,logoutUser } from "../controllers/user.controllers.js";
import { verifyJWT } from "../middlewere/auth.middleware.js";
import { upload } from "../middlewere/multer.middlewere.js";
const router=Router();

router.route("/register").post( upload.single("avatar"),register);
router.route("/login").post(login)
router.route("/logout").post(verifyJWT,logoutUser)

export default router;