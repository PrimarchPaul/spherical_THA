import {
    getPins,
    postPin,
    deletePin,
} from "@controllers/pins";
import { Router } from "express";


const router = Router();

router.get("/allPins/:sessionId", getPins);
router.post("/savepin", postPin);
router.delete("/deletepin/:pinId/:sessionId", deletePin);

export default router;
