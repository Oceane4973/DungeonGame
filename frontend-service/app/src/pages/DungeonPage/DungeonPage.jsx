import { useContext, useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { AuthContext } from "../../contexts/AuthContext";
import Header from "../../components/header/Header";
import Footer from "../../components/footer/Footer";
import { dungeonService } from "../../services/dungeonService";
import { heroeService } from "../../services/heroeService";
import DungeonCanva from "../../components/dungeonCanva/dungeonCanva";
import './DungeonPage.css';

function DungeonPage() {
    const { logout } = useContext(AuthContext);
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    
    const [dungeonData, setDungeonData] = useState(null);
    const [imageCache, setImageCache] = useState({});
    const [hero, setHero] = useState(null);
    const [position, setPosition] = useState({ x: 0, y: 0 });

    const fetchDungeon = async () => {
        try {
            const data = await dungeonService.getDungeon();
            setDungeonData(data);
            preloadImages(data.assets);
        } catch (error) {
            console.error('Erreur lors de la récupération du donjon:', error);
        }
    };

    const preloadImages = (assets) => {
        const cache = {};
        const assetKeys = Object.keys(assets);
        let loadedCount = 0;

        assetKeys.forEach((key) => {
            const img = new Image();
            img.src = assets[key];
            img.onload = () => {
                cache[key] = img;
                loadedCount++;

                if (loadedCount === assetKeys.length) {
                    setImageCache(cache);
                }
            };
            img.onerror = () => {
                console.error(`Erreur de chargement de l'image : ${assets[key]}`);
            };
        });
    };

    const fetchHero = async () => {
        const heroId = searchParams.get('heroId');
        if (!heroId) {
            navigate('/hero');
            return;
        }

        try {
            const heroData = await heroeService.getHeroById(heroId);
            setHero(heroData);
            // Positionner le héros au centre de la première ligne
            setPosition({ x: Math.floor(dungeonData?.dungeon[0]?.length / 2) || 0, y: 0 });
        } catch (error) {
            console.error('Erreur lors de la récupération du héros:', error);
            navigate('/hero');
        }
    };

    useEffect(() => {
        fetchDungeon();
    }, []);

    useEffect(() => {
        if (dungeonData) {
            fetchHero();
        }
    }, [dungeonData]);

    // Ajout de la gestion des déplacements
    useEffect(() => {
        const handleKeyPress = (e) => {
            if (!dungeonData?.dungeon || !hero) return;

            const newPosition = { ...position };
            switch (e.key) {
                case 'ArrowUp':
                    if (position.y > 0) newPosition.y--;
                    break;
                case 'ArrowDown':
                    if (position.y < dungeonData.dungeon.length - 1) newPosition.y++;
                    break;
                case 'ArrowLeft':
                    if (position.x > 0) newPosition.x--;
                    break;
                case 'ArrowRight':
                    if (position.x < dungeonData.dungeon[0].length - 1) newPosition.x++;
                    break;
                default:
                    return;
            }

            // Vérifier si la nouvelle position est valide (pas un mur)
            const nextCell = dungeonData.dungeon[newPosition.y][newPosition.x];
            if (nextCell !== 'WALL') {
                setPosition(newPosition);
            }
        };

        window.addEventListener('keydown', handleKeyPress);
        return () => window.removeEventListener('keydown', handleKeyPress);
    }, [position, dungeonData, hero]);

    const renderBackgroundLayers = () => {
        if (!dungeonData?.background?.layers) return null;

        return Object.values(dungeonData.background.layers).map((layerSrc, index) => (
            <img
                key={index}
                src={layerSrc}
                alt={`Layer ${index + 1}`}
                className="background-layer"
                style={{ zIndex: index - 10 }}
            />
        ));
    };

    return (
        <>
            <Header gaming={true} />
            <div className="main-container">
                {dungeonData && (
                    <>
                        {renderBackgroundLayers()}
                        <DungeonCanva 
                            dungeonData={dungeonData} 
                            imageCache={imageCache}
                            hero={hero}
                            position={position}
                        />
                    </>
                )}
            </div>

            <div className="dongeon-game-container">
                <div className="dongeon-header-card">
                    <h1>Donjon</h1>
                    {hero && (
                        <div className="hero-stats">
                            <p>Niveau: {hero.level} | PV: {hero.healthPoints} | ATK: {hero.attack}</p>
                        </div>
                    )}
                    <p>Utilisez les flèches du clavier pour vous déplacer</p>
                </div>
            </div>
            <Footer />
        </>
    );
}

export default DungeonPage;
