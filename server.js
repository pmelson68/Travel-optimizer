const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');

const app = express();
app.use(cors());

app.get('/api/flights', async (req, res) => {
const { from, to, date } = req.query;

try {
const response = await fetch(
`https://api.tequila.kiwi.com/v2/search?fly_from=${from}&fly_to=${to}&dateFrom=${date}&dateTo=${date}&limit=20&partner=picky`
);
const data = await response.json();
res.json(data.data || []);
} catch (error) {
res.json([]);
}
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
