"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyJWT = verifyJWT;
const jsonwebtoken_1 = __importStar(require("jsonwebtoken"));
function verifyJWT(req, res, next) {
    const auth = req.header('Authorization');
    if (!auth) {
        res.status(400).json({ error: 'Missing Authorization header' });
        return;
    }
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
        if (err instanceof jsonwebtoken_1.TokenExpiredError) {
            try {
                const refreshToken = req.cookies.refreshToken;
                if (!refreshToken) {
                    throw new Error('No refresh token');
                }
                const refreshPayload = jsonwebtoken_1.default.verify(refreshToken, process.env.REFRESH_SECRET);
                const newAccessToken = jsonwebtoken_1.default.sign({ sid: refreshPayload.sid }, process.env.JWT_SECRET, { expiresIn: '15m' });
                res.setHeader('Authorization', 'Bearer ' + newAccessToken);
                req.sessionId = refreshPayload.sid;
                next();
            }
            catch (refreshErr) {
                console.error('Refresh failed:', refreshErr);
                res.status(401).json({ error: 'Refresh token invalid or expired' });
                return;
            }
        }
        console.error('JWT verification error:', err);
        res.status(401).json({ error: 'Invalid access token' });
        return;
    }
}
