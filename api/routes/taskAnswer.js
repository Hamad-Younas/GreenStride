import express from "express";
import { add } from "../controllers/taskAnswer.js";

const router = express.Router();

router.post("/add", add)

export default router