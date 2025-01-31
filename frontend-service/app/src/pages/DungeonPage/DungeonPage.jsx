import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../contexts/AuthContext";
import Header from "../../components/header/Header";
import Footer from "../../components/footer/Footer";

function DungeonPage() {
    const { logout } = useContext(AuthContext);
    const navigate = useNavigate();

    return (
        <>
            <Header />
            <main className="game-container">
                <h2>Donjon</h2>
                <p>Explorez les donjons et combattez les monstres.</p>

                <button onClick={() => navigate("/hero")}>Retour au Héros</button>
                <button onClick={logout}>Se Déconnecter</button>
            </main>
            <Footer />
        </>
    );
}

export default DungeonPage;