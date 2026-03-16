const API_URL = 'http://localhost:5000/api/gauges';

export async function fetchGauges() {
    const res = await fetch(API_URL);
    if (!res.ok) throw new Error('Failed to fetch gauges');
    return res.json();
}
