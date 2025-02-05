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
import './DungeonPage.css';

function DungeonPage() {
    const { logout } = useContext(AuthContext);
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    const [dungeonData, setDungeonData] = useState(null);
    const [imageCache, setImageCache] = useState({});

    const [hero, setHero] = useState(null);
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [direction, setDirection] = useState('right');

    const [monster, setMonster] = useState(null);
    const [monsterPosition, setMonsterPosition] = useState({ x: 5, y: 0 }); // Position initiale au milieu
    const [monsterDirection, setMonsterDirection] = useState('left'); // Direction initiale

    const [isJumping, setIsJumping] = useState(false);
    const [jumpHeight, setJumpHeight] = useState(0);
    const [jumpVelocity, setJumpVelocity] = useState(0);
    const [canDoubleJump, setCanDoubleJump] = useState(true);
    const [isDoubleJumping, setIsDoubleJumping] = useState(false);
    const [showWelcome, setShowWelcome] = useState(true);
    const [countdown, setCountdown] = useState(5);
    const [showVictory, setShowVictory] = useState(false);

    const JUMP_MAX_HEIGHT = 1;
    const DOUBLE_JUMP_HEIGHT = 1;
    const JUMP_SPEED = 30;
    const GRAVITY_SPEED = 120;
    const JUMP_FORCE = 0.5;
    const DOUBLE_JUMP_FORCE = 0.5;

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
            setDungeonData(data);
            preloadImages(data.assets);
        } catch (error) {
            console.error('Erreur lors de la récupération du donjon:', error);
        }
    };

    const fetchMonster = async () => {
        try {
            const [monsterData] = await monsterService.getMonster();
            setMonster(monsterData);
        } catch (error) {
            console.error('Erreur lors de la récupération du monstre:', error);
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
            setHero(heroData);

            let startX = 0;
            let startY = 0;

            dungeonData.dungeon.forEach((row, y) => {
                row.forEach((cell, x) => {
                    if (cell === 'START_DUNGEON') {
                        startX = x;
                        startY = y;
                    }
                });
            });

            setPosition({ x: startX, y: startY });
        } catch (error) {
            console.error('Erreur lors de la récupération du héros:', error);
            navigate('/hero');
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

    useEffect(() => {
        fetchDungeon();
    }, []);

    useEffect(() => {
        if (dungeonData) {
            fetchMonster();
            fetchHero();
        }
    }, [dungeonData]);

    useEffect(() => {
        if (!dungeonData?.dungeon || !hero) return;

        const applyGravity = () => {
            if (isJumping) return;

            const newPosition = { ...position };
            const cellBelow = newPosition.y + 1 < dungeonData.dungeon.length ?
                dungeonData.dungeon[newPosition.y + 1][newPosition.x] : null;

            if (cellBelow && !isSolidBlock(cellBelow)) {
                setPosition(prev => ({ ...prev, y: prev.y + 1 }));
                if (!canDoubleJump) {
                    setCanDoubleJump(true);
                }
            } else {
                if (!canDoubleJump) {
                    setCanDoubleJump(true);
                }
            }
        };

        const gravityInterval = setInterval(applyGravity, GRAVITY_SPEED);
        return () => clearInterval(gravityInterval);
    }, [position, dungeonData, hero, isJumping, canDoubleJump]);

    useEffect(() => {
        if (!dungeonData?.dungeon || !monster) return;

        const moveMonster = () => {
            const { x, y } = monsterPosition;
            const directionOffset = monsterDirection === 'left' ? -1 : 1;

            const nextX = x + directionOffset;
            const isNextCellSolid = dungeonData.dungeon[y][nextX] && isSolidBlock(dungeonData.dungeon[y + 1][nextX]);

            if (isNextCellSolid) {
                setMonsterPosition({ x: nextX, y });
            } else {
                setMonsterDirection(monsterDirection === 'left' ? 'right' : 'left'); // Change la direction
            }
        };

        const monsterInterval = setInterval(moveMonster, 1000); // Déplacement toutes les secondes
        return () => clearInterval(monsterInterval);
    }, [monster, monsterPosition, monsterDirection, dungeonData]);

    useEffect(() => {
        if (!isJumping || !dungeonData?.dungeon) return;

        const jumpInterval = setInterval(() => {
            if (jumpHeight >= JUMP_MAX_HEIGHT) {
                if (canDoubleJump && !isDoubleJumping) {
                    // Permet le double saut
                    setJumpHeight(0);
                    setIsDoubleJumping(true);
                    setCanDoubleJump(false);
                } else {
                    // Fin du saut
                    setIsJumping(false);
                    setJumpHeight(0);
                    setIsDoubleJumping(false);
                }
                return;
            }

            const newPosition = { ...position };
            const cellAbove = newPosition.y - 1 >= 0 ?
                dungeonData.dungeon[newPosition.y - 1][newPosition.x] : null;

            if (cellAbove && !isSolidBlock(cellAbove)) {
                setPosition(prev => ({ ...prev, y: prev.y - 1 }));
                setJumpHeight(prev => prev + 1);
            } else {
                setIsJumping(false);
                setJumpHeight(0);
                setIsDoubleJumping(false);
            }
        }, JUMP_SPEED);

        return () => clearInterval(jumpInterval);
    }, [isJumping, jumpHeight, position, dungeonData, canDoubleJump, isDoubleJumping]);

    // Reset le double saut quand on touche le sol
    useEffect(() => {
        if (!isJumping) {
            setCanDoubleJump(true);
            setIsDoubleJumping(false);
        }
    }, [isJumping]);

    useEffect(() => {
        const handleKeyPress = (e) => {
            if (!dungeonData?.dungeon || !hero) return;

            const newPosition = { ...position };
            let canMove = true;

            const checkCollision = (x, y) => {
                if (y < 0 || y >= dungeonData.dungeon.length ||
                    x < 0 || x >= dungeonData.dungeon[0].length) {
                    return false;
                }
                const nextCell = dungeonData.dungeon[y][x];
                return !isSolidBlock(nextCell);
            };

            switch (e.key.toLowerCase()) {
                case 'arrowup':
                case 'z':
                    canMove = checkCollision(position.x, position.y - 1);
                    if (canMove) {
                        newPosition.y--;
                        setDirection('back');
                    }
                    break;
                case 'arrowdown':
                case 's':
                    canMove = checkCollision(position.x, position.y + 1);
                    if (canMove) {
                        newPosition.y++;
                        setDirection('front');
                    }
                    break;
                case 'arrowleft':
                case 'q':
                    canMove = checkCollision(position.x - 1, position.y);
                    if (canMove) {
                        newPosition.x--;
                        setDirection('left');
                    }
                    break;
                case 'arrowright':
                case 'd':
                    canMove = checkCollision(position.x + 1, position.y);
                    if (canMove) {
                        newPosition.x++;
                        setDirection('right');
                    }
                    break;
                case ' ':
                    const cellBelow = position.y + 1 < dungeonData.dungeon.length ?
                        dungeonData.dungeon[position.y + 1][position.x] : null;

                    if (isSolidBlock(cellBelow) && !isJumping) {
                        setIsJumping(true);
                        setJumpVelocity(JUMP_FORCE);
                    }
                    else if (isJumping && canDoubleJump) {
                        setJumpVelocity(JUMP_FORCE);
                        setCanDoubleJump(false);
                    }
                    break;
                default:
                    return;
            }

            if (canMove) {
                setPosition(newPosition);
            }
        };

        window.addEventListener('keydown', handleKeyPress);
        return () => window.removeEventListener('keydown', handleKeyPress);
    }, [position, dungeonData, hero, isJumping, canDoubleJump]);

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
        if (!dungeonData?.dungeon || !position) return;

        const currentCell = dungeonData.dungeon[position.y][position.x];
        console.log('Position actuelle:', position);
        console.log('Cellule actuelle:', currentCell);

        if (currentCell === 'END_DUNGEON') {
            console.log('Fin du donjon atteinte !');
            setShowVictory(true);
        }
    }, [position, dungeonData]);

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
                {dungeonData && (
                    <>
                        {renderBackgroundLayers()}
                        <DungeonCanva
                            dungeonData={dungeonData}
                            imageCache={imageCache}
                            hero={hero}
                            position={position}
                            direction={direction}
                            monster={monster} // Ajout du monstre
                            monsterPosition={monsterPosition}
                            monsterDirection={monsterDirection}
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
