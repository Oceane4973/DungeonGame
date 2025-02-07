import React, { useRef, useEffect, useState } from 'react';

import Character from '../../models/Character';
import { fightService } from '../../services/fightService';

const DungeonCanva = ({ dungeonData, imageCache, hero, monsters, isSolidBlock, username }) => {
    const canvasRef = useRef(null);
    const cellSize = 100;

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
        monsters.forEach(async monster => {
            if (hero.position.x === monster.position.x && hero.position.y === monster.position.y) {
                console.log(`💥 Collision détectée avec un monstre à (${hero.position.x}, ${hero.position.y}) !`);

                console.log(username);
                const resultat = await fetchFight(hero, monster, username);
                console.log(`GAGNANT  : ${resultat.winner}`);
                
                /*hero.pv -= monster.attack;
                console.log(`PV du héros : ${hero.pv}`);

                if (hero.pv <= 0) {
                    console.log("💀 Le héros est mort !");
                }*/
            }
        });
    };

    const drawCharacter = (ctx, character) => {
        const sprite = character.imageCache[character.sprites[0]?.url];
        if (!sprite) return;

        const x = character.position.x * cellSize;
        const y = character.position.y * cellSize;

        ctx.save();

        if (character.direction === 'left') {
            ctx.translate(x + cellSize, y);
            ctx.scale(-1, 1);
            ctx.drawImage(sprite, 0, 0, cellSize, cellSize);
        } else {
            ctx.drawImage(sprite, x, y, cellSize, cellSize);
        }

        ctx.restore();

        drawHealthBar(ctx, character, x, y - 10);
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
        <canvas
            ref={canvasRef}
            className="dungeon-canvas"
            style={{ imageRendering: 'pixelated', maxWidth: '100%', maxHeight: '70vh' }}
        />
    );
};

export default DungeonCanva;
