
const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');
const cors = require('cors');

const app = express();
const port = 3001;

app.use(cors());

app.get('/api/flights', async (req, res) => {
  try {
    const url = 'https://tokyo-haneda.com/flight/flightInfo_int.html?flight=arr';
    const { data } = await axios.get(url);
    const $ = cheerio.load(data);

    const flights = [];
    $('.flight-body .flight-row').each((i, el) => {
      const flight = {
        scheduledTime: $(el).find('.scheduled-time').text().trim(),
        airline: $(el).find('.airline-name').text().trim(),
        flightNumber: $(el).find('.flight-number').text().trim(),
        from: $(el).find('.flight-from').text().trim(),
        gate: $(el).find('.flight-gate').text().trim(),
        status: $(el).find('.flight-status').text().trim(),
      };
      flights.push(flight);
    });

    res.json(flights);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch flight data' });
  }
});

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
