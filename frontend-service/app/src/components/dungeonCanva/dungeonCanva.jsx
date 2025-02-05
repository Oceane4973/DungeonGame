import React, { useEffect, useRef } from 'react';

const DungeonCanva = ({ dungeonData, imageCache, hero, position, direction, monster, monsterPosition, monsterDirection }) => {
    const canvasRef = useRef(null);

    useEffect(() => {
        if (dungeonData && Object.keys(imageCache).length > 0) {
            preloadCharacterImages();
            drawDungeon();

            const handleResize = () => drawDungeon();
            window.addEventListener('resize', handleResize);

            return () => window.removeEventListener('resize', handleResize);
        }
    }, [dungeonData, imageCache, hero, monster, position, direction]);

    // Préchargement des images du héros et du monstre dans le cache
    const preloadCharacterImages = () => {
        if (hero && hero.bodySprite && !imageCache[hero.bodySprite.url]) {
            const bodyImage = new Image();
            bodyImage.src = hero.bodySprite.url;
            bodyImage.onload = () => (imageCache[hero.bodySprite.url] = bodyImage);
        }

        if (hero && hero.headSprite && !imageCache[hero.headSprite.url]) {
            const headImage = new Image();
            headImage.src = hero.headSprite.url;
            headImage.onload = () => (imageCache[hero.headSprite.url] = headImage);
        }

        if (monster && monster.sprites[0] && !imageCache[monster.sprites[0].url]) {
            const monsterSprite = new Image();
            monsterSprite.src = monster.sprites[0].url;
            monsterSprite.onload = () => (imageCache[monster.sprites[0].url] = monsterSprite);
        }
    };

    const drawDungeon = () => {
        const canvas = canvasRef.current;
        if (!canvas || !dungeonData) return;

        const ctx = canvas.getContext('2d');
        const { dungeon } = dungeonData;

        const cellSize = 100;
        const cols = dungeon[0].length;
        const rows = dungeon.length;

        canvas.width = cellSize * cols;
        canvas.height = cellSize * rows;

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        dungeon.forEach((row, y) => {
            row.forEach((cell, x) => {
                if (cell && imageCache[cell]) {
                    ctx.drawImage(imageCache[cell], x * cellSize, y * cellSize, cellSize, cellSize);
                }
            });
        });

        if (hero) {
            const bodyImage = imageCache[hero.bodySprite.url];
            const headImage = imageCache[hero.headSprite.url];

            const heroX = position.x * cellSize;
            const heroY = position.y * cellSize;

            if (bodyImage) {
                ctx.save();
                if (direction === 'left') {
                    ctx.translate(heroX + cellSize, heroY);
                    ctx.scale(-1, 1);
                    ctx.drawImage(bodyImage, 0, 0, cellSize, cellSize);
                } else {
                    ctx.drawImage(bodyImage, heroX, heroY, cellSize, cellSize);
                }
                ctx.restore();
            }

            if (headImage) {
                ctx.save();
                if (direction === 'left') {
                    ctx.translate(heroX + cellSize, heroY);
                    ctx.scale(-1, 1);
                    ctx.drawImage(headImage, 0, 0, cellSize, cellSize);
                } else {
                    ctx.drawImage(headImage, heroX, heroY, cellSize, cellSize);
                }
                ctx.restore();
            }
        }

        if (monster) {
            const monsterSprite = imageCache[monster.sprites[0].url];

            if (monsterSprite) {
                ctx.save();
                if (monsterDirection === 'left') {
                    ctx.translate((monsterPosition.x + 1) * cellSize, monsterPosition.y * cellSize);
                    ctx.scale(-1, 1);
                    ctx.drawImage(monsterSprite, 0, 0, cellSize, cellSize);
                } else {
                    ctx.drawImage(monsterSprite, monsterPosition.x * cellSize, monsterPosition.y * cellSize, cellSize, cellSize);
                }
                ctx.restore();
            }
        }
    };

    return (
        <canvas
            ref={canvasRef}
            className="dungeon-canvas"
            style={{
                imageRendering: 'pixelated',
                maxWidth: '100%',
                maxHeight: '70vh'
            }}
        />
    );
};

export default DungeonCanva;