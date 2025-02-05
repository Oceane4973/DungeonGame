import Character from './Character';

export default class Monster extends Character {
    constructor(healthPoints, level, attack, x, y, direction, spriteUrls = [], dungeonData, isSolidBlock) {
        super(healthPoints, level, attack, x, y, direction, spriteUrls, dungeonData, isSolidBlock);
        this.moveInterval = null;
    }

    startMoving() {
        this.moveInterval = setInterval(() => {
            const moveLeft = Math.random() > 0.5;
            const nextX = this.position.x + (moveLeft ? -1 : 1);

            this.moveTo(nextX, this.position.y);
        }, 1000);
    }

    stopMoving() {
        clearInterval(this.moveInterval);
    }
}
