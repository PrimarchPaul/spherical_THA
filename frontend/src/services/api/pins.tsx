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

        const response = await fetch(`${process.env.REACT_APP_PROD_API_URL}/pin/savepin`, {
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


        const response = await fetch(`${process.env.REACT_APP_PROD_API_URL}/pin/deletepin/${pinId}/${sessionId}`, {
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

        console.log("getPins Session ID: ", sessionId)

        const response = await fetch(`${process.env.REACT_APP_PROD_API_URL}/pin/allPins/${sessionId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                "Authorization": `Bearer ${localStorage.getItem("token")}`,
                "ngrok-skip-browser-warning": "69420"
            }
        })


        const test = await response.text()
        console.log("getPins response: ", test)

        if(!response.ok){
            throw new Error("Failed to get pin")
        }
        
        const allPins = await response.json()
        
        return allPins.pin as Pin[] || [];

    }catch(e){
        console.log(e)
        throw new Error("An error occurred while fetching Pins from database");
    }
}

export async function updatePin(pin: Pin) {
    try{
        
        if(!pin){
            throw new Error("Pin is required")
        }

        const response = await fetch(`${process.env.REACT_APP_PROD_API_URL}/pin/updatepin`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                "Authorization": `Bearer ${localStorage.getItem("token")}`
            },
            body: JSON.stringify({pin})
        })

        if(!response.ok){
            throw new Error("Failed to update pin")
        }

        const { pin: updatedPin } = await response.json()
        return updatedPin

    }catch(e){
        console.log(e)
    }
    
}