"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.initSession = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const uuid_1 = require("uuid");
const initSession = (_req, res) => {
    const sid = (0, uuid_1.v4)();
    const token = jsonwebtoken_1.default.sign({ sid }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.json({ token });
};
exports.initSession = initSession;
