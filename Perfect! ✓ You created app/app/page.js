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
const [cabin, setCabin] = useState('economy');
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
setFlights([]);

try {
const response = await fetch(
`/api/search?origin=${origin}&destination=${destination}&dateFrom=${departDate}&dateTo=${returnDate}&cabin=${cabin}`
);
const data = await response.json();
if (data.error) {
setError(data.error);
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

const calculateBest = (flight) => {
const cash = flight.price;
const miles = flight.estimatedMiles;
const points = Math.round(flight.price * 100);
return cash < miles/15000 && cash < points/100 ? 'cash' : miles/15000 < points/100 ? 'miles' : 'points';
};

return (
<div style={{ maxWidth: '1400px', margin: '0 auto', padding: '20px', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', minHeight: '100vh' }}>
<h1 style={{ color: '#fff', textAlign: 'center', marginBottom: '30px', fontSize: '32px' }}>✈️ Flight & Miles Optimizer</h1>

<div style={{ background: 'rgba(255,255,255,0.95)', padding: '30px', borderRadius: '12px', marginBottom: '30px' }}>
<div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '15px', marginBottom: '20px' }}>
<div>
<label style={{ fontWeight: '600', color: '#333', marginBottom: '5px', display: 'block' }}>From</label>
<input value={origin} onChange={(e) => setOrigin(e.target.value.toUpperCase())} placeholder="STL" style={{ padding: '12px', border: '2px solid #ddd', borderRadius: '6px', width: '100%' }} />
</div>
<div>
<label style={{ fontWeight: '600', color: '#333', marginBottom: '5px', display: 'block' }}>To</label>
<input value={destination} onChange={(e) => setDestination(e.target.value.toUpperCase())} placeholder="CUN" style={{ padding: '12px', border: '2px solid #ddd', borderRadius: '6px', width: '100%' }} />
</div>
<div>
<label style={{ fontWeight: '600', color: '#333', marginBottom: '5px', display: 'block' }}>Depart</label>
<input type="date" value={departDate} onChange={(e) => setDepartDate(e.target.value)} style={{ padding: '12px', border: '2px solid #ddd', borderRadius: '6px', width: '100%' }} />
</div>
<div>
<label style={{ fontWeight: '600', color: '#333', marginBottom: '5px', display: 'block' }}>Return</label>
<input type="date" value={returnDate} onChange={(e) => setReturnDate(e.target.value)} style={{ padding: '12px', border: '2px solid #ddd', borderRadius: '6px', width: '100%' }} />
</div>
<div>
<label style={{ fontWeight: '600', color: '#333', marginBottom: '5px', display: 'block' }}>Cabin</label>
<select value={cabin} onChange={(e) => setCabin(e.target.value)} style={{ padding: '12px', border: '2px solid #ddd', borderRadius: '6px', width: '100%' }}>
<option value="economy">Economy</option>
<option value="business">Business</option>
<option value="first">First</option>
</select>
</div>
</div>
<button onClick={searchFlights} disabled={loading} style={{ padding: '12px 30px', background: '#667eea', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: '600' }}>
{loading ? 'Searching...' : 'Search Flights'}
</button>
</div>

{error && <div style={{ background: '#fee', color: '#c33', padding: '15px', borderRadius: '6px', marginBottom: '20px', borderLeft: '4px solid #c33' }}>{error}</div>}

{flights.length > 0 && (
<>
<div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
<button onClick={() => setSortBy('price')} style={{ padding: '8px 16px', background: sortBy === 'price' ? '#667eea' : 'white', color: sortBy === 'price' ? 'white' : '#667eea', border: '2px solid #667eea', borderRadius: '6px', cursor: 'pointer' }}>Sort by Price</button>
<button onClick={() => setSortBy('miles')} style={{ padding: '8px 16px', background: sortBy === 'miles' ? '#667eea' : 'white', color: sortBy === 'miles' ? 'white' : '#667eea', border: '2px solid #667eea', borderRadius: '6px', cursor: 'pointer' }}>Sort by Miles</button>
</div>
<div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '20px' }}>
{sorted.map((flight, idx) => (
<div key={idx} style={{ background: 'white', padding: '20px', borderRadius: '10px', boxShadow: '0 5px 20px rgba(0,0,0,0.1)', borderLeft: '5px solid #667eea' }}>
<div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
<span style={{ fontWeight: '700', color: '#333', fontSize: '16px' }}>{AIRLINE_NAMES[flight.airline] || flight.airline}</span>
<span style={{ fontSize: '24px', fontWeight: '700', color: '#667eea' }}>${flight.price}</span>
</div>
<div style={{ fontSize: '13px', color: '#666', lineHeight: '1.8', marginBottom: '15px' }}>
<div>✈️ {flight.departure} → {flight.arrival}</div>
<div>📍 {flight.stops} stop{flight.stops !== 1 ? 's' : ''}</div>
<div>⏱️ {Math.floor(flight.duration / 3600)}h {Math.floor((flight.duration % 3600) / 60)}m</div>
</div>
<div style={{ background: '#f7f9fc', padding: '15px', borderRadius: '6px', marginBottom: '15px' }}>
<div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0' }}>
<span>💵 Cash</span>
<span>${flight.price} {calculateBest(flight) === 'cash' && <span style={{ background: '#10b981', color: 'white', padding: '2px 8px', borderRadius: '12px', fontSize: '11px', fontWeight: '600' }}>BEST</span>}</span>
</div>
<div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0' }}>
<span>✈️ Miles</span>
<span>{flight.estimatedMiles.toLocaleString()} {calculateBest(flight) === 'miles' && <span style={{ background: '#10b981', color: 'white', padding: '2px 8px', borderRadius: '12px', fontSize: '11px', fontWeight: '600' }}>BEST</span>}</span>
</div>
<div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0' }}>
<span>💳 Points</span>
<span>{Math.round(flight.price * 100).toLocaleString()} {calculateBest(flight) === 'points' && <span style={{ background: '#10b981', color: 'white', padding: '2px 8px', borderRadius: '12px', fontSize: '11px', fontWeight: '600' }}>BEST</span>}</span>
</div>
</div>
{flight.bookingLink && (
<a href={flight.bookingLink} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>
<button style={{ width: '100%', padding: '10px', background: '#667eea', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: '600' }}>Book on Kiwi.com →</button>
</a>
)}
</div>
))}
</div>
</>
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
