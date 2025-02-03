import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../contexts/AuthContext";
import Header from "../../components/header/Header";
import Footer from "../../components/footer/Footer";
import "./HeroeCreationPage.css";
import { heroeService } from '../../services/heroeService';

const HeroeCreationPage = () => {
    const [heads, setHeads] = useState([]);
    const [bodies, setBodies] = useState([]);
    const [selectedHead, setSelectedHead] = useState(null);
    const [selectedBody, setSelectedBody] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const { user } = useContext(AuthContext);

    useEffect(() => {
        if (!user) {
            navigate('/login');
            return;
        }
    }, [user, navigate]);

    useEffect(() => {
        const fetchSprites = async () => {
            try {
                const [headsData, bodiesData] = await Promise.all([
                    heroeService.getHeads(),
                    heroeService.getBodies()
                ]);

                setHeads(headsData);
                setBodies(bodiesData);
            } catch (err) {
                setError(err.message);
            }
        };

        fetchSprites();
    }, []);

    const generateRandomHeroName = () => {
        const prefixes = ['Brave', 'Vaillant', 'Mystérieux', 'Légendaire', 'Intrépide', 'Redoutable', 'Sage'];
        const suffixes = ['Guerrier', 'Mage', 'Paladin', 'Archer', 'Chevalier', 'Aventurier', 'Héros'];
        
        const randomPrefix = prefixes[Math.floor(Math.random() * prefixes.length)];
        const randomSuffix = suffixes[Math.floor(Math.random() * suffixes.length)];
        
        return `${randomPrefix} ${randomSuffix}`;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!user || !user.id) {
            setError('Vous devez être connecté pour créer un héros');
            return;
        }

        if (!selectedHead || !selectedBody) {
            setError('Veuillez sélectionner une tête et un corps');
            return;
        }

        setLoading(true);
        try {
            const heroData = {
                headId: selectedHead.id,
                bodyId: selectedBody.id,
                name: generateRandomHeroName(),
                level: Math.floor(Math.random() * 5) + 1,
                attack: Math.floor(Math.random() * 15) + 5,
                healthPoints: Math.floor(Math.random() * 50) + 75,
                userId: user.id
            };
            
            const hero = await heroeService.createHero(heroData);
            navigate('/hero');
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const renderSprite = (item) => {
        // Utiliser les sprites right puisque front est vide
        const sprites = item.sprites?.right || [];
        if (sprites.length === 0) {
            return null; // Ne rien afficher si pas de sprite
        }
        
        // Prendre le premier sprite de la liste et afficher son image
        return (
            <img 
                src={sprites[0].url} 
                alt="Character sprite" 
                style={{
                    width: '48px',
                    height: '48px',
                    imageRendering: 'pixelated'  // Pour garder l'aspect pixel art net
                }}
            />
        );
    };

    if (error) {
        return <div className="error-message">{error}</div>;
    }

    return (
        <>
            <Header />
            <main className="heroe-creation-page">
                <div className="container">
                    <h2>Création d'un nouveau héro</h2>
                    <form onSubmit={handleSubmit}>
                        <div className="sprite-selection">
                            <div className="sprite-section">
                                <h3>Choisissez une tête</h3>
                                <div className="sprite-grid">
                                    {heads.map((head) => (
                                        <div
                                            key={head.id}
                                            className={`sprite-item ${selectedHead?.id === head.id ? 'selected' : ''}`}
                                            onClick={() => setSelectedHead(head)}
                                        >
                                            {renderSprite(head)}
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
                                            {renderSprite(body)}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="preview-section">
                            <h3>Aperçu</h3>
                            <div className="preview-container">
                                {selectedHead && selectedBody ? (
                                    <div className="preview-sprite">
                                        {renderSprite(selectedBody)}
                                        {renderSprite(selectedHead)}
                                    </div>
                                ) : (
                                    <p className="preview-hint">Sélectionnez une tête et un corps pour voir l'aperçu de votre héro</p>
                                )}
                            </div>
                        </div>

                        <button type="submit" className="create-hero-btn" disabled={loading || !selectedHead || !selectedBody}>
                            {loading ? "Création en cours..." : "Créer mon héro"}
                        </button>
                    </form>
                </div>
            </main>
            <Footer />
        </>
    );
};

export default HeroeCreationPage;
