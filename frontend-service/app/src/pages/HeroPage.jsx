import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";
import Header from "../components/header/Header";
import Footer from "../components/footer/Footer";

function HeroPage() {
    const { logout } = useContext(AuthContext);
    const navigate = useNavigate();

    return (
        <>
            <Header />
            <main className="game-container">
                <h2>Votre Héros</h2>
                <p>Gérez et améliorez votre héros ici.</p>
                
                <button onClick={() => navigate("/dungeon")}>Aller au Donjon</button>
                <button onClick={logout}>Se Déconnecter</button>
            </main>
            <Footer />
        </>
    );
}

export default HeroPage;
