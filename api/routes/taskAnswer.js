import express from "express";
import { add, getUserResponseTasks, updateTaskResponse } from "../controllers/taskAnswer.js";

const router = express.Router();

router.post("/add", add)
router.get("/get", getUserResponseTasks)
router.put("/update", updateTaskResponse)

export default router