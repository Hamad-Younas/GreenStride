import express from "express";
import { add,getAll,getUserAnswersSummary,getUserScores } from "../controllers/answer.js";

const router = express.Router();

router.post("/add", add)
router.get("/getAll", getAll)
router.get("/graph", getUserAnswersSummary)
router.get("/score", getUserScores)


export default router