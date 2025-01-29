import PlayerModel from '../models/Player.model.js';
import ImageLoader from '../loader/ImageLoader.js';
import DungeonGenerator from '../controllers/DungeonGenerator.controller.js';
import MapModel from '../models/Map.model.js';

export default class DungeonCanvas {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext('2d');
        
        // Définir les dimensions du canvas pour correspondre au ratio de l'image
        this.canvas.width = 1200;
        this.canvas.height = 800;
        this.tileSize = 32;
        
        // Initialiser la map
        this.map = null;
        
        // Gestion du joueur
        this.player = new PlayerModel(2, 14);
        
        // Gestion des contrôles
        this.setupControls();
        
        // Modifier la gestion du redimensionnement
        window.addEventListener('resize', () => {
            // Garder les dimensions fixes au lieu de les adapter à la fenêtre
            this.canvas.width = 1200;
            this.canvas.height = 800;
            this.tileSize = 32;  // Garder une taille de tuile fixe
            this.render();
        });
        
        console.log('DungeonCanvas initialized');
    }

    toIso(x, y, z = 0) {
        const tileWidth = this.tileSize;
        const tileHeight = this.tileSize / 2;
        return {
            x: (x - y) * tileWidth/2 + this.canvas.width/2,
            y: (x + y) * tileHeight/2 + this.canvas.height/3 - z * tileHeight
        };
    }

    fromIso(screenX, screenY) {
        const x = (screenX - this.offsetX) / this.tileSize + (screenY - this.offsetY) / (this.tileSize/2);
        const y = (screenY - this.offsetY) / (this.tileSize/2) - (screenX - this.offsetX) / this.tileSize;
        return { x: Math.round(x), y: Math.round(y) };
    }

    setupControls() {
        document.addEventListener('keydown', (e) => {
            const oldX = this.player.x;
            const oldY = this.player.y;

            switch(e.key) {
                case 'ArrowUp':
                    this.player.y--;
                    this.player.move('up');
                    break;
                case 'ArrowDown':
                    this.player.y++;
                    this.player.move('down');
                    break;
                case 'ArrowLeft':
                    this.player.x--;
                    this.player.move('left');
                    break;
                case 'ArrowRight':
                    this.player.x++;
                    this.player.move('right');
                    break;
            }

            // Vérification des collisions
            if (this.map[this.player.y]?.[this.player.x]?.type === 'wall') {
                this.player.x = oldX;
                this.player.y = oldY;
            }

            this.render();
        });

        document.addEventListener('keyup', () => {
            this.player.stopMoving();
            this.render();
        });
    }

    drawTile(x, y, type) {
        const screenX = x * this.tileSize;
        const screenY = y * this.tileSize;
        const tileset = ImageLoader.instance.images.MAP;

        if (!tileset || !tileset.image) return;

        switch(type) {
            case 'grass':
                this.ctx.drawImage(
                    tileset.image,
                    MapModel.TILES.GRASS.x,
                    MapModel.TILES.GRASS.y,
                    MapModel.TILES.GRASS.width,
                    MapModel.TILES.GRASS.height,
                    screenX, screenY,
                    this.tileSize, this.tileSize
                );
                break;
            case 'dirt':
                this.ctx.drawImage(
                    tileset.image,
                    MapModel.TILES.DIRT.x,
                    MapModel.TILES.DIRT.y,
                    MapModel.TILES.DIRT.width,
                    MapModel.TILES.DIRT.height,
                    screenX, screenY,
                    this.tileSize, this.tileSize
                );
                break;
            case 'tree':
                const tile = this.map[y][x];
                this.ctx.drawImage(
                    tileset.image,
                    tile.spriteX,
                    tile.spriteY,
                    tile.width,
                    tile.height,
                    screenX,
                    screenY - (this.tileSize * 2),  // Offset upward by 2 tiles
                    this.tileSize,
                    this.tileSize * 3  // Make tree 3 tiles tall
                );
                break;
            case 'platform_corner_top_left':
                this.ctx.drawImage(
                    tileset.image,
                    MapModel.TILES.PLATFORM.CORNER.TOP_LEFT.x,
                    MapModel.TILES.PLATFORM.CORNER.TOP_LEFT.y,
                    MapModel.TILES.PLATFORM.CORNER.TOP_LEFT.width,
                    MapModel.TILES.PLATFORM.CORNER.TOP_LEFT.height,
                    screenX, screenY,
                    this.tileSize, this.tileSize
                );
                break;
            case 'platform_corner_top_right':
                this.ctx.drawImage(
                    tileset.image,
                    MapModel.TILES.PLATFORM.CORNER.TOP_RIGHT.x,
                    MapModel.TILES.PLATFORM.CORNER.TOP_RIGHT.y,
                    MapModel.TILES.PLATFORM.CORNER.TOP_RIGHT.width,
                    MapModel.TILES.PLATFORM.CORNER.TOP_RIGHT.height,
                    screenX, screenY,
                    this.tileSize, this.tileSize
                );
                break;
            case 'platform_corner_bottom_left':
                this.ctx.drawImage(
                    tileset.image,
                    MapModel.TILES.PLATFORM.CORNER.BOTTOM_LEFT.x,
                    MapModel.TILES.PLATFORM.CORNER.BOTTOM_LEFT.y,
                    MapModel.TILES.PLATFORM.CORNER.BOTTOM_LEFT.width,
                    MapModel.TILES.PLATFORM.CORNER.BOTTOM_LEFT.height,
                    screenX, screenY,
                    this.tileSize, this.tileSize
                );
                break;
            case 'platform_corner_bottom_right':
                this.ctx.drawImage(
                    tileset.image,
                    MapModel.TILES.PLATFORM.CORNER.BOTTOM_RIGHT.x,
                    MapModel.TILES.PLATFORM.CORNER.BOTTOM_RIGHT.y,
                    MapModel.TILES.PLATFORM.CORNER.BOTTOM_RIGHT.width,
                    MapModel.TILES.PLATFORM.CORNER.BOTTOM_RIGHT.height,
                    screenX, screenY,
                    this.tileSize, this.tileSize
                );
                break;
            case 'platform_edge_left':
                this.ctx.drawImage(
                    tileset.image,
                    MapModel.TILES.PLATFORM.EDGE.LEFT.x,
                    MapModel.TILES.PLATFORM.EDGE.LEFT.y,
                    MapModel.TILES.PLATFORM.EDGE.LEFT.width,
                    MapModel.TILES.PLATFORM.EDGE.LEFT.height,
                    screenX, screenY,
                    this.tileSize, this.tileSize
                );
                break;
            case 'platform_edge_right':
                this.ctx.drawImage(
                    tileset.image,
                    MapModel.TILES.PLATFORM.EDGE.RIGHT.x,
                    MapModel.TILES.PLATFORM.EDGE.RIGHT.y,
                    MapModel.TILES.PLATFORM.EDGE.RIGHT.width,
                    MapModel.TILES.PLATFORM.EDGE.RIGHT.height,
                    screenX, screenY,
                    this.tileSize, this.tileSize
                );
                break;
            case 'platform_edge_top':
                this.ctx.drawImage(
                    tileset.image,
                    MapModel.TILES.PLATFORM.EDGE.TOP.x,
                    MapModel.TILES.PLATFORM.EDGE.TOP.y,
                    MapModel.TILES.PLATFORM.EDGE.TOP.width,
                    MapModel.TILES.PLATFORM.EDGE.TOP.height,
                    screenX, screenY,
                    this.tileSize, this.tileSize
                );
                break;
            case 'platform_edge_bottom':
                this.ctx.drawImage(
                    tileset.image,
                    MapModel.TILES.PLATFORM.EDGE.BOTTOM.x,
                    MapModel.TILES.PLATFORM.EDGE.BOTTOM.y,
                    MapModel.TILES.PLATFORM.EDGE.BOTTOM.width,
                    MapModel.TILES.PLATFORM.EDGE.BOTTOM.height,
                    screenX, screenY,
                    this.tileSize, this.tileSize
                );
                break;
            case 'platform_center':
                this.ctx.drawImage(
                    tileset.image,
                    MapModel.TILES.PLATFORM.CENTER.x,
                    MapModel.TILES.PLATFORM.CENTER.y,
                    MapModel.TILES.PLATFORM.CENTER.width,
                    MapModel.TILES.PLATFORM.CENTER.height,
                    screenX, screenY,
                    this.tileSize, this.tileSize
                );
                break;
            case 'grass_left':
                this.ctx.drawImage(
                    tileset.image,
                    MapModel.TILES.GRASS_SIDE.LEFT.x,
                    MapModel.TILES.GRASS_SIDE.LEFT.y,
                    MapModel.TILES.GRASS_SIDE.LEFT.width,
                    MapModel.TILES.GRASS_SIDE.LEFT.height,
                    screenX, screenY,
                    this.tileSize, this.tileSize
                );
                break;
            case 'grass_right':
                this.ctx.drawImage(
                    tileset.image,
                    MapModel.TILES.GRASS_SIDE.RIGHT.x,
                    MapModel.TILES.GRASS_SIDE.RIGHT.y,
                    MapModel.TILES.GRASS_SIDE.RIGHT.width,
                    MapModel.TILES.GRASS_SIDE.RIGHT.height,
                    screenX, screenY,
                    this.tileSize, this.tileSize
                );
                break;
        }
    }

    drawPlayer() {
        const screenX = this.player.x * this.tileSize;
        const screenY = this.player.y * this.tileSize;

        if (this.player.sprite && this.player.sprite.image) {
            this.ctx.drawImage(
                this.player.sprite.image,
                this.player.frameX * this.player.frameWidth,
                this.player.frameY * this.player.frameHeight,
                this.player.frameWidth,
                this.player.frameHeight,
                screenX,
                screenY,
                this.tileSize,
                this.tileSize
            );
        }
    }

    render() {
        if (!this.map) return;
        
        // Nettoyer le canvas
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Dessiner l'image de fond
        const background = ImageLoader.instance.images.BACKGROUND;
        if (background && background.image) {
            this.ctx.drawImage(
                background.image,
                0, 0,
                this.canvas.width, this.canvas.height
            );
        }
        
        // Dessiner la map
        for(let y = 0; y < this.map.length; y++) {
            for(let x = 0; x < this.map[y].length; x++) {
                if (this.map[y][x]) {
                    this.drawTile(x, y, this.map[y][x].type);
                }
            }
        }

        // Dessiner le joueur
        if (this.player) {
            this.drawPlayer();
        }
    }

    selectHero(index) {
        if (this.player) {
            this.player.changeCharacter(index);
            this.render();
        }
    }
}

const dungeonCanvas = new DungeonCanvas("game");
const generator = new DungeonGenerator(dungeonCanvas);
generator.generateDungeon();
