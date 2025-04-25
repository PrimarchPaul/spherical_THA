"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyJWT = verifyJWT;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
function verifyJWT(req, res, next) {
    const auth = req.header('Authorization');
    if (!(auth === null || auth === void 0 ? void 0 : auth.startsWith('Bearer '))) {
        res.status(401).json({ error: 'No token provided or incorrectly formatted' });
        return;
    }
    const token = auth.slice(7);
    if (!token) {
        res.status(401).json({ error: 'No token provided or incorrectly formatted' });
        return;
    }
    try {
        const payload = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        req.sessionId = payload.sid;
        next();
    }
    catch (err) {
        res.status(401).json({ error: 'Invalid or expired token' });
        return;
    }
}
