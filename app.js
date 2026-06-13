
```javascript
'use client';

import { useState } from 'react';

export default function Home() {
const [origin, setOrigin] = useState('STL');
const [destination, setDestination] = useState('CUN');
const [departDate, setDepartDate] = useState('2025-06-18');
const [returnDate, setReturnDate] = useState('2025-06-25');
const [flights, setFlights] = useState([]);
const [loading, setLoading] = useState(false);
const [error, setError] = useState('');

const searchFlights = async () => {
setLoading(true);
setError('');
try {
const res = await fetch(`/api/search?origin=${origin}&destination=${destination}&dateFrom=${departDate}&dateTo=${returnDate}`);
const data = await res.json();
setFlights(data.flights || []);
if (data.error) setError(data.error);
} catch (err) {
setError('Search failed');
}
setLoading(false);
};

return (







{error && {error}}
{flights.length > 0 && (



{AIRLINE_NAMES[flight.airline] || flight.airline} - ${flight.price}

✈️ {flight.departure} → {flight.arrival}
📍 {flight.stops} stops
⏱️ {Math.floor(flight.duration/3600)}h

💵 ${flight.price}
✈️ {flight.estimatedMiles.toLocaleString()} miles
💳 {Math.round(flight.price * 100).toLocaleString()} points


))}

)}
{!loading && flights.length === 0 && !error && 👆 Enter search and click Search}
{loading && 🔍 Searching...}

);
}

const AIRLINE_NAMES = {
'SW': 'Southwest', 'UA': 'United', 'AA': 'American', 'DL': 'Delta',
'KE': 'Korean Air', 'QR': 'Qatar', 'EK': 'Emirates', 'BA': 'British Airways',
};
```
```
