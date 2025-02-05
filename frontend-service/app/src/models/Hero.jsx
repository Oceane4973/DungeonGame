import Character from './Character';

export default class Hero extends Character {
    constructor(healthPoints, level, attack, x, y, direction, spriteUrls = []) {
        super(healthPoints, level, attack, x, y, direction, spriteUrls);
        this.bindControls();
    }

    bindControls() {
        window.addEventListener('keydown', (e) => this.handleKeyPress(e));
    }

    handleKeyPress(e) {
        switch (e.key.toLowerCase()) {
            case 'arrowleft':
            case 'q':
                this.position.x--;
                this.direction = 'left';
                break;
            case 'arrowright':
            case 'd':
                this.position.x++;
                this.direction = 'right';
                break;
            case 'arrowup':
            case 'z':
                this.position.y=-2;
                break;
            case 'arrowdown':
            case 's':
                this.position.y++;
                break;
        }
    }
}