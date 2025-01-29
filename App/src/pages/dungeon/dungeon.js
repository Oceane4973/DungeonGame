import DungeonCanvas from '../../controllers/Dungeon.controller.js';
import DungeonGenerator from '../../controllers/DungeonGenerator.controller.js';
import ImageLoader from '../../loader/ImageLoader.js';
import GameEngine from '../../GameEngine.js';

window.addEventListener('load', async () => {

    try {
        console.log('Starting dungeon initialization...');
        
        // Initialiser le chargeur d'images
        const imageLoader = new ImageLoader();
        await imageLoader.loadImages();
        console.log('Images loaded');
        
        // Initialiser le canvas
        const dungeonCanvas = new DungeonCanvas("game");
        window.dungeonCanvas = dungeonCanvas;
        console.log('Canvas created');
        
        // Générer le donjon
        const generator = new DungeonGenerator(dungeonCanvas);
        generator.generateDungeon();
        console.log('Dungeon generated');
        
        // Faire le rendu initial
        dungeonCanvas.render();
        console.log('Initial render complete');
        
        // Démarrer le moteur de jeu
        const engine = new GameEngine(dungeonCanvas);
        window.gameEngine = engine;
    } catch (error) {
        console.error('Error during dungeon initialization:', error);
    }
});