import React, { useEffect, useRef } from 'react';

const DungeonCanva = ({ dungeonData, imageCache }) => {
    const canvasRef = useRef(null);

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
    };

    return (
        <canvas ref={canvasRef} className="dungeon-canvas" />
    );
};

export default DungeonCanva;
