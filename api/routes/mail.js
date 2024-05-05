import express from "express";
import { mail } from "../controllers/mail.js";

const router = express.Router();

router.post("/send", mail);

export default router;