"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPins = getPins;
exports.postPin = postPin;
exports.deletePin = deletePin;
const pins_1 = require("@models/pins");
const mapbox_1 = require("@services/mapbox");
function getPins(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { sessionId } = req.params;
            if (!sessionId) {
                res.status(400).json({ error: "No session ID" });
                return;
            }
            //get all pins from the session id from the database
            const pins = yield pins_1.Pin.findAll({
                attributes: ['id', 'sessionId', 'longitude', 'latitude', 'pinName', 'pinDescription'],
                where: { sessionId },
            });
            res.status(200).json({ pins });
        }
        catch (error) {
            console.error("---controllers::client::getpins---", error);
            res.status(500).json({ error: "Failed to get pins" });
            return;
        }
    });
}
function postPin(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { pin } = req.body;
            if (!pin) {
                res.status(400).json({ error: "Pin are required" });
                return;
            }
            const saveCurPin = yield (0, mapbox_1.savePin)(pin);
            if (!saveCurPin) {
                res.status(500).json({ error: "Failed to save pin" });
                return;
            }
            res.status(200).json({ pin });
        }
        catch (error) {
            console.error("---controllers::client::savepins---", error);
            res.status(500).json({ error: "Failed to save pins" });
            return;
        }
    });
}
function deletePin(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { sessionId, id } = req.params;
            if (!sessionId) {
                res.status(400).json({ error: "No session ID" });
                return;
            }
            if (!id) {
                res.status(400).json({ error: "No pin ID" });
                return;
            }
            //delete all pins from the session id from the database
            yield pins_1.Pin.destroy({
                where: { sessionId, id },
            });
            res.status(200).json({ message: "Pins deleted" });
        }
        catch (error) {
            console.error("---controllers::client::deletepins---", error);
            res.status(500).json({ error: "Failed to delete pins" });
            return;
        }
    });
}
