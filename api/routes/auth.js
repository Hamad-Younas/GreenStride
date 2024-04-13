import express from "express";
import { login, register } from "../controllers/auth.js";
import { updateUser,getUser,getUsers,deleteUser } from "../controllers/user.js";

const router = express.Router();

router.post("/register", register)
router.post("/login", login)
router.get("/user", getUser)
router.post("/reset", updateUser)


export default router