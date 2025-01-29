import ImageLoader from "../loader/ImageLoader.js";
import { CellType } from '../models/Cell.model.js';
import { default as CellModel } from '../models/Cell.model.js';

class Cell{

    constructor(type = CellType.TREE) {
        this.image = ImageLoader.instance.images[type]
        this.drawPheromoneCircle = false;
    }

    draw_default_grass(context, x, y, cellSize){
        const grassImg = ImageLoader.instance.images[CellType.FLOOR]
        const grassSquareSize = grassImg.img.width / grassImg.croppedValue
        const grassXPos = grassImg.img.width * grassImg.xRatio
        const grassYPos = grassImg.img.width * grassImg.yRatio
        context.drawImage( grassImg.img, grassXPos, grassYPos, grassSquareSize, grassSquareSize, x * cellSize, y * cellSize, cellSize, cellSize);
    }

    draw_image(context, x, y, cellSize){
        const squareSize = this.image.img.width / this.image.croppedValue
        const xPos = this.image.img.width * this.image.xRatio
        const yPos = this.image.img.width * this.image.yRatio
        const objectSize = cellSize * this.image.sizeRatio
        context.drawImage( this.image.img, xPos, yPos, squareSize, squareSize, (x * cellSize) , (y * cellSize), objectSize, objectSize);
    }

    draw_pheromone(context, x, y, cellSize, pheromones, maxPheromones, color = null){
        if (this.drawPheromoneCircle && pheromones > 0){
            const circleSize = (maxPheromones/CellModel.maxPheromones) * cellSize * 0.4;
            const circleX = x * cellSize + cellSize / 2;
            const circleY = y * cellSize + cellSize / 2;

            context.beginPath();
            context.arc(circleX, circleY, circleSize, 0, 2 * Math.PI);
            context.fillStyle = `rgba(0, 255, 0, ${maxPheromones})`;
            context.fill();
            context.closePath();
        } else {
            context.textAlign = "center"
            context.fillStyle = color ? color : `rgba(0, 255, 0, ${maxPheromones})`;
            context.font = "10px Arial";
            context.fillText(pheromones.toFixed(2),(x * cellSize) + cellSize/2 , (y * cellSize) + cellSize/2);
        }
    }

    update_type(type){
        this.image = ImageLoader.instance.images[type]
    }
}

export default Cell;
