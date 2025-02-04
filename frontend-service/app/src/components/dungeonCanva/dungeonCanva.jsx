import React, { useEffect, useRef } from 'react';

const DungeonCanva = ({ dungeonData, imageCache, hero, position }) => {
    const canvasRef = useRef(null);

    useEffect(() => {
        if (dungeonData && Object.keys(imageCache).length > 0) {
            drawDungeon();

            const handleResize = () => drawDungeon();
            window.addEventListener('resize', handleResize);

            return () => window.removeEventListener('resize', handleResize);
        }
    }, [dungeonData, imageCache, hero, position]);

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

        if (hero && hero.bodySprite && hero.headSprite) {
            const bodyImage = new Image();
            const headImage = new Image();
            
            bodyImage.src = hero.bodySprite.url;
            headImage.src = hero.headSprite.url;

            const heroX = position.x * cellSize;
            const heroY = position.y * cellSize;

            bodyImage.onload = () => {
                ctx.drawImage(bodyImage, heroX, heroY, cellSize, cellSize);
            };
            
            headImage.onload = () => {
                ctx.drawImage(headImage, heroX, heroY, cellSize, cellSize);
            };
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
