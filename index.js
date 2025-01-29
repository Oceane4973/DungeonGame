function checkAuth() {
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    const isLoginPage = window.location.pathname.includes('login.html');
    
    if (!isLoggedIn && !isLoginPage) {
        window.location.href = 'login.html';
        return false;
    } else if (isLoggedIn && isLoginPage) {
        window.location.href = 'index.html';
        return false;
    }
    return true;
}

window.addEventListener('load', async () => {
    if (!checkAuth()) return;

    try {
        console.log('Starting initialization...');
        const imageLoader = new ImageLoader();
        await imageLoader.loadImages();
        console.log('Images loaded');
        
        const dungeonCanvas = new DungeonCanvas("game");
        window.dungeonCanvas = dungeonCanvas;
        console.log('Canvas created');
        
        const generator = new DungeonGenerator(dungeonCanvas);
        generator.generateDungeon();
        console.log('Dungeon generated');
        
        dungeonCanvas.render();
        console.log('Initial render complete');
        
        const engine = new GameEngine(dungeonCanvas);
        window.gameEngine = engine;
    } catch (error) {
        console.error('Error during initialization:', error);
    }
});

// quantité maximal sur une cellule / quantité max de la cellule la plus haute historiquement
