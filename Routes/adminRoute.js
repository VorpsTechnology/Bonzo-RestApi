import express from "express";
import {  getWalletState,  updateWalletState } from "../Controllers/adminController.js";
// import authMiddleWare from "../Middleware/AuthMiddleWare.js";
const router = express.Router();
router.put("/updatewalletstate",  updateWalletState)

router.get("/getwalletstate", getWalletState)
export default router; 