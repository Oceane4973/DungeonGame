import React, { createContext, useEffect, useState } from 'react';
import {io} from "socket.io-client";

export const WebSocketContext = createContext();

export function WebSocketProvider({ children }) {
    const [heroesHealth, setHeroesHealth] = useState(null);
    const [usersGold, setUsersGold] = useState(null);

    useEffect(() => {
        const socket = io(process.env.REACT_APP_BACKEND_SOCKET_URL, {
            withCredentials: true,
            transports: ["websocket"]
        });

        console.log("Ecoute des messages RabbitMQ");

        socket.on("rabbitmq-users-to-frontend-gold", (message) => {
            console.log("Message reçu de rabbitmq-users-to-frontend-gold:", message);
            setUsersGold(message);
        });

        socket.on("rabbitmq-heroes-to-frontend-health", (message) => {
            console.log("Message reçu de rabbitmq-heroes-to-frontend-health:", message);
            setHeroesHealth(message);
        });

        return () => {
            socket.off("rabbitmq-users-to-frontend-gold");
            socket.off("rabbitmq-heroes-to-frontend-health");
        };
    }, []);

    return (
        <WebSocketContext.Provider value={{ heroesHealth, usersGold }}>
            {children}
        </WebSocketContext.Provider>
    );
}
