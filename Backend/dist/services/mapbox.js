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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.reverseLocation = reverseLocation;
exports.savePin = savePin;
const mapbox_sdk_1 = __importDefault(require("@mapbox/mapbox-sdk"));
const geocoding_1 = __importDefault(require("@mapbox/mapbox-sdk/services/geocoding"));
const pin_1 = require("@models/pin");
const mapboxClient = (0, mapbox_sdk_1.default)({ accessToken: process.env.MAPBOX_API_KEY });
const MapboxGeocoding = (0, geocoding_1.default)(mapboxClient);
function reverseLocation(lat, lng) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            if (!lat || !lng) {
                throw new Error('Latitude and longitude are required');
            }
            if (lat < -90 || lat > 90) {
                throw new Error('Latitude must be between -90 and 90');
            }
            if (lng < -180 || lng > 180) {
                throw new Error('Longitude must be between -180 and 180');
            }
            const response = yield MapboxGeocoding.reverseGeocode({
                query: [lat, lng],
                limit: 1,
            }).send();
            if (!response || !response.body || !response.body.features || response.body.features.length === 0) {
                throw new Error('No results found');
            }
            return response.body.features[0].place_name;
        }
        catch (error) {
            console.error('Error in reverseLocation:', error);
            throw error;
        }
    });
}
function savePin(pin) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            if (!pin) {
                throw new Error('Pin is required');
            }
            const existingPin = yield pin_1.Pin.findOne({
                where: {
                    sessionId: pin.sessionId,
                    id: pin.id,
                },
            });
            if (existingPin) {
                yield existingPin.update(pin);
                return existingPin;
            }
            const newPin = yield pin_1.Pin.create(pin);
            return newPin;
        }
        catch (error) {
            console.error('Error in savePin:', error);
            throw error;
        }
    });
}
