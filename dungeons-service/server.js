const express = require('express');
const cors = require('cors');

const app = express();

const API_PORT = 3000;
const API_URL = `http://localhost`;

console.log(API_PORT, API_URL)
app.use(express.json());

app.use(cors({
  origin: API_URL,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

const dungeonRoutes = require('./routes/dungeon.js');
const imagesRoutes = require('./routes/images.js');

app.use('/api/dungeon', dungeonRoutes);
app.use('/api/images', imagesRoutes);

app.listen(API_PORT, () => {
    console.log(`Serveur started on ${API_URL}:${API_PORT}`);
});
