import { getSurroundingsInformation } from "@services/openai";
import { reverseLocation } from "@services/mapbox";
import { Request, Response} from "express";

export async function getSurroundingsInformationForUser(req: Request, res: Response) {
    try{
        const { prompt, latitude,longitude } = req.body;

        if(!prompt) {
            res.status(400).json({ error: "Prompt and location are required" });
            return;
        }

        if(!latitude || !longitude) {
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

        const location = await reverseLocation(latNum, lngNum);
        
        if(!location) {
            res.status(500).json({ error: "Failed to get location" });
            return
        }

        const information = await getSurroundingsInformation(prompt, location);

        if(!information) {
            res.status(500).json({ error: "Failed to get surroundings information" });
            return
        }

         res.status(200).json({ information });

    }catch (error) {
        console.error("---controllers::openai::getsurroundingsinformationforuser---", error)
        res.status(500).json({ error: "Failed to get surroundings information" });
        return
    }
}