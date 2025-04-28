export interface ChatMessage {
    sender: 'user' | 'assistant';
    text: string;
  }

export async function getOpenAiResponse(prompt: string, lat: number, lng: number): Promise<ChatMessage>{
    try{

        if(!prompt){
            throw new Error("Prompt is required")
        }
        const response = await fetch(`${process.env.REACT_APP_PROD_API_URL}/chat/surroundings`, {
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
