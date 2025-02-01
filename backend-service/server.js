const express = require('express');
const cors = require('cors');
const { Server } = require('socket.io');
const http = require('http');
const connectRabbitMQ = require('./services/rabbitmq');

const app = express();
app.use(cors());

const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "http://dungeon-game-frontend-service:3000", // URL du frontend React
        methods: ["GET", "POST"]
    }
});

// Lancer la connexion RabbitMQ dès le démarrage
connectRabbitMQ(io);

app.get("/", (req, res) => {
    res.send("Serveur backend opérationnel !");
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`✅ Serveur backend démarré sur http://localhost:${PORT}`);
});
