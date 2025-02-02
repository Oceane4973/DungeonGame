const amqp = require('amqplib');

const RABBITMQ_URL = `amqp://${process.env.RABBITMQ_USER}:${process.env.RABBITMQ_PASSWORD}@${process.env.RABBITMQ_HOST}:${process.env.RABBITMQ_PORT}`;
const QUEUES = ['rabbitmq-users-to-frontend-gold', 'rabbitmq-heroes-to-frontend-health'];

async function connectRabbitMQ(io) {
    try {
        const connection = await amqp.connect(RABBITMQ_URL);
        const channel = await connection.createChannel();

        for (const queue of QUEUES) {
            await channel.assertQueue(queue, { durable: true });

            console.log(`[*] En attente de messages dans la queue: ${queue}`);

            channel.consume(queue, (msg) => {
                if (msg !== null) {
                    const messageContent = msg.content.toString();
                    console.log(`[x] Reçu de ${queue}: ${messageContent}`);

                    // Envoyer au frontend via WebSocket
                    io.emit(queue, messageContent);

                    channel.ack(msg);
                }
            });
        }
    } catch (error) {
        console.error("Erreur RabbitMQ:", error);
    }
}

module.exports = connectRabbitMQ;
