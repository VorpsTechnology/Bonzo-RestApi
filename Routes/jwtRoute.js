import express from "express";
import { createNew } from "../Controllers/JwtController.js";
const router = express.Router();


router.post("/token",createNew)
export default router;