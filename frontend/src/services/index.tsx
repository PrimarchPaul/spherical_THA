export class Pin {
    public id!: number;
    public longitude!: number;
    public latitude!: number;
    public pinName!: string;
    public pinDescription!: string;
}

export interface ChatMessage {
    sender: 'user' | 'assistant';
    text: string;
  }

export async function getOpenAiResponse(prompt: string, lat: number, lng: number): Promise<ChatMessage>{
    try{

        if(!prompt){
            throw new Error("Prompt is required")
        }
        const response = await fetch('/chat/surroundings', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                "Authorization": `Bearer ${localStorage.getItem("token")}`
            },
            body: JSON.stringify({
                prompt: prompt,
                latitude: lat,
                longitude: lng
            })
        })
        if(!response.ok){
            throw new Error("Failed to fetch data from OpenAI")
        }
        
        return response.json()

    }catch(e){
        console.log(e);
        throw new Error("An error occurred while fetching OpenAI response");
    }
    
}

export async function savePin(pin: any) {
    try{
        if(!pin){
            throw new Error("Pin is required")
        }

        const response = await fetch('/pin/savepin', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                "Authorization": `Bearer ${localStorage.getItem("token")}`
            },
            body: JSON.stringify(pin)
        })
        if(!response.ok){
            throw new Error("Failed to save pin")
        }
        
        return await response.json()

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

        const response = await fetch(`/pin/deletepin/${pinId}/${sessionId}`, {
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

        const response = await fetch(`/pin/allPins/${sessionId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                "Authorization": `Bearer ${localStorage.getItem("token")}`
            }
        })
        if(!response.ok){
            throw new Error("Failed to get pin")
        }
        
        return response.json()

    }catch(e){
        console.log(e)
        throw new Error("An error occurred while fetching Pins from database");
    }
}