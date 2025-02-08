const express = require('express');
const cors = require('cors');
const { Server } = require('socket.io');
const http = require('http');
const connectRabbitMQ = require('./services/rabbitmq');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: `http://${process.env.FRONTEND_HOST}`, // URL du frontend React
        methods: ["GET", "POST"],
        allowedHeaders: ["Content-Type", "Authorization"],
        credentials: true
    },
    transports: ["websocket", "polling"]
});

app.use(cors({
    origin: `http://${process.env.FRONTEND_HOST}`,
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type"],
    credentials: true
}));

// Lancer la connexion RabbitMQ dès le démarrage
connectRabbitMQ(io);

app.get("/", (req, res) => {
    res.send("Serveur backend opérationnel !");
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Serveur backend démarré sur http://localhost:${PORT}`);
});
