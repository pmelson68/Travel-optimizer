export async function searchFlights(origin, destination, dateFrom, dateTo) {
const url = `https://api.tequila.kiwi.com/v2/search?fly_from=${origin}&fly_to=${destination}&dateFrom=${dateFrom}&dateTo=${dateTo}&limit=20&partner=picky`;

try {
const response = await fetch(url);
const data = await response.json();
return data.data || [];
} catch (error) {
return [];
}
}
```
