import express from "express";
import { login, register, verifyUser, verifyLatestCode } from "../controllers/auth.js";
import { updateUser,getUser,getUsers,deleteUser } from "../controllers/user.js";

const router = express.Router();

router.post("/register", register)
router.post("/login", login)
router.get("/user", getUser)
router.get("/confirm", verifyUser)
router.post("/verify", verifyLatestCode)
router.post("/change-password", updateUser)


export default router