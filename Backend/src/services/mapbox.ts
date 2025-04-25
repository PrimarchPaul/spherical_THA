import mbx from '@mapbox/mapbox-sdk';
import  Geocoding  from '@mapbox/mapbox-sdk/services/geocoding';
import { Pin } from '@models/pin';

const mapboxClient = mbx({ accessToken: process.env.MAPBOX_API_KEY! });
const MapboxGeocoding = Geocoding(mapboxClient);

export async function reverseLocation(lat: number, lng: number) {
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

        const response = await MapboxGeocoding.reverseGeocode({ 
            query:[lat,lng],
            limit: 1,
        }).send();

        if(!response || !response.body || !response.body.features || response.body.features.length === 0) {
            throw new Error('No results found');
        }
        
        return response.body.features[0].place_name;

    } catch (error) {
        console.error('Error in reverseLocation:', error);
        throw error;
    }
}

export async function savePin(
    pin: {
        sessionId: string;
        id?: number;
        longitude: number;
        latitude: number;
        pinName: string;
        pinDescription?: string;
    }
){
    try {

        if (!pin) {
            throw new Error('Pin is required');
        }

        const existingPin = await Pin.findOne({
            where: {
                sessionId: pin.sessionId,
                id: pin.id,
            },
        });

        if (existingPin) {
            await existingPin.update(pin);
            return existingPin;
        }

        const newPin = await Pin.create(pin);
        return newPin;

    } catch (error) {
        console.error('Error in savePin:', error);
        throw error;
    }
}

