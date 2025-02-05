import Character from './Character';

export default class Monster extends Character {
    constructor(healthPoints, level, attack, x, y, direction, spriteUrls = []) {
        super(healthPoints, level, attack, x, y, direction, spriteUrls);
        this.moveInterval = null;
    }

    startMoving(dungeonData, isSolidBlock) {
        this.moveInterval = setInterval(() => {
            const moveLeft = Math.random() > 0.5;
            const nextX = this.position.x + (moveLeft ? -1 : 1);
            const belowY = this.position.y + 1;

            if (isSolidBlock(dungeonData.dungeon[belowY][nextX])) {
                this.position.x = nextX;
                this.direction = moveLeft ? 'left' : 'right';
            }

            this.applyGravity(dungeonData, isSolidBlock);
        }, 1000);
    }

    stopMoving() {
        clearInterval(this.moveInterval);
    }
}