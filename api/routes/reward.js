import express from "express";
import { getAll } from "../controllers/reward.js";

const router = express.Router();

router.get("/get", getAll)


export default router