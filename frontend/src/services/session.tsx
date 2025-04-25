/*
export async function getSID(){
    try{
        const response = await fetch('http://localhost:8080/session', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        })

        if(!response.ok){
            throw new Error("Failed to get session ID")
        }

        const data = await response.json()
        localStorage.setItem('token', data.token)
        localStorage.setItem('sessionId', data.sessionId)
    }catch(e){
        console.log(e)
    }
}
*/

export async function getSID(): Promise<string> {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Auth token is missing');
    }
  
    const response = await fetch('http://localhost:8080/session', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });
  
    if (!response.ok) {
      throw new Error(`Failed to initialize session: ${response.status}`);
    }
  
 
    const data = await response.json();
    const { token: newToken, sessionId } = data;

    if (!sessionId) {
      throw new Error('Session ID is not returned by server');
    }
    if (!newToken) {
      throw new Error('Auth token is not returned by server');
    }
  
    localStorage.setItem('token', newToken);
    localStorage.setItem('sessionId', sessionId);
  
    return sessionId;
  }