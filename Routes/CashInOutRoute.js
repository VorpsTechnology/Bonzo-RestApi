import express from "express";
import { cashIn, cashOut } from "../Controllers/CashInOutController.js";

const router = express.Router();

router.post("/payment",cashIn)
router.post("/payout",cashOut)
export default router;


