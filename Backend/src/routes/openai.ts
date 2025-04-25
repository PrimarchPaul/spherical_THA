import { getSurroundingsInformationForUser } from "@controllers/openai";
import { Router } from "express";
import { verifyJWT } from "@middlewares/jwtAuth";

const router = Router();

router.post("/surroundings", getSurroundingsInformationForUser);

export default router;