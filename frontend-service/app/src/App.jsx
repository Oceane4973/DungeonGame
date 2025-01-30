import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, AuthContext } from "./contexts/AuthContext";
import SignUpPage from "./pages/SignUpPage";
import { useContext } from "react";
import HeroPage from "./pages/HeroPage";
import DungeonPage from "./pages/DungeonPage";
import LoginPage from "./pages/loginPage";

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
              <Routes>
                  <Route path="/" element={<RedirectRoute />} />
                  <Route path="/login" element={<LoginPage />} />
                  <Route path="/signup" element={<SignUpPage />} /> {/* Nouvelle route */}
                  <Route path="/hero" element={<PrivateRoute><HeroPage /></PrivateRoute>} />
                  <Route path="/dungeon" element={<PrivateRoute><DungeonPage /></PrivateRoute>} />
              </Routes>
          </AuthProvider>
      </Router>
  );
}

export default App;