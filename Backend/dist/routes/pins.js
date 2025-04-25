"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const pins_1 = require("@controllers/pins");
const express_1 = require("express");
const router = (0, express_1.Router)();
router.get("/allPins/:sessionId", pins_1.getPins);
router.post("/savepin", pins_1.postPin);
router.delete("/deletepin/:pinId/:sessionId", pins_1.deletePin);
exports.default = router;
