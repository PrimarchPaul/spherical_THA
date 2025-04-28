import { getSurroundingsInformationForUser } from "@controllers/openai";
import { Router } from "express";

const router = Router();

router.post("/surroundings", getSurroundingsInformationForUser);

export default router;