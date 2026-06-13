```javascript
export async function GET(request) {
const { searchParams } = new URL(request.url);
const origin = searchParams.get('origin');
const destination = searchParams.get('destination');
const dateFrom = searchParams.get('dateFrom');
const dateTo = searchParams.get('dateTo');

if (!origin || !destination || !dateFrom) {
return Response.json({ error: 'Missing parameters' }, { status: 400 });
}

try {
const formatDate = (dateStr) => {
if (!dateStr) return '';
const [year, month, day] = dateStr.split('-');
return `${day}/${month}/${year}`;
};

const formattedFrom = formatDate(dateFrom);
const formattedTo = dateTo ? formatDate(dateTo) : formattedFrom;

const kiwiUrl = `https://tequila-api.kiwi.com/v2/search?fly_from=${origin.toUpperCase()}&fly_to=${destination.toUpperCase()}&dateFrom=${formattedFrom}&dateTo=${formattedTo}&limit=50&partner=picky`;

const response = await fetch(kiwiUrl);
const data = await response.json();

if (!response.ok) {
return Response.json({ error: 'Flight search failed' }, { status: 500 });
}

const milesValuations = {
'SW': 1.35, 'UA': 1.25, 'AA': 1.20, 'DL': 1.18,
'KE': 1.40, 'QR': 1.55, 'EK': 1.50, 'BA': 1.30,
};

const processedFlights = (data.data || []).map((flight) => {
const airline = flight.airlines?.[0] || 'UNKNOWN';
const estimatedMiles = Math.round(flight.distance / 2) || 15000;
const milesValue = (estimatedMiles * (milesValuations[airline] || 1.20)) / 100;

return {
id: flight.id,
airline: airline,
price: Math.round(flight.price),
distance: flight.distance,
duration: flight.duration?.total || 0,
departure: flight.route?.[0]?.dTime ? new Date(flight.route[0].dTime * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'N/A',
arrival: flight.route?.[flight.route.length - 1]?.aTime ? new Date(flight.route[flight.route.length - 1].aTime * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'N/A',
stops: (flight.route?.length || 1) - 1,
estimatedMiles,
milesValue: Math.round(milesValue),
bookingLink: flight.deep_link || ''
};
});

return Response.json({ flights: processedFlights });
} catch (error) {
console.error('Flight search error:', error);
return Response.json({ error: 'Server error: ' + error.message }, { status: 500 });
}
}
```
