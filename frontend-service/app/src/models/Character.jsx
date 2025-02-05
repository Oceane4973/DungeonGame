export default class Character {
    constructor(pv, level, attack, x, y, direction, spriteUrls = [], dungeonData, isSolidBlock) {
        this.pv = pv;
        this.level = level;
        this.attack = attack;
        this.position = { x, y };
        this.direction = direction || 'right';
        this.sprites = spriteUrls;
        this.imageCache = {};
        this.gravity = 1;
        this.velocityY = 0;
        this.fallInterval = null;
        this.dungeonData = dungeonData;
        this.isSolidBlock = isSolidBlock;

        this.JUMP_MAX_HEIGHT = 1;
        this.DOUBLE_JUMP_HEIGHT = 1;
        this.JUMP_SPEED = 30;
        this.GRAVITY_SPEED = 120;
        this.JUMP_FORCE = 0.5;
        this.DOUBLE_JUMP_FORCE = 0.5;

        this.preloadSprites();
    }

    preloadSprites() {
        if (Array.isArray(this.sprites)) {
            this.sprites.forEach(sprite => {
                if (sprite?.url && !this.imageCache[sprite.url]) {
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

    moveTo(x, y) {
        if (
            x >= 0 && y >= 0 && 
            y < this.dungeonData.dungeon.length && 
            x < this.dungeonData.dungeon[0].length &&
            !this.isSolidBlock(this.dungeonData.dungeon[y][x])
        ) {
            this.position = { x, y };

            if (typeof window.forceRedraw === 'function') {
                window.forceRedraw();
            }

            if (this.fallInterval) {
                clearInterval(this.fallInterval);
            }

            this.fallInterval = setInterval(() => {
                const belowY = this.position.y + 1;
                if (
                    belowY < this.dungeonData.dungeon.length &&
                    !this.isSolidBlock(this.dungeonData.dungeon[belowY][this.position.x])
                ) {
                    this.position.y++;
                    if (typeof window.forceRedraw === 'function') {
                        window.forceRedraw();
                    }
                } else {
                    clearInterval(this.fallInterval);
                }
            }, 200);
        }
    }
}