import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, AuthContext } from "./contexts/AuthContext";
import { useContext, useEffect, useState } from "react";
import SignupPage from "./pages/SignupPage/SignupPage";
import { useContext } from "react";
import HeroSelectionPage from "./pages/HeroePage/HeroeSelectionPage";
import HeroCreationPage from "./pages/HeroePage/HeroeCreationPage";
import DungeonPage from "./pages/DungeonPage/DungeonPage";
import LoginPage from "./pages/LoginPage/LoginPage";
import UserPage from './pages/UserPage/UserPage';
import { ThemeProvider } from "./contexts/ThemeContext";
import {io} from "socket.io-client";
import './assets/css/global.css';

const socket = io(process.env.REACT_APP_BACKEND_SOCKET_URL);

function PrivateRoute({ children }) {
    const { isLoggedIn } = useContext(AuthContext);
    return isLoggedIn ? children : <Navigate to="/login" />;
}

function RedirectRoute() {
    const { isLoggedIn } = useContext(AuthContext);
    return isLoggedIn ? <Navigate to="/hero" /> : <Navigate to="/login" />;
}

function App() {
    const [messages, setMessages] = useState([]);

    useEffect(() => {
        // Écoute des messages des différentes queues RabbitMQ
        socket.on("rabbitmq-users-to-front-gold", (message) => {
            console.log("Message reçu de rabbitmq-users-to-front-gold:", message);
            setMessages((prev) => [...prev, { queue: "rabbitmq-users-to-front-gold", message }]);
        });

        socket.on("rabbitmq-heroes-to-front-health", (message) => {
            console.log("Message reçu de rabbitmq-heroes-to-front-health:", message);
            setMessages((prev) => [...prev, { queue: "rabbitmq-heroes-to-front-health", message }]);
        });

        return () => {
            socket.off("rabbitmq-users-to-front-gold");
            socket.off("rabbitmq-heroes-to-front-health");
        };
    }, []);

  return (
      <Router>
          <AuthProvider>
              <ThemeProvider>
                  <Routes>
                      <Route path="/" element={<RedirectRoute />} />
                      <Route path="/login" element={<LoginPage />} />
                      <Route path="/signup" element={<SignupPage />} />
                      <Route path="/hero" element={<PrivateRoute><HeroeSelectionPage /></PrivateRoute>} />
                      <Route path="/createHero" element={<PrivateRoute><HeroeCreationPage /></PrivateRoute>} />
                      <Route path="/dungeon" element={<PrivateRoute><DungeonPage /></PrivateRoute>} />
                      <Route path="/profile" element={<PrivateRoute><UserPage /></PrivateRoute>} />
                  </Routes>
              </ThemeProvider>
          </AuthProvider>
      </Router>
  );
}

export default App;
