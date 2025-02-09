import React, { useRef, useEffect, useState } from 'react';
import './dungeonCanva.css';

import Character from '../../models/Character';
import { fightService } from '../../services/fightService';

const DungeonCanva = ({ dungeonData, imageCache, hero, monsters, isSolidBlock, username, onGameOver }) => {
    const canvasRef = useRef(null);
    const cellSize = 100;
    const lastAttackTimeRef = useRef({});

    useEffect(() => {
        window.forceRedraw = () => {
            drawDungeon();
        };
        return () => {
            window.forceRedraw = null;
        };
    }, [dungeonData, imageCache]);

    useEffect(() => {
        if (dungeonData && Object.keys(imageCache).length > 0) {
            drawDungeon();

            const handleResize = () => drawDungeon();
            window.addEventListener('resize', handleResize);

            return () => window.removeEventListener('resize', handleResize);
        }
    }, [dungeonData, imageCache]);

    useEffect(() => {
        if (hero.pv <= 0) {
            hero.isDead = true;
            setTimeout(() => {
                onGameOver();
            }, 500);
        }
    }, [hero]);

    const drawDungeon = () => {
        const canvas = canvasRef.current;
        if (!canvas || !dungeonData) return;

        const ctx = canvas.getContext('2d');
        const { dungeon } = dungeonData;

        canvas.width = cellSize * dungeon[0].length;
        canvas.height = cellSize * dungeon.length;

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        dungeon.forEach((row, y) => {
            row.forEach((cell, x) => {
                if (cell && imageCache[cell]) {
                    ctx.drawImage(imageCache[cell], x * cellSize, y * cellSize, cellSize, cellSize);
                }
            });
        });

        drawCharacter(ctx, hero);
        monsters.forEach(monster => drawCharacter(ctx, monster));

        checkCollision(hero, monsters);
    };

    const fetchFight = async (hero, monster, username) => {
        try {
            const resultat = await fightService.getFightResult(hero, monster, username);
            return resultat;
        } catch (err) {
            console.error("Impossible de récupérer les données de combats.");
        }
    };

    const checkCollision = (hero, monsters) => {
        const currentTime = Date.now();
        const cooldown = 3000;

        monsters.forEach(async monster => {
            if (!monster.id) return;
            if (monster.isDead) return;

            if (hero.position.x === monster.position.x && hero.position.y === monster.position.y) {
                if (!lastAttackTimeRef.current[monster.id] || currentTime - lastAttackTimeRef.current[monster.id] >= cooldown) {
                    const result = await fetchFight(hero, monster, username);
                    if (result.winner === "monster") {
                        hero.isDead = true;
                        hero.pv = 0; //Juste pour le graphisme mais sinon se met a jour automatiquement en bdd avec rabbitmq
                        setTimeout(() => {
                            onGameOver();
                        }, 500);
                    } else {
                        monster.pv = 0;
                        monster.isDead = true;
                    }
                }
            }
        });
    };

    const drawCharacter = (ctx, character) => {
        const sprite = character.imageCache[character.sprites[0]?.url];
        if (!sprite) return;

        const x = character.position.x * cellSize;
        const y = character.position.y * cellSize;

        ctx.save();

        if (character.isDead) {
            // Animation de chute et rotation
            ctx.translate(x + cellSize / 2, y + cellSize / 2);
            ctx.rotate(Math.PI / 2); // Rotation de 90 degrés
            ctx.translate(-cellSize / 2, -cellSize / 2);
            ctx.globalAlpha = 0.7; // Légère transparence

            // Décaler le héros vers le bas pour qu'il soit sur le sol
            ctx.drawImage(sprite, 0, cellSize / 2, cellSize, cellSize);

        } else if (character.direction === 'left') {
            ctx.translate(x + cellSize, y);
            ctx.scale(-1, 1);
            ctx.drawImage(sprite, 0, 0, cellSize, cellSize);
        } else {
            ctx.drawImage(sprite, x, y, cellSize, cellSize);
        }

        ctx.restore();

        if (!character.isDead) {
            drawHealthBar(ctx, character, x, y - 10);
        }
    };

    const drawHealthBar = (ctx, character, x, y) => {
        const barWidth = 60;
        const barHeight = 8;
        const healthPercentage = character.pv / Character.maxPv;

        const currentBarWidth = Math.max(0, barWidth * healthPercentage);
        const barColor = character.isHero ? 'green' : 'red';

        const barX = x + (cellSize - barWidth) / 2;
        const barY = y;

        ctx.fillStyle = 'lightgray';
        ctx.fillRect(barX, barY, barWidth, barHeight);

        ctx.fillStyle = barColor;
        ctx.fillRect(barX, barY, currentBarWidth, barHeight);

        ctx.strokeStyle = 'black';
        ctx.strokeRect(barX, barY, barWidth, barHeight);
    };

    return (
        <div style={{ position: 'relative' }}>
            <canvas
                ref={canvasRef}
                className="dungeon-canvas"
                style={{ imageRendering: 'pixelated', maxWidth: '100%', maxHeight: '70vh' }}
            />
        </div>
    );
};

export default DungeonCanva;
