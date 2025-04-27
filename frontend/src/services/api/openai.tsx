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

        console.log("OpenAI response from services/api/openai: ", response)
        
        return response.json()

    }catch(e){
        console.log(e);
        throw new Error("An error occurred while fetching OpenAI response");
    }
    
}
