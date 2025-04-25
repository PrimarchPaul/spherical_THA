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
exports.getSurroundingsInformation = getSurroundingsInformation;
const openai_1 = __importDefault(require("openai"));
const openaiClient = new openai_1.default({
    apiKey: process.env.OPENAI_API_KEY,
});
function getSurroundingsInformation(prompt, location) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            if (!prompt) {
                throw new Error("Location is required");
            }
            const response = yield openaiClient.chat.completions.create({
                model: "gpt-3.5-turbo",
                messages: [
                    {
                        role: "system",
                        content: `
                    You are a helpful assistant that will receive a prompt. This prompt has to be about a surrounding location. If the prompt is
                    not about the location or does not use the location, respond with "Sorry, but I can only provide information about a surrounding location." 
                    Otherwise, provide a short and concise answer to the user.`,
                    },
                    {
                        role: "user",
                        content: `${prompt}, location: ${location}`,
                    },
                    {
                        role: "assistant",
                        content: `This information is going to be displayed in a web application. Return as json format.`,
                    }
                ],
            });
            if (!response.choices || response.choices.length === 0) {
                throw new Error("No response from OpenAI");
            }
            return response.choices[0].message.content;
        }
        catch (error) {
            console.error("---services::openai::getsurroundingsinformation---", error);
            throw new Error("Failed to get surroundings information");
        }
    });
}
