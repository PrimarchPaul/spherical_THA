
export async function apiGet<T>(url: string): Promise<T> {
    const token = localStorage.getItem('token');
    const res = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      credentials: 'include',
    });
    if (!res.ok) {
      const txt = await res.text();
      throw new Error(`GET ${url} failed (${res.status}): ${txt}`);
    }
    return res.json();
  }

