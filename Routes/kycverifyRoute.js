import express from "express";
import { create, verify } from "../Controllers/KycWalletController.js";

const router = express.Router();

router.post("/kyc",verify)
export default router;