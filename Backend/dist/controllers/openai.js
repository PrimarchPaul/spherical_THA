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
exports.getSurroundingsInformationForUser = getSurroundingsInformationForUser;
const openai_1 = require("@services/openai");
const mapbox_1 = require("@services/mapbox");
function getSurroundingsInformationForUser(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { prompt, latitude, longitude } = req.body;
            if (!prompt) {
                res.status(400).json({ error: "Prompt and location are required" });
                return;
            }
            if (!latitude || !longitude) {
                res.status(400).json({ error: "Latitude and longitude are required" });
                return;
            }
            if (latitude < -90 || latitude > 90) {
                res.status(400).json({ error: "Latitude must be between -90 and 90" });
                return;
            }
            if (longitude < -180 || longitude > 180) {
                res.status(400).json({ error: "Longitude must be between -180 and 180" });
                return;
            }
            if (isNaN(latitude) || isNaN(longitude)) {
                res.status(400).json({ error: "Latitude and longitude must be numbers" });
                return;
            }
            const latNum = parseFloat(latitude);
            const lngNum = parseFloat(longitude);
            const location = yield (0, mapbox_1.reverseLocation)(latNum, lngNum);
            if (!location) {
                res.status(500).json({ error: "Failed to get location" });
                return;
            }
            const information = yield (0, openai_1.getSurroundingsInformation)(prompt, location);
            if (!information) {
                res.status(500).json({ error: "Failed to get surroundings information" });
                return;
            }
            res.status(200).json({ information });
        }
        catch (error) {
            console.error("---controllers::openai::getsurroundingsinformationforuser---", error);
            res.status(500).json({ error: "Failed to get surroundings information" });
            return;
        }
    });
}
