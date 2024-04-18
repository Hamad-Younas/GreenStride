import express from "express";
import { add,getAll } from "../controllers/answer.js";

const router = express.Router();

router.post("/add", add)
router.get("/getAll", getAll)


export default router