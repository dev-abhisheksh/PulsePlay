import { Router } from "express";
import { verifyAdmin, verifyUser } from "../middlewares/auth.middleware.js"
import { register, loginUser, logoutUser, usersCount } from "../controllers/user.controller.js";


const router = Router();

router.post("/register", register)
router.post("/login", loginUser)
router.get("/logout", logoutUser)

router.get("/verify", verifyUser)

router.get("/all-users", verifyUser, verifyAdmin, usersCount)

export default router;