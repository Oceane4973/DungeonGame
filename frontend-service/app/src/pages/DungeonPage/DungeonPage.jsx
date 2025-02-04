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
    const [isJumping, setIsJumping] = useState(false);
    const [jumpHeight, setJumpHeight] = useState(0);
    const JUMP_MAX_HEIGHT = 2; // Hauteur maximale du saut en cellules
    const GRAVITY_SPEED = 100; // Vitesse de la gravité en ms
    const [direction, setDirection] = useState('right');

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

    // Gestion de la gravité
    useEffect(() => {
        if (!dungeonData?.dungeon || !hero) return;

        const applyGravity = () => {
            if (isJumping) return;

            const newPosition = { ...position };
            const cellBelow = newPosition.y + 1 < dungeonData.dungeon.length ? 
                dungeonData.dungeon[newPosition.y + 1][newPosition.x] : null;

            if (cellBelow && cellBelow !== 'WALL' && cellBelow !== 'GROUND_TOP' 
                && cellBelow !== 'GROUND_FULL_1' && cellBelow !== 'GROUND_FULL_2' 
                && cellBelow !== 'GROUND_FULL_3' && cellBelow !== 'GROUND_STONE_1' 
                && cellBelow !== 'GROUND_STONE_2') {
                setPosition(prev => ({ ...prev, y: prev.y + 1 }));
            }
        };

        const gravityInterval = setInterval(applyGravity, GRAVITY_SPEED);
        return () => clearInterval(gravityInterval);
    }, [position, dungeonData, hero, isJumping]);

    // Gestion du saut
    useEffect(() => {
        if (!isJumping || !dungeonData?.dungeon) return;

        const jumpInterval = setInterval(() => {
            if (jumpHeight >= JUMP_MAX_HEIGHT) {
                setIsJumping(false);
                setJumpHeight(0);
                return;
            }

            const newPosition = { ...position };
            const cellAbove = newPosition.y - 1 >= 0 ? 
                dungeonData.dungeon[newPosition.y - 1][newPosition.x] : null;

            if (cellAbove && cellAbove !== 'WALL') {
                setPosition(prev => ({ ...prev, y: prev.y - 1 }));
                setJumpHeight(prev => prev + 1);
            } else {
                setIsJumping(false);
                setJumpHeight(0);
            }
        }, 150); // Vitesse du saut

        return () => clearInterval(jumpInterval);
    }, [isJumping, jumpHeight, position, dungeonData]);

    // Modification du gestionnaire de touches
    useEffect(() => {
        const handleKeyPress = (e) => {
            if (!dungeonData?.dungeon || !hero) return;

            const newPosition = { ...position };
            switch (e.key.toLowerCase()) {
                case 'arrowup':
                case 'z':
                    if (position.y > 0) newPosition.y--;
                    setDirection('back');
                    break;
                case 'arrowdown':
                case 's':
                    if (position.y < dungeonData.dungeon.length - 1) newPosition.y++;
                    setDirection('front');
                    break;
                case 'arrowleft':
                case 'q':
                    if (position.x > 0) newPosition.x--;
                    setDirection('left');
                    break;
                case 'arrowright':
                case 'd':
                    if (position.x < dungeonData.dungeon[0].length - 1) newPosition.x++;
                    setDirection('right');
                    break;
                case ' ': // Barre d'espace
                    // Vérifier si le personnage est sur le sol
                    const cellBelow = position.y + 1 < dungeonData.dungeon.length ? 
                        dungeonData.dungeon[position.y + 1][position.x] : null;
                    if (cellBelow === 'WALL' || cellBelow === 'GROUND_TOP' 
                        || cellBelow === 'GROUND_FULL_1' || cellBelow === 'GROUND_FULL_2' 
                        || cellBelow === 'GROUND_FULL_3' || cellBelow === 'GROUND_STONE_1' 
                        || cellBelow === 'GROUND_STONE_2') {
                        setIsJumping(true);
                        return;
                    }
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
    }, [position, dungeonData, hero, isJumping]);

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
                            direction={direction}
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
                    <p>Utilisez les flèches du clavier ou ZQSD pour vous déplacer, et ESPACE pour sauter</p>
                </div>
            </div>
            <Footer />
        </>
    );
}

export default DungeonPage;
