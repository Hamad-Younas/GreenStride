import express from "express";
import { getTaskQuestions } from "../controllers/task.js";

const router = express.Router();

router.get("/get", getTaskQuestions)


export default router