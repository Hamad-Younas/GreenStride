import express from "express";
import { add, getUserResponseTasks, updateTaskResponse,getTotalRewards,updateTaskRewards } from "../controllers/taskAnswer.js";

const router = express.Router();

router.post("/add", add)
router.get("/get", getUserResponseTasks)
router.get("/getReward/:userId", getTotalRewards)
router.put("/update", updateTaskResponse)
router.post("/updateReward", updateTaskRewards)

export default router