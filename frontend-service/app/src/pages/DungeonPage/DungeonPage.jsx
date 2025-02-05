import { useContext, useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { AuthContext } from "../../contexts/AuthContext";
import Header from "../../components/header/Header";
import Footer from "../../components/footer/Footer";
import { dungeonService } from "../../services/dungeonService";
import { heroeService } from "../../services/heroeService";
import DungeonCanva from "../../components/dungeonCanva/dungeonCanva";
import { monsterService } from "../../services/monsterService";
import ReactConfetti from 'react-confetti';
import Monster from "../../models/Monster";
import Hero from "../../models/Hero";
import './DungeonPage.css';

function DungeonPage() {
    const { logout } = useContext(AuthContext);
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    const [dungeonData, setDungeonData] = useState(null);
    const [imageCache, setImageCache] = useState({});

    const [hero, setHero] = useState(null);
    const [monsters, setMonsters] = useState([]);

    const [showWelcome, setShowWelcome] = useState(true);
    const [countdown, setCountdown] = useState(5);
    const [showVictory, setShowVictory] = useState(false);

    // Faudrait le mettre dans un component => KerrianBOY a la giga flemme
    const isSolidBlock = (cell) => {
        return cell === 'WALL' ||
            cell === 'GROUND_TOP' ||
            cell === 'GROUND_FULL_1' ||
            cell === 'GROUND_FULL_2' ||
            cell === 'GROUND_FULL_3' ||
            cell === 'GROUND_STONE_1' ||
            cell === 'GROUND_STONE_2' ||
            cell === 'GROUND_TOP_LEFT' ||
            cell === 'GROUND_TOP_RIGHT' ||
            cell === 'GROUND_LEFT' ||
            cell === 'GROUND_RIGHT' ||
            cell === 'GROUND_BOTTOM_LEFT' ||
            cell === 'GROUND_BOTTOM' ||
            cell === 'GROUND_BOTTOM_RIGHT' ||
            /*cell === 'TREE_1' ||
            cell === 'TREE_2' ||
            cell === 'ROCK_1' ||
            cell === 'ROCK_2' ||*/
            cell === 'STONE_BARRIER_1' ||
            cell === 'STONE_BARRIER_2' ||
            cell === 'STONE_BARRIER_3' ||
            cell === 'BARRIER_1';
    };

    const fetchDungeon = async () => {
        try {
            const data = await dungeonService.getDungeon();

            preloadImages(data.assets);
            setDungeonData(data);
        } catch (error) {
            console.error('Erreur lors de la récupération du donjon:', error);
        }
    };

    const fetchMonsters = async () => {
        try {
            const monstersData = await monsterService.getMonster();
            const positionedMonsters = monstersData.map(monster => ({
                ...monster,
                x: Math.floor(Math.random() * 10),
                y: Math.floor(Math.random() * 5)
            }));

            const monstersList = positionedMonsters.map(monster => new Monster(
                monster.pv,
                monster.level,
                monster.attack,
                monster.x,
                monster.y,
                'right',
                [monster.sprites[0]],
                dungeonData,
                isSolidBlock)
            );
            setMonsters(monstersList);
        } catch (error) {
            console.error('Erreur lors de la récupération des monstres:', error);
        }
    };

    const fetchHero = async () => {
        const heroId = searchParams.get('heroId');
        if (!heroId) {
            navigate('/hero');
            return;
        }

        try {
            const heroData = await heroeService.getHeroById(heroId);


            let startX = 0;
            let startY = 0;

            dungeonData?.dungeon.forEach((row, y) => {
                row.forEach((cell, x) => {
                    if (cell === 'START_DUNGEON') {
                        startX = x;
                        startY = y;
                    }
                });
            });
            heroData.position = { x: startX, y: startY };

            console.log(heroData)

            const hero = new Hero(
                heroData.healthPoints,
                heroData.level,
                heroData.attack,
                heroData.position.x,
                heroData.position.y,
                'right',
                [heroData.sprites.right[0]],
                dungeonData,
                isSolidBlock
            );

            setHero(hero);
        } catch (error) {
            console.error('Erreur lors de la récupération du héros:', error);
            navigate('/hero');
        }
    };

    const preloadImages = (assets) => {
        const cache = {};
        Object.keys(assets).forEach(key => {
            const img = new Image();
            img.src = assets[key];
            img.onload = () => (cache[key] = img);
        });
        setImageCache(cache);
    };

    useEffect(() => {
        fetchDungeon();
    }, []);

    useEffect(() => {
        if (dungeonData) {
            fetchHero();
            fetchMonsters();
        }
    }, [dungeonData]);

    useEffect(() => {
        if (showWelcome && countdown >= 0) {
            const timer = setTimeout(() => {
                if (countdown === 0) {
                    setShowWelcome(false);
                }
                setCountdown(countdown - 1);
            }, 1000);

            return () => clearTimeout(timer);
        }
    }, [countdown, showWelcome]);

    useEffect(() => {
        if (!dungeonData?.dungeon || !hero?.position) return;

        const currentCell = dungeonData.dungeon[hero.position.y]?.[hero.position.x] ?? null;

        if (currentCell === 'END_DUNGEON') {
            console.log('Fin du donjon atteinte !');

            setTimeout(() => {
                hero.reinitialize();
                setShowVictory(true);
            }, 100);
        }
    }, [hero?.position.x, hero?.position.y, dungeonData]);

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
            {showWelcome && (
                <div className="welcome-popup">
                    <div className="welcome-content">
                        <h2>Bienvenue au DungeonGame</h2>
                        <p>Combattez les monstres pour arriver au trésor. Bonne chance !</p>
                        <div className="countdown">
                            {countdown > 0 ? countdown : countdown === 0 ? "GO !!!" : ""}
                        </div>
                    </div>
                </div>
            )}

            {showVictory && (
                <>
                    <div className="victory-popup">
                        <ReactConfetti
                            width={window.innerWidth}
                            height={window.innerHeight}
                            recycle={true}
                            numberOfPieces={200}
                            style={{ position: 'fixed', top: 0, left: 0, zIndex: 1000 }}
                        />
                        <div className="victory-content">
                            <div className="treasure-icon">🏆</div>
                            <h2>Vous avez gagné la partie !</h2>
                            <button onClick={() => navigate('/hero')}>
                                Retour au menu
                            </button>
                        </div>
                    </div>
                </>
            )}

            <div className="main-container">
                {dungeonData && hero && monsters && (
                    <>
                        {renderBackgroundLayers()}
                        <DungeonCanva
                            dungeonData={dungeonData}
                            imageCache={imageCache}
                            hero={hero}
                            monsters={monsters}
                            isSolidBlock={isSolidBlock}
                        />
                    </>
                )}
            </div>

            <div className="dongeon-game-container">
                <div className="dongeon-header-card">
                    <h1>Donjon</h1>
                    {hero && (
                        <div className="hero-stats">
                            <p>Niveau: {hero.level} | PV: {hero.pv} | ATK: {hero.attack}</p>
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
