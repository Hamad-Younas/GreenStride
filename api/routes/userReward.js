import express from "express";
import { Add, getUserRewards } from "../controllers/userReward.js";

const router = express.Router();

router.post("/add", Add)
router.get("/get/:ID", getUserRewards)


export default router