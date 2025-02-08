import { useContext, useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { AuthContext } from "../../contexts/AuthContext";
import { WebSocketContext } from '../../contexts/WebSocketContext';
import Header from "../../components/header/Header";
import Footer from "../../components/footer/Footer";
import { dungeonService } from "../../services/dungeonService";
import { heroService } from "../../services/heroService";
import DungeonCanva from "../../components/dungeonCanva/dungeonCanva";
import { monsterService } from "../../services/monsterService";
import ReactConfetti from 'react-confetti';
import Monster from "../../models/Monster";
import Hero from "../../models/Hero";
import './DungeonPage.css';

function DungeonPage() {
    const { heroesHealth } = useContext(WebSocketContext);

    const { logout, user } = useContext(AuthContext);
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    const [dungeonData, setDungeonData] = useState(null);
    const [imageCache, setImageCache] = useState({});

    const [hero, setHero] = useState(null);
    const [monsters, setMonsters] = useState([]);

    const [showWelcome, setShowWelcome] = useState(true);
    const [countdown, setCountdown] = useState(3);
    const [showVictory, setShowVictory] = useState(false);
    const [showGameOver, setShowGameOver] = useState(false);

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

    let isDungeonInitialized = false; // Verrou global pour empêcher les doubles appels

    const initializeDungeon = async () => {
        if (isDungeonInitialized) {
            console.log("Initialisation déjà en cours, opération ignorée.");
            return;
        }

        isDungeonInitialized = true;

        console.log("Fetch dungeon");
        console.log(dungeonData || null);
        console.log(hero || null);
        console.log(monsters || []);

        if (dungeonData != null && hero != null && monsters.length > 0) {
            console.log("Modification des states avortées");
            return;
        }

        console.log("Modification des states en cours...");

        try {
            const dungeon = await dungeonService.getDungeon();
            setDungeonData(dungeon);
            preloadImages(dungeon.assets);

            const fetchedHero = await fetchHero(dungeon);
            const fetchedMonsters = await fetchMonsters(dungeon);

            fetchedHero.dungeonData = dungeon;
            fetchedMonsters.forEach(monster => (monster.dungeonData = dungeon));

            setHero(fetchedHero);
            setMonsters(fetchedMonsters);

            fetchedMonsters.forEach(monster => monster.startMoving());

        } catch (error) {
            console.error("Erreur lors de l'initialisation du donjon:", error);
        } finally {
            isDungeonInitialized = false;

            setTimeout(() => {
                setShowVictory(false);
            }, 1400);
        }
    };


    const fetchMonsters = async (dungeon) => {
        try {
            const monstersData = await monsterService.getMonster();
            return monstersData.map((monster, index) => new Monster(
                monster.pv, monster.level, monster.attack,
                Math.floor(Math.random() * 10), Math.floor(Math.random() * 5),
                'right', [monster.sprites[0]],
                dungeon, isSolidBlock,
                `monster-${index}`
            ));
        } catch (error) {
            console.error('Erreur lors de la récupération des monstres:', error);
        }
    };

    const getDungeonStart = () => {
        dungeonData?.dungeon.forEach((row, y) => {
            row.forEach((cell, x) => {
                if (cell === 'START_DUNGEON') {
                    return { x, y };
                }
            });
        });
        return { x: 0, y: 0 };
    }

    const fetchHero = async (dungeon) => {
        const heroId = searchParams.get('heroId');
        if (!heroId) {
            navigate('/hero');
            return;
        }
        try {
            const heroData = await heroService.getHeroById(heroId);
            heroData.position = getDungeonStart(dungeon);
            return new Hero(heroData.id, heroData.healthPoints, heroData.level, heroData.attack,
                heroData.position.x, heroData.position.y,
                'right', [heroData.sprites.right[0]],
                dungeon, isSolidBlock, onDungeonCompleteHandler);
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
        initializeDungeon();
    }, []);

    useEffect(() => {
        if (heroesHealth) {
            setHero((prevHero) => {
                if (!prevHero) return null;

                prevHero.pv = parseInt(heroesHealth, 10);
                return { ...prevHero };
            });
        }
    }, [heroesHealth]);

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

    const onDungeonCompleteHandler = () => {
        setShowVictory(true);
        setHero(null);
        monsters.forEach(monster => {
            monster.destroy();
        })
        setMonsters([]);
        setDungeonData(null);
        setTimeout(() => {
            initializeDungeon();
        }, 100);
    }

    useEffect(() => {
        monsters.forEach(monster => monster.startMoving());

        return () => {
            monsters.forEach(monster => {
                if (typeof monster.stopMoving === "function") {
                    monster.stopMoving();
                }
            });
        };
    }, [monsters]);

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

    const handleRetry = () => {
        console.log("Retry clicked!");
        window.location.reload();
    };

    const handleQuit = () => {
        console.log("Quit clicked!");
        window.location.href = '/hero';
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
                        {/* <div className="victory-content">
                            <div className="treasure-icon">🏆</div>
                            <h2>Vous avez gagné la partie !</h2>
                            <button onClick={() => navigate('/hero')}>
                                Retour au menu
                            </button>
                        </div> */}
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
                            username={user.username}
                            onGameOver={() => setShowGameOver(true)}
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

            {showGameOver && (
                <div className="game-over-overlay">
                    <div className="game-over-popup">
                        <h1 className="game-over-title">Game Over</h1>
                        <p>Votre héros est mort au combat !</p>
                        <div className="game-over-buttons">
                            <button
                                className="game-over-button retry-button"
                                onClick={handleRetry}
                                type="button"
                            >
                                Rejouer
                            </button>
                            <button
                                className="game-over-button quit-button"
                                onClick={handleQuit}
                                type="button"
                            >
                                Quitter
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <Footer />
        </>
    );
}

export default DungeonPage;
