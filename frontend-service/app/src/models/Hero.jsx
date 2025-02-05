import Character from './Character';

export default class Hero extends Character {
    constructor(healthPoints, level, attack, x, y, direction, spriteUrls = [], dungeonData, isSolidBlock, onDungeonComplete) {
        super(healthPoints, level, attack, x, y, direction, spriteUrls, dungeonData, isSolidBlock, onDungeonComplete);
        this.isJumping = false;
        this.jumpHeight = 2;
        
        this.onDungeonComplete = onDungeonComplete;

        this.bindControls();
    }

    bindControls() {
        window.addEventListener('keydown', (e) => this.handleKeyPress(e));
    }

    wantToMoveInCell(x, y){
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
