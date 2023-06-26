import express from "express";
import { allMatch, claim, creatematch, getMemberCount, getTickets, joinmatch, leaderboard, leaveMatch, removeMatch, startmatch, startPrivatematch, winners } from "../Controllers/newGameController.js";
import authMiddleWare from "../Middleware/AuthMiddleWare.js";
const router = express.Router();

router.post("/creatematch",authMiddleWare,creatematch)
router.post("/joinmatch",authMiddleWare,joinmatch)
router.post("/start",authMiddleWare,startmatch)
router.post("/startprivate",authMiddleWare,startPrivatematch)
router.post("/ticket",authMiddleWare,getTickets)
router.post("/claim",authMiddleWare,claim)
router.delete("/remove",authMiddleWare,removeMatch)
router.get("/allmatch",authMiddleWare,allMatch)
router.post("/winner",authMiddleWare,winners)
router.post("/getMemberCount",authMiddleWare,getMemberCount)
router.post("/leave",authMiddleWare,leaveMatch)
router.post("/leaderboard",authMiddleWare,leaderboard)

export default router; 