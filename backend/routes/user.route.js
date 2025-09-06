import { Router } from "express";
import { verifyAdmin, verifyUser } from "../middlewares/auth.middleware.js"
import { register, loginUser, logoutUser, usersCount } from "../controllers/user.controller.js";

const router = Router();

router.post("/register", register)
router.post("/login", loginUser)
router.get("/logout", logoutUser)

router.get("/verify", verifyUser, (req, res) => {
    // req.user is set by verifyUser middleware
    res.status(200).json({ user: req.user });
});

router.get("/all-users", verifyAdmin, usersCount)

export default router;