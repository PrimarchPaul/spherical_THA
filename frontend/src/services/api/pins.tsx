export class Pin {
    public id!: string;
    public sessionId!: string;
    public longitude!: number;
    public latitude!: number;
    public pinName!: string;
    public pinDescription!: string;
}


export async function savePin(pin: any) {
    try{
        if(!pin){
            throw new Error("Pin is required")
        }

        const response = await fetch('http://localhost:8080/pin/savepin', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                "Authorization": `Bearer ${localStorage.getItem("token")}`
            },
            body: JSON.stringify({pin})
        })
        if(!response.ok){
            throw new Error("Failed to save pin")
        }
        const { pin: savedPin } = await response.json()
        return savedPin

    }catch(e){
        console.log(e)
    }
    
}

export async function deletePin(sessionId: string, pinId: string) {
    try{
        if(!pinId){
            throw new Error("Pin ID is required")
        }

        if(!sessionId){
            throw new Error("Session ID is required")
        }

        console.log("services/api/pins.tsx/deletePin- session:", sessionId," pinid:", pinId)

        const response = await fetch(`http://localhost:8080/pin/deletepin/${pinId}/${sessionId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                "Authorization": `Bearer ${localStorage.getItem("token")}`
            }
        })
        if(!response.ok){
            throw new Error("Failed to delete pin")
        }

        
        
        return await response.json()

    }catch(e){
        console.log(e)
    }
    
}

export async function getPins(sessionId: string): Promise<Pin[]>{
    try{
        if(!sessionId){
            throw new Error("Session ID is required")
        }

        console.log("📡 [getPins] fetching for session", sessionId);

        const response = await fetch(`http://localhost:8080/pin/allPins/${sessionId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                "Authorization": `Bearer ${localStorage.getItem("token")}`
            }
        })
        if(!response.ok){
            throw new Error("Failed to get pin")
        }
        
        const allPins = await response.json()
        console.log("📡 [getPins] response: ", allPins);
        if (Array.isArray(allPins.pin)) {
            return allPins.pin as Pin[];
        }
        if (Array.isArray(allPins.pins)) {
            return allPins.pins as Pin[];
        }
        if (Array.isArray(allPins.data)) {
            return allPins.data as Pin[];
        }
        if (Array.isArray(allPins)) {
            return allPins as Pin[];
        }
        console.warn("Did not retrieve all pins, returning empty array");
        return [];

    }catch(e){
        console.log(e)
        throw new Error("An error occurred while fetching Pins from database");
    }
}