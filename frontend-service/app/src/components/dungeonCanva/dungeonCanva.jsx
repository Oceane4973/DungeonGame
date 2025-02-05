import React, { useEffect, useRef } from 'react';

const DungeonCanva = ({ dungeonData, imageCache, hero, monsters, isSolidBlock }) => {
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

    useEffect(() => {
        monsters.forEach(monster => monster.startMoving(dungeonData, isSolidBlock));
        return () => monsters.forEach(monster => monster.stopMoving());
    }, [monsters]);

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
    };

    const drawCharacter = (ctx, character) => {
        const sprite = character.imageCache[character.sprites[0].url];
        if (!sprite) return;

        ctx.save();
        const x = character.position.x * cellSize;
        const y = character.position.y * cellSize;

        if (character.direction === 'left') {
            ctx.translate(x + cellSize, y);
            ctx.scale(-1, 1);
            ctx.drawImage(sprite, 0, 0, cellSize, cellSize);
        } else {
            ctx.drawImage(sprite, x, y, cellSize, cellSize);
        }
        ctx.restore();
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
