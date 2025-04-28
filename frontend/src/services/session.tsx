

export async function getSID(): Promise<string> {

    const currentSessionId = localStorage.getItem('sessionId');
    if (currentSessionId) {
      return currentSessionId;
    }

    const token = localStorage.getItem('token');
    
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    console.log("Fetching new session ID");
    console.log("Token: ", token);
    console.log("Headers: ", headers);
    console.log("URL: ", `${process.env.REACT_APP_PROD_API_URL}/session`);
    console.log("Method: ", process.env.REACT_APP_PROD_API_URL);
  
    const response = await fetch(`${process.env.REACT_APP_PROD_API_URL}/session`, {
      method: 'GET',
      headers
    });
  
    if (!response.ok) {
      throw new Error(`Failed to initialize session: ${response.status}`);
    }

    const responseText = await response.text();
    console.log("Response: ", responseText);
    console.log("Response status: ", response.status);

    const data = await response.json();
    const { token: newToken, refreshToken, sessionId} = data;

    if (!sessionId) {
      throw new Error('Session ID is not returned by server');
    }
    if (!newToken) {
      throw new Error('Auth token is not returned by server');
    }
  
    localStorage.setItem('token', newToken);
    localStorage.setItem('refreshToken', refreshToken);
    localStorage.setItem('sessionId', sessionId);
  
    return sessionId;
  }