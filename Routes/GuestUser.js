import express from "express";
import { changeGuestAccount, createGuestUser } from "../Controllers/GuestUserController.js";

const router = express.Router();

router.post("/create", createGuestUser)
router.post("/changeguestacount", changeGuestAccount)
export default router;

