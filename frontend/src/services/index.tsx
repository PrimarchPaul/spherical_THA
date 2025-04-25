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
        const response = await fetch('http://localhost:8080/chat/surroundings', {
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

        const response = await fetch('http://localhost:8080/pin/savepin', {
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

        if(Array.isArray(allPins)){
            return allPins as Pin[]
        }else if (Array.isArray((allPins as any).pins)) {
            return (allPins as any).pins;
          } else if (Array.isArray((allPins as any).data)) {
            return (allPins as any).data;
          }

        
        return [];

    }catch(e){
        console.log(e)
        throw new Error("An error occurred while fetching Pins from database");
    }
}