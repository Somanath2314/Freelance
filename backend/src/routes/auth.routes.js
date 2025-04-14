import { Router } from "express"; 
import { loginUser } from "../controllers/userControllers/userLogin.controller.js";
import { registerUser } from "../controllers/userControllers/userRegister.controller.js"; 
import {healthcheck} from "../controllers/healthcheck.controller.js"
import { getUserProfile } from "../controllers/userControllers/getUserProfile.controller.js";

const router=Router()

router.route("/register")
    .post(registerUser);

router.route("/login") 
    .post(loginUser);

router.route("/logout")
    .post((req, res) => {
        res.clearCookie("accessToken");
        return res.status(200).json({ message: "Logged out successfully" });
    }); 

// router.get("/getProfile", getUserProfile);
router.get("/healthcheck", healthcheck);
export default router