import { Router } from "express";
import { verifyAdmin, verifyUser } from "../middlewares/auth.middleware.js"
import { register, loginUser, logoutUser, usersCount } from "../controllers/user.controller.js";
import { deleteUser, updateRole } from "../controllers/admin.controller.js";

const router = Router();

router.post("/register", register)
router.post("/login", loginUser)
router.get("/logout", logoutUser)
router.get("/verify", verifyUser)

//Admins only
router.get("/all-users", verifyUser, verifyAdmin, usersCount)
router.patch("/role-update", verifyUser, verifyAdmin, updateRole)
router.delete("/delete-user", verifyUser, verifyAdmin, deleteUser)

export default router;