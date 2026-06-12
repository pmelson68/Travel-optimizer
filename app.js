'use client';
import { useState } from 'react';

const TravelOptimizer = () => {
const [origin, setOrigin] = useState('STL');
const [destination, setDestination] = useState('CUN');
const [departDate, setDepartDate] = useState('2025-02-01');
const [flights, setFlights] = useState([]);
const [loading, setLoading] = useState(false);
const [sortBy, setSortBy] = useState('price');

const AIRLINES = {
SW: 'Southwest', UA: 'United', AA: 'American', DL: 'Delta',
KE: 'Korean Air', QR: 'Qatar', EK: 'Emirates'
};

const VALUATIONS = {
SW: 0.0135, UA: 0.0125, AA: 0.012, DL: 0.0118,
KE: 0.014, QR: 0.0155, EK: 0.015
};

const searchFlights = async () => {
setLoading(true);
try {
const response = await fetch(
`https://api.skypicker.com/flights?fly_from=${origin}&fly_to=${destination}&dateFrom=${departDate}&dateTo=${departDate}&partner=picky`
);
const data = await response.json();
setFlights(data.data || []);
} catch (err) {
console.error('Flight search failed:', err);
}
setLoading(false);
};

return (
<div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
<h1>✈️ Flight & Miles Optimizer</h1>
<div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px', marginBottom: '20px' }}>
<input type="text" placeholder="From (STL)" value={origin} onChange={(e) => setOrigin(e.target.value.toUpperCase())} />
<input type="text" placeholder="To (CUN)" value={destination} onChange={(e) => setDestination(e.target.value.toUpperCase())} />
<input type="date" value={departDate} onChange={(e) => setDepartDate(e.target.value)} />
</div>
<button onClick={searchFlights} disabled={loading} style={{ padding: '10px 20px', cursor: 'pointer', backgroundColor: '#d4af37', color: '#000', border: 'none', borderRadius: '5px', fontWeight: 'bold' }}>
{loading ? 'Searching...' : 'Search Flights'}
</button>
<div style={{ marginTop: '30px' }}>
{flights.length > 0 && (
<div>
<h2>Results ({flights.length} flights)</h2>
{flights.slice(0, 10).map((flight, idx) => (
<div key={idx} style={{ border: '1px solid #444', padding: '15px', marginBottom: '10px', borderRadius: '8px', backgroundColor: '#1e293b' }}>
<p><strong>Price:</strong> ${flight.price}</p>
<p><strong>Duration:</strong> {Math.round(flight.duration.total / 3600)} hours</p>
<p><strong>Stops:</strong> {flight.route.length - 1}</p>
</div>
))}
</div>
)}
{flights.length === 0 && !loading && <p>No flights found. Try searching!</p>}
</div>
</div>
);
};

export default TravelOptimizer;
```
