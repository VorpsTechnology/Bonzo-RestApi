import express from "express";
import { checkMobile, findAcount, getuser, getUserWallet, totalmatchandwinning, updateUser } from "../Controllers/UserController.js";
import authMiddleWare from "../Middleware/AuthMiddleWare.js";
const router = express.Router();
router.put("/:id", authMiddleWare, updateUser)
router.post("/getUserWallet",authMiddleWare,getUserWallet)
router.post("/checkmobile", checkMobile)
router.post("/findacccount", findAcount)
router.post("/totalmatchandwinning",authMiddleWare,  totalmatchandwinning)
router.post("/getuser", getuser)
export default router; 