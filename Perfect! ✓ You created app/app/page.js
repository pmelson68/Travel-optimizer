```javascript
'use client';
import { useState } from 'react';

const AIRLINE_NAMES = {
'SW': 'Southwest', 'UA': 'United', 'AA': 'American', 'DL': 'Delta',
'KE': 'Korean Air', 'QR': 'Qatar', 'EK': 'Emirates', 'BA': 'British Airways',
};

export default function FlightOptimizer() {
const [origin, setOrigin] = useState('STL');
const [destination, setDestination] = useState('CUN');
const [departDate, setDepartDate] = useState('2025-06-18');
const [returnDate, setReturnDate] = useState('2025-06-25');
const [flights, setFlights] = useState([]);
const [loading, setLoading] = useState(false);
const [error, setError] = useState('');
const [sortBy, setSortBy] = useState('price');

const searchFlights = async () => {
if (!origin || !destination || !departDate) {
setError('Please fill in all required fields');
return;
}
setLoading(true);
setError('');
try {
const response = await fetch(`/api/search?origin=${origin}&destination=${destination}&dateFrom=${departDate}&dateTo=${returnDate}`);
const data = await response.json();
if (data.error) {
setError(data.error);
setFlights([]);
} else {
setFlights(data.flights || []);
}
} catch (err) {
setError('Failed to search flights');
} finally {
setLoading(false);
}
};

let sorted = [...flights];
if (sortBy === 'price') sorted.sort((a, b) => a.price - b.price);
else if (sortBy === 'miles') sorted.sort((a, b) => a.estimatedMiles - b.estimatedMiles);

return (
<div style={{ maxWidth: '1400px', margin: '0 auto', padding: '20px', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', minHeight: '100vh', fontFamily: 'Arial, sans-serif' }}>
<h1 style={{ color: '#fff', textAlign: 'center', marginBottom: '30px', fontSize: '32px' }}>✈️ Flight & Miles Optimizer</h1>

<div style={{ background: 'white', padding: '30px', borderRadius: '12px', marginBottom: '30px' }}>
<div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '15px', marginBottom: '20px' }}>
<div>
<label style={{ fontWeight: '600', display: 'block', marginBottom: '5px' }}>From</label>
<input value={origin} onChange={(e) => setOrigin(e.target.value.toUpperCase())} placeholder="STL" style={{ padding: '10px', border: '2px solid #ddd', borderRadius: '6px', width: '100%' }} />
</div>
<div>
<label style={{ fontWeight: '600', display: 'block', marginBottom: '5px' }}>To</label>
<input value={destination} onChange={(e) => setDestination(e.target.value.toUpperCase())} placeholder="CUN" style={{ padding: '10px', border: '2px solid #ddd', borderRadius: '6px', width: '100%' }} />
</div>
<div>
<label style={{ fontWeight: '600', display: 'block', marginBottom: '5px' }}>Depart</label>
<input type="date" value={departDate} onChange={(e) => setDepartDate(e.target.value)} style={{ padding: '10px', border: '2px solid #ddd', borderRadius: '6px', width: '100%' }} />
</div>
<div>
<label style={{ fontWeight: '600', display: 'block', marginBottom: '5px' }}>Return</label>
<input type="date" value={returnDate} onChange={(e) => setReturnDate(e.target.value)} style={{ padding: '10px', border: '2px solid #ddd', borderRadius: '6px', width: '100%' }} />
</div>
</div>
<button onClick={searchFlights} disabled={loading} style={{ padding: '12px 30px', background: '#667eea', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: '600', fontSize: '16px' }}>
{loading ? 'Searching...' : 'Search Flights'}
</button>
</div>

{error && <div style={{ background: '#fee', color: '#c33', padding: '15px', borderRadius: '6px', marginBottom: '20px' }}>{error}</div>}

{flights.length > 0 && (
<div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
{sorted.map((flight, idx) => (
<div key={idx} style={{ background: 'white', padding: '20px', borderRadius: '10px', boxShadow: '0 5px 20px rgba(0,0,0,0.1)', borderLeft: '5px solid #667eea' }}>
<div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px' }}>
<span style={{ fontWeight: '700', fontSize: '16px' }}>{AIRLINE_NAMES[flight.airline] || flight.airline}</span>
<span style={{ fontSize: '24px', fontWeight: '700', color: '#667eea' }}>${flight.price}</span>
</div>
<div style={{ fontSize: '13px', color: '#666', lineHeight: '1.8' }}>
<div>✈️ {flight.departure} → {flight.arrival}</div>
<div>📍 {flight.stops} stop{flight.stops !== 1 ? 's' : ''}</div>
<div>⏱️ {Math.floor(flight.duration / 3600)}h {Math.floor((flight.duration % 3600) / 60)}m</div>
</div>
{flight.bookingLink && (
<a href={flight.bookingLink} target="_blank" rel="noopener noreferrer" style={{ display: 'block', marginTop: '15px' }}>
<button style={{ width: '100%', padding: '10px', background: '#667eea', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: '600' }}>Book →</button>
</a>
)}
</div>
))}
</div>
)}

{!loading && flights.length === 0 && !error && (
<div style={{ textAlign: 'center', color: 'white', padding: '40px', fontSize: '18px' }}>
👆 Enter your search criteria and click "Search Flights"
</div>
)}

{loading && <div style={{ textAlign: 'center', color: 'white', fontSize: '18px' }}>🔍 Searching for flights...</div>}
</div>
);
}
```
