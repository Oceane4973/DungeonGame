import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, AuthContext } from "./contexts/AuthContext";
import SignupPage from "./pages/SignupPage/SignupPage";
import { useContext } from "react";
import HeroeSelectionPage from "./pages/HeroePage/HeroeSelectionPage";
import HeroeCreationPage from "./pages/HeroePage/HeroeCreationPage";
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
  return isLoggedIn ? <Navigate to="/login" /> : <Navigate to="/login" />;
}

function App() {
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