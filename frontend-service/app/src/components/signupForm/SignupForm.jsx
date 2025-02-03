import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import UserService from "../../services/userService";
import "./SignupForm.css";

function SignupForm() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        username: "",
        password: "",
        confirmPassword: "",
    });
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        const { username, password, confirmPassword } = formData;

        if (!username || !password || !confirmPassword) {
            setError("Veuillez remplir tous les champs.");
            setLoading(false);
            return;
        }

        if (password !== confirmPassword) {
            setError("Les mots de passe ne correspondent pas.");
            setLoading(false);
            return;
        }

        try {
            await UserService.signup(username, password);
            alert("Inscription réussie ! Redirection vers la page de connexion...");
            navigate("/login"); // Redirige vers la page de connexion après l'inscription
        } catch (error) {
            setError(error.message || "Erreur lors de l'inscription.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-container">
            <form className="login-form" onSubmit={handleSubmit}>
                <h2>Inscription</h2>
                {error && <div className="error-message">{error}</div>}
                <div className="form-group">
                    <input
                        type="text"
                        name="username"
                        placeholder="Nom d'utilisateur"
                        value={formData.username}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <input
                        type="password"
                        name="password"
                        placeholder="Mot de passe"
                        value={formData.password}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <input
                        type="password"
                        name="confirmPassword"
                        placeholder="Confirmer le mot de passe"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        required
                    />
                </div>
                <button type="submit" disabled={loading}>
                    {loading ? "Inscription..." : "S'inscrire"}
                </button>
                <Link to="/login" className="link-button">
                    Déjà inscrit ? Se connecter
                </Link>
            </form>
        </div>
    );
}

export default SignupForm;
