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
    const secret = process.env.JWT_SECRET;
    const refreshSecret = process.env.REFRESH_SECRET;
    if (!secret)
        throw new Error('Missing JWT_SECRET');
    const token = jsonwebtoken_1.default.sign({ sid }, secret, { expiresIn: '1h' });
    const refreshToken = jsonwebtoken_1.default.sign({ sid }, refreshSecret, { expiresIn: '7d' });
    res.setHeader('Content-Type', 'application/json');
    res.json({ token, refreshToken, sessionId: sid });
};
exports.initSession = initSession;
