import ImageData from './ImageData.js';

export default class ImageLoader {
    static instance = null;

    constructor() {
        if (ImageLoader.instance) {
            return ImageLoader.instance;
        }
        ImageLoader.instance = this;
        this.images = {};
    }

    async loadImages() {
        try {
            const imagesToLoad = {
                BACKGROUND: '/src/resources/images/background.png',
                // WALL: '/src/resources/images/wall.png',
                // FLOOR: '/src/resources/images/floor.png',
                // DOOR: '/src/resources/images/door.png',
                // PLAYER: '/src/resources/images/player.png'
            };

            const loadPromises = Object.entries(imagesToLoad).map(([key, path]) => {
                return new Promise((resolve, reject) => {
                    const img = new Image();
                    img.onload = () => {
                        this.images[key] = {
                            image: img,
                            loaded: true
                        };
                        resolve();
                    };
                    img.onerror = () => {
                        console.error(`Failed to load image: ${path}`);
                        reject(new Error(`Failed to load image: ${path}`));
                    };
                    img.src = path;
                });
            });

            await Promise.all(loadPromises);
            console.log('All images loaded successfully');
        } catch (error) {
            console.error('Error loading images:', error);
            throw error;
        }
    }

    static getInstance() {
        if (!ImageLoader.instance) {
            ImageLoader.instance = new ImageLoader();
        }
        return ImageLoader.instance;
    }
}
