import express from "express";
import { add,getAll } from "../controllers/adduestion.js";

const router = express.Router();

router.post("/add", add)
router.get("/getAll", getAll)


export default router