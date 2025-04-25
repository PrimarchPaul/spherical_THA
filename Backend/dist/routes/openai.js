"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const openai_1 = require("@controllers/openai");
const express_1 = require("express");
const router = (0, express_1.Router)();
router.post("/surroundings", openai_1.getSurroundingsInformationForUser);
exports.default = router;
