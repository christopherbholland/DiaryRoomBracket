const express = require('express');
const axios = require('axios');
const app = express();

app.use(express.json());

app.post('/proxy', async (req, res) => {
  try {
    const response = await axios.post('https://swapi-graphql.netlify.app/.netlify/functions/index', req.body, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    res.json(response.data);
  } catch (error) {
    console.error('Error proxying request:', error);
    res.status(500).send('An error occurred while proxying the request.');
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Proxy server running on http://localhost:${PORT}`));