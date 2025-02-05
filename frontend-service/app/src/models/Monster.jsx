import Character from './Character';

export default class Monster extends Character {
    constructor(healthPoints, level, attack, x, y, direction, spriteUrls = [], dungeonData, isSolidBlock) {
        super(healthPoints, level, attack, x, y, direction, spriteUrls, dungeonData, isSolidBlock);
        this.moveInterval = null;
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
}
