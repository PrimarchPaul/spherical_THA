import { Router } from "express";
import openAiRoutes from "@routes/openai";
import pinsRoutes from "@routes/pins";
import { initSession } from "@controllers/session";
import { verifyJWT } from "@middlewares/jwtAuth";

const router = Router();

router.use(verifyJWT)
router.use("/session", initSession)
router.use("/chat", openAiRoutes)
router.use("/pin", pinsRoutes)

export default router;