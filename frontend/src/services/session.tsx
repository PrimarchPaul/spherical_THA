export async function getSID(){
    try{
        const response = await fetch('/session', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
        })

        if(!response.ok){
            throw new Error("Failed to get session ID")
        }

        const data = await response.json()
        localStorage.setItem('sessionId', data.sessionId)
    }catch(e){
        console.log(e)

    }
}