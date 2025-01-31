import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../contexts/AuthContext";
import Header from "../../components/header/Header";
import Footer from "../../components/footer/Footer";
import "./HeroeCreationPage.css";

function HeroeCreationPage() {
    const navigate = useNavigate();
    const { user } = useContext(AuthContext);
    const [heads, setHeads] = useState([]);
    const [bodies, setBodies] = useState([]);
    const [selectedHead, setSelectedHead] = useState(null);
    const [selectedBody, setSelectedBody] = useState(null);
    const [heroName, setHeroName] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        fetchHeadsAndBodies();
    }, []);

    const fetchHeadsAndBodies = async () => {
        try {
            const [headsResponse, bodiesResponse] = await Promise.all([
                fetch('http://localhost:8082/api/heroes/heads'),
                fetch('http://localhost:8082/api/heroes/bodies')
            ]);

            const headsData = await headsResponse.json();
            const bodiesData = await bodiesResponse.json();

            setHeads(headsData);
            setBodies(bodiesData);

            // Sélectionner le premier élément par défaut
            if (headsData.length > 0) setSelectedHead(headsData[0]);
            if (bodiesData.length > 0) setSelectedBody(bodiesData[0]);
        } catch (error) {
            setError("Erreur lors du chargement des sprites");
        }
    };

    const handleCreateHero = async (e) => {
        e.preventDefault();
        if (!selectedHead || !selectedBody || !heroName.trim()) {
            setError("Veuillez remplir tous les champs");
            return;
        }

        setLoading(true);
        try {
            const response = await fetch('http://localhost:8082/api/heroes/hero', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    userId: user.id,
                    name: heroName,
                    level: 1,
                    attack: 10,
                    healthPoints: 100,
                    headId: selectedHead.id,
                    bodyId: selectedBody.id
                })
            });

            if (response.ok) {
                navigate("/hero");
            } else {
                setError("Erreur lors de la création du héros");
            }
        } catch (error) {
            setError("Erreur lors de la création du héros");
        }
        setLoading(false);
    };

    return (
        <>
            <Header />
            <main className="game-container">
                <h1>Crée ton <span>Héros</span></h1>
                <p>Personnalise ton héros et lance-toi dans l'aventure.</p>

                <div className="creation-container">
                    <form onSubmit={handleCreateHero}>
                        {error && <div className="error-message">{error}</div>}
                        
                        <div className="form-group">
                            <label>Nom du héros</label>
                            <input
                                type="text"
                                value={heroName}
                                onChange={(e) => setHeroName(e.target.value)}
                                placeholder="Entrez le nom de votre héros"
                                required
                            />
                        </div>

                        <div className="sprites-selection">
                            <div className="sprite-section">
                                <h3>Choisissez une tête</h3>
                                <div className="sprite-grid">
                                    {heads.map((head) => (
                                        <div
                                            key={head.id}
                                            className={`sprite-item ${selectedHead?.id === head.id ? 'selected' : ''}`}
                                            onClick={() => setSelectedHead(head)}
                                        >
                                            <img src={head.sprites.front[0].url} alt="Head sprite" />
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="sprite-section">
                                <h3>Choisissez un corps</h3>
                                <div className="sprite-grid">
                                    {bodies.map((body) => (
                                        <div
                                            key={body.id}
                                            className={`sprite-item ${selectedBody?.id === body.id ? 'selected' : ''}`}
                                            onClick={() => setSelectedBody(body)}
                                        >
                                            <img src={body.sprites.front[0].url} alt="Body sprite" />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="preview-section">
                            <h3>Aperçu</h3>
                            <div className="preview-container">
                                {selectedHead && selectedBody && (
                                    <div className="preview-sprite">
                                        <img src={selectedBody.sprites.front[0].url} alt="Body preview" className="body-preview" />
                                        <img src={selectedHead.sprites.front[0].url} alt="Head preview" className="head-preview" />
                                    </div>
                                )}
                            </div>
                        </div>

                        <button type="submit" className="create-hero-btn" disabled={loading}>
                            {loading ? "Création en cours..." : "Créer le héros"}
                        </button>
                    </form>
                </div>
            </main>
            <Footer />
        </>
    );
}

export default HeroeCreationPage;
