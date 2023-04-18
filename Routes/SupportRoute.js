import express from "express";
import { registerSupport } from "../Controllers/supportController.js";

const router = express.Router();

router.post("/gethelp" ,registerSupport )

export default router;
