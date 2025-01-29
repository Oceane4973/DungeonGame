const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.API_PORT || 3000;
const API_URL = process.env.API_URL || "http://localhost";

app.use(express.json());

app.use(cors({
  origin: API_URL,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

const dungeonRoutes = require('./routes/dungeon.js');
const imagesRoutes = require('./routes/images.js');

app.use('/api/dungeons', dungeonRoutes);
app.use('/api/images', imagesRoutes);

app.listen(PORT, () => {
    console.log(`Serveur started on ${API_URL}:${PORT}`);
});
