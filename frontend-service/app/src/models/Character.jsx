export default class Character {
    constructor(healthPoints, level, attack, x, y, direction, spriteUrls = []) {
        this.healthPoints = healthPoints;
        this.level = level;
        this.attack = attack;
        this.position = { x, y };
        this.direction = direction || 'right';
        this.sprites = spriteUrls;
        this.imageCache = {};
        this.gravity = 1;
        this.velocityY = 0;

        this.preloadSprites();
    }

    preloadSprites() {
        if (Array.isArray(this.sprites)) {
            this.sprites.forEach(sprite => {
                if (sprite?.url) {
                    const img = new Image();
                    img.src = sprite.url;
                    img.onload = () => {
                        console.log(`Image chargée : ${sprite.url}`);
                        this.imageCache[sprite.url] = img;
                        if (typeof window.forceRedraw === 'function') {
                            window.forceRedraw();
                        }
                    };
                    img.onerror = () => {
                        console.error(`Erreur de chargement de l'image : ${sprite.url}`);
                    };
                }
            });
        }
    }  
    
    applyGravity(dungeonData, isSolidBlock) {
        const belowY = this.position.y + 1;
        if (
            belowY < dungeonData.dungeon.length &&
            !isSolidBlock(dungeonData.dungeon[belowY][this.position.x])
        ) {
            this.position.y += this.gravity;
        }
    }
}