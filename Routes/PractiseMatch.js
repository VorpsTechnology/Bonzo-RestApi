import express from "express";
import { allMatch, claim, creatematch, getTickets, joinmatch, removeMatch, startmatch } from "../Controllers/PractiseController.js";
const router = express.Router();

router.post("/creatematch",creatematch)
router.post("/joinmatch",joinmatch)
router.post("/start",startmatch)
router.post("/ticket",getTickets)
router.post("/claim",claim)
router.delete("/remove",removeMatch)
router.get("/allmatch",allMatch)
export default router;




