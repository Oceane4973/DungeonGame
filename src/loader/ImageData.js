export default class ImageData {
    constructor(src, frames = 1, xRatio = 0, yRatio = 0, sizeRatio = 1) {
        this.image = new Image();
        this.image.src = src;
        this.frames = frames;
        this.xRatio = xRatio;
        this.yRatio = yRatio;
        this.sizeRatio = sizeRatio;
    }

    async initialize() {
        return new Promise((resolve) => {
            this.image.onload = () => {
                console.log(`Image loaded successfully: ${this.image.src}`);
                resolve();
            };
            this.image.onerror = (error) => {
                console.error(`Error loading image: ${this.image.src}`, error);
                resolve();
            };
        });
    }
}
