"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require('module-alias/register');
require("module-alias/register");
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const index_1 = __importDefault(require("@routes/index"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const cors_1 = __importDefault(require("cors"));
const path_1 = __importDefault(require("path"));
dotenv_1.default.config({ path: path_1.default.join(__dirname, '../.env') });
const server = (0, express_1.default)();
const PORT = process.env.PORT || 3000;
const HOST = process.env.HOST || 'localhost';
const raw = process.env.CORS_WHITELIST || '';
const WHITELIST = raw.split(',').map(origin => origin.trim());
server.use((0, cors_1.default)({
    origin: (incomingOrigin, callback) => {
        if (!incomingOrigin)
            return callback(null, true);
        if (WHITELIST.includes(incomingOrigin)) {
            return callback(null, true);
        }
        return callback(new Error(`CORS policy: origin "${incomingOrigin}" not allowed`));
    },
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization'],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
}));
//server.options(/(.*)/,cors())
server.use(express_1.default.json());
server.use(express_1.default.urlencoded({ extended: true }));
server.use((0, cookie_parser_1.default)());
server.use("/", index_1.default);
server.listen(PORT, () => {
    console.log(`Server is running at http://${HOST}:${PORT}`);
});
