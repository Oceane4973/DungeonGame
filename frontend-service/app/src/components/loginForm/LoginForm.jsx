import { useState, useContext, useEffect } from "react";
import { AuthContext } from "../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import "./LoginForm.css";

function LoginForm() {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const [credentials, setCredentials] = useState({ username: "", password: "" });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Récupérer les credentials sauvegardés au chargement du composant
    const savedCredentials = localStorage.getItem('savedCredentials');
    if (savedCredentials) {
      setCredentials(JSON.parse(savedCredentials));
    }
  }, []);

  const handleChange = (e) => {
    const newCredentials = { ...credentials, [e.target.name]: e.target.value };
    setCredentials(newCredentials);
    // Sauvegarder les credentials à chaque modification
    localStorage.setItem('savedCredentials', JSON.stringify(newCredentials));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const success = await login(credentials.username, credentials.password);
    setLoading(false);

    if (success) {
      navigate("/hero");
    }
  };

  return (
    <div className="login-container">
      <form className="login-form" onSubmit={handleSubmit}>
        <h2>Connexion</h2>
        <div className="form-group">
          <input
            type="text"
            name="username"
            placeholder="Nom d'utilisateur"
            value={credentials.username}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <input
            type="password"
            name="password"
            placeholder="Mot de passe"
            value={credentials.password}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit" disabled={loading}>
          {loading ? "Connexion..." : "Se connecter"}
        </button>
        <a href="/signup" className="link-button">Pas encore inscrit ? S'inscrire</a>
      </form>
    </div>
  );
}

export default LoginForm;