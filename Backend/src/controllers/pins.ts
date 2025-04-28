import {Request, Response} from 'express';
import { sequelize } from '@services/database';
import { Pin } from '@models/pin';
import { savePin } from '@services/mapbox';

export async function getPins(req: Request, res: Response) {
    try {

        const { sessionId } = req.params;

        if (!sessionId) {
            res.status(400).json({ error: "No session ID" });
            return;
        }

        //get all pins from the session id from the database
        const pin = await Pin.findAll({
            attributes: ['id', 'sessionId', 'longitude', 'latitude', 'pinName', 'pinDescription'],
            where: { sessionId },
        })

        res.status(200).json({ pin })

    } catch (error) {
        console.error("---controllers::client::getpins---", error);
        res.status(500).json({ error: "Failed to get pins" });
        return;
    }
}

export async function postPin(req: Request, res: Response) {
    try {
        const { pin } = req.body;

        if (!pin) {
            res.status(400).json({ error: "Pin are required" });
            return;
        }

        const saveCurPin = await savePin(pin);
        if (!saveCurPin) {
            res.status(500).json({ error: "Failed to save pin" });
            return;
        }

        res.status(200).json({ pin });
    } catch (error) {
        console.error("---controllers::client::savepins---", error);
        res.status(500).json({ error: "Failed to save pins" });
        return;
    }
}

export async function deletePin(req: Request, res: Response) {
    try{
        const { sessionId, pinId } = req.params;

        if (!sessionId) {
            res.status(400).json({ error: "No session ID" });
            return;
        }

        if(!pinId) {
            res.status(400).json({ error: "No pin ID" });
            return;
        }

        await Pin.destroy({
            where: { sessionId, id: pinId },
        })

        res.status(200).json({ message: "Pins deleted" });
    }catch(error) {
        console.error("---controllers::client::deletepins---", error);
        res.status(500).json({ error: "Failed to delete pins" });
        return;
    }
}

export async function updatePin(req: Request, res: Response) {
    try {
        const { pin } = req.body;

        if (!pin || !pin.id) {
            res.status(400).json({ error: "Pin with a valid id is required" });
            return;
        }

        const updatedPin = await Pin.update(pin, {
            where: { id: pin.id },
        });

        if (!updatedPin) {
            res.status(500).json({ error: "Failed to update pin" });
            return;
        }

        res.status(200).json({ message: "Pin updated" });
    } catch (error) {
        console.error("---controllers::client::updatepins---", error);
        res.status(500).json({ error: "Failed to update pins" });
        return;
    }
}