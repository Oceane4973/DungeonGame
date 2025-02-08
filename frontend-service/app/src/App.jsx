import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, AuthContext } from "./contexts/AuthContext";
import { WebSocketProvider } from './contexts/WebSocketContext';
import { useContext } from "react";
import SignupPage from "./pages/SignupPage/SignupPage";
import HeroSelectionPage from "./pages/HeroPage/HeroSelectionPage";
import HeroCreationPage from "./pages/HeroPage/HeroCreationPage";
import DungeonPage from "./pages/DungeonPage/DungeonPage";
import LoginPage from "./pages/LoginPage/LoginPage";
import UserPage from './pages/UserPage/UserPage';
import { ThemeProvider } from "./contexts/ThemeContext";
import './assets/css/global.css';

function PrivateRoute({ children }) {
    const { isLoggedIn } = useContext(AuthContext);
    return isLoggedIn ? children : <Navigate to="/login" />;
}

function RedirectRoute() {
    const { isLoggedIn } = useContext(AuthContext);
    return isLoggedIn ? <Navigate to="/hero" /> : <Navigate to="/login" />;
}

function App() {
  return (
      <Router>
          <AuthProvider>
              <ThemeProvider>
                  <WebSocketProvider>
                      <Routes>
                          <Route path="/" element={<RedirectRoute />} />
                          <Route path="/login" element={<LoginPage />} />
                          <Route path="/signup" element={<SignupPage />} />
                          <Route path="/hero" element={<PrivateRoute><HeroSelectionPage /></PrivateRoute>} />
                          <Route path="/createHero" element={<PrivateRoute><HeroCreationPage /></PrivateRoute>} />
                          <Route path="/dungeon" element={<PrivateRoute><DungeonPage /></PrivateRoute>} />
                          <Route path="/profile" element={<PrivateRoute><UserPage /></PrivateRoute>} />
                      </Routes>
                  </WebSocketProvider>
              </ThemeProvider>
          </AuthProvider>
      </Router>
  );
}

export default App;
