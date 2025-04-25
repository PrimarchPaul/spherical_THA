"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const openai_1 = __importDefault(require("@routes/openai"));
const pins_1 = __importDefault(require("@routes/pins"));
const session_1 = require("@controllers/session");
const router = (0, express_1.Router)();
router.get("/session", session_1.initSession);
router.post("/chat", openai_1.default);
router.get("/pin", pins_1.default);
exports.default = router;
