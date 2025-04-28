import {
    getPins,
    postPin,
    deletePin,
    updatePin
} from "@controllers/pins";
import { Router } from "express";


const router = Router();

router.get("/allPins/:sessionId", getPins);
router.post("/savepin", postPin);
router.delete("/deletepin/:pinId/:sessionId", deletePin);
router.put("/updatepin", updatePin);

export default router;
