import express from "express";
import { create } from "../Controllers/KycWalletController.js";

const router = express.Router();

router.post("/create",create)
export default router;