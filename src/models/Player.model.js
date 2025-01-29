import ImageLoader from '../loader/ImageLoader.js';

export default class PlayerModel {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.sprite = ImageLoader.instance.images.FARMER;
        
        // Configuration du sprite Farmer
        this.frameWidth = 48;   // Taille d'un frame
        this.frameHeight = 48;
        this.frameX = 1;        // Frame horizontale
        this.frameY = 0;        // Frame verticale (direction)
        this.moving = false;
        this.animationSpeed = 150;
        this.lastFrameUpdate = 0;
    }

    move(direction) {
        this.moving = true;
        switch(direction) {
            case 'down':
                this.frameY = 0;
                break;
            case 'left':
                this.frameY = 1;
                break;
            case 'right':
                this.frameY = 2;
                break;
            case 'up':
                this.frameY = 3;
                break;
        }
        
        // Animation de marche
        const now = Date.now();
        if (now - this.lastFrameUpdate > this.animationSpeed) {
            this.frameX = (this.frameX + 1) % 3;
            this.lastFrameUpdate = now;
        }
    }

    stopMoving() {
        this.moving = false;
        this.frameX = 1; // Frame statique
    }
}
