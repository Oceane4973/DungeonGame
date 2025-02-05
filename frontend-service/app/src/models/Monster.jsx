import Character from './Character';

export default class Monster extends Character {
    constructor(healthPoints, level, attack, x, y, direction, spriteUrls = [], dungeonData, isSolidBlock) {
        super(healthPoints, level, attack, x, y, direction, spriteUrls, dungeonData, isSolidBlock);
        this.moveInterval = null;

        this.moveTo(this.position.x, this.position.y+1);
    }

    startMoving() {
        console.log("Monster.startMoving");
    
        if (this.moveInterval) clearInterval(this.moveInterval);
    
        this.moveInterval = setInterval(() => {
            const moveLeft = Math.random() > 0.5;
            const nextX = this.position.x + (moveLeft ? -1 : 1);
    
            this.moveTo(nextX, this.position.y);
        }, 1000);
    }
    
    stopMoving() {
        console.log("Monster.stopMoving");
        if (this.moveInterval) {
            clearInterval(this.moveInterval);
            this.moveInterval = null;
        }
    }

    destroy() {
        console.log("Monster.destroy");

        this.stopMoving();

        window.removeEventListener('keydown', this.handleKeyPress);

        for (let prop in this) {
            if (this.hasOwnProperty(prop)) {
                delete this[prop];
            }
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
