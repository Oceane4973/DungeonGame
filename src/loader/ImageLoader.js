import ImageData from './ImageData.js';

export default class ImageLoader {

    static instance = new ImageLoader()

    constructor() {
        this.images = {};
        ImageLoader.instance = this;
    }

    async loadImages() {
        try {
            // Charger l'image de fond
            const backgroundImage = new Image();
            backgroundImage.src = './src/resources/assets/background.png';
            await new Promise((resolve, reject) => {
                backgroundImage.onload = resolve;
                backgroundImage.onerror = reject;
            });
            this.images.BACKGROUND = {
                image: backgroundImage
            };

            const mapSprite = new Image();
            mapSprite.src = './src/resources/assets/map.png';
            
            await new Promise((resolve, reject) => {
                mapSprite.onload = () => {
                    this.images.MAP = {
                        image: mapSprite,
                        tileSize: 16
                    };
                    console.log('Map tileset loaded successfully');
                    resolve();
                };
                mapSprite.onerror = (e) => {
                    console.error('Error loading map tileset:', e);
                    reject(e);
                };
            });

            return true;
        } catch (error) {
            console.error('Error loading images:', error);
            throw error;
        }
    }
}
