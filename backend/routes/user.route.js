import { Router } from "express";
import { verifyUser } from "../middlewares/auth.middleware.js"
import { register, loginUser } from "../controllers/user.controller.js";

const router = Router();

router.post("/register", register)
router.post("/login", loginUser)

export default router;