import Character from './Character';

export default class Hero extends Character {
    constructor(id, healthPoints, level, attack, x, y, direction, spriteUrls = [], dungeonData, isSolidBlock, onDungeonComplete) {
        super(healthPoints, level, attack, x, y, direction, spriteUrls, dungeonData, isSolidBlock, onDungeonComplete);
        this.id = id

        this.isJumping = false;
        this.jumpHeight = 2;
        this.isHero = true;
        this.onDungeonComplete = onDungeonComplete;
        this.bindControls();
        this.wantToMoveInCell(this.position.x, this.position.y+1);
    }

    bindControls() {
        window.addEventListener('keydown', (e) => this.handleKeyPress(e));
    }

    wantToMoveInCell(x, y) {
        if (this.isDead) return; 
        
        const cell = this.dungeonData.dungeon[y]?.[x];
        if (cell === 'END_DUNGEON') {
            console.log('Fin du donjon atteinte !');
            this.onDungeonComplete();
            this.destroy();  // Suppression propre de l'objet héros
            return;
        }
        this.moveTo(x, y);
    }

    handleKeyPress(e) {
        if (!this.dungeonData) return;

        switch (e.key.toLowerCase()) {
            case 'arrowleft':
            case 'q':
                this.wantToMoveInCell(this.position.x - 1, this.position.y);
                this.direction = 'left';
                break;
            case 'arrowright':
            case 'd':
                this.wantToMoveInCell(this.position.x + 1, this.position.y);
                this.direction = 'right';
                break;
            case 'arrowup':
            case ' ':
            case 'z':
                const belowY = this.position.y + 1;
                if (!this.isJumping && this.isSolidBlock(this.dungeonData.dungeon[belowY][this.position.x])) {
                    this.isJumping = true;
                    let jumpCount = 0;
                    const jumpInterval = setInterval(() => {
                        if (jumpCount < this.jumpHeight) {
                            this.wantToMoveInCell(this.position.x, this.position.y - 1);
                            jumpCount++;
                        } else {
                            clearInterval(jumpInterval);
                            this.isJumping = false;
                        }
                    }, 150);
                }
                break;
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
                const cell = this.dungeonData.dungeon[belowY]?.[this.position.x];
                if (cell === 'END_DUNGEON') {
                    console.log('Fin du donjon atteinte !');
                    this.onDungeonComplete();
                    this.destroy();
                    return;
                }
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

    destroy() {
        console.log('Héros détruit.');
        window.removeEventListener('keydown', this.handleKeyPress);

        if (this.fallInterval) {
            clearInterval(this.fallInterval);
        }

        for (let prop in this) {
            if (this.hasOwnProperty(prop)) {
                delete this[prop];
            }
        }
    }

}
