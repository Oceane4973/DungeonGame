import Character from './Character';

export default class Hero extends Character {
    constructor(healthPoints, level, attack, x, y, direction, spriteUrls = [], dungeonData, isSolidBlock) {
        super(healthPoints, level, attack, x, y, direction, spriteUrls, dungeonData, isSolidBlock);
        this.isJumping = false;
        this.jumpHeight = 2;
        this.bindControls();
    }

    reinitialize() {
        this.position = { x: 0, y: 0 }; // Réinitialiser à la position de départ
        this.isJumping = false;
        this.canDoubleJump = true;
        this.isDoubleJumping = false;
        console.log('Héros réinitialisé !');
    }    

    bindControls() {
        window.addEventListener('keydown', (e) => this.handleKeyPress(e));
    }

    handleKeyPress(e) {
        if (!this.dungeonData) return;

        switch (e.key.toLowerCase()) {
            case 'arrowleft':
            case 'q':
                this.moveTo(this.position.x - 1, this.position.y);
                this.direction = 'left';
                break;
            case 'arrowright':
            case 'd':
                this.moveTo(this.position.x + 1, this.position.y);
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
                            this.moveTo(this.position.x, this.position.y - 1);
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
}
