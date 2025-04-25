import OpenAI from "openai";

const openaiClient = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
})

export async function getSurroundingsInformation(prompt: string, location: string) {
    try{
        if(!prompt){
            throw new Error("Location is required")
        }

        const response = await openaiClient.chat.completions.create({
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
        })

        if(!response.choices || response.choices.length === 0){
            throw new Error("No response from OpenAI")
        }
        
        return response.choices[0].message.content
    }catch (error) {
        console.error("---services::openai::getsurroundingsinformation---", error)
        throw new Error("Failed to get surroundings information")
    }
}