import MapModel from '../models/Map.model.js';
import ImageLoader from '../loader/ImageLoader.js';

export default class DungeonGenerator {
    constructor(canvas) {
        this.canvas = canvas;
        this.width = 50;  // Plus large pour correspondre à l'image
        this.height = 25; // Plus haut pour correspondre à l'image
        this.minRoomSize = 3;
        this.maxRoomSize = 8;
    }

    generateDungeon() {
        // Initialiser avec de l'air
        this.canvas.map = Array(this.height).fill().map(() => 
            Array(this.width).fill().map(() => ({ type: 'air' }))
        );

        // Créer le sol principal
        for(let x = 0; x < this.width; x++) {
            this.canvas.map[20][x] = { type: 'grass' };
            for(let y = 21; y < this.height; y++) {
                this.canvas.map[y][x] = { type: 'dirt' };
            }
        }

        // Ajouter une colline
        this.createHill(25, 18, 15, 6);
        
        // Une seule plateforme
        this.createPlatform(5, 12, 8, 4);

        // Ajouter les arbres en dernier pour qu'ils soient au-dessus
        const treePositions = [
            { x: 20, y: 19 },
            { x: 15, y: 19 }
        ];

        treePositions.forEach(pos => {
            if (pos.x < this.width && pos.y < this.height) {
                // Make sure there's enough vertical space for the tree
                if (pos.y >= 3) {  // Check if there's room above for the full tree height
                    this.canvas.map[pos.y][pos.x] = { 
                        type: 'tree',
                        spriteX: MapModel.TILES.TREE[Math.floor(Math.random() * MapModel.TILES.TREE.length)].x,
                        spriteY: MapModel.TILES.TREE[0].y,
                        width: MapModel.TILES.TREE[0].width,
                        height: MapModel.TILES.TREE[0].height
                    };
                }
            }
        });
        
        // Forcer un rendu immédiat
        this.canvas.render();
    }

    createPlatform(x, y, width, height) {
        // Vérification des limites
        if (y + height > this.height || x + width > this.width) {
            console.error("Platform dimensions out of bounds");
            return;
        }

        // Coins
        this.canvas.map[y][x] = { type: 'platform_corner_top_left' };
        this.canvas.map[y][x + width - 1] = { type: 'platform_corner_top_right' };
        this.canvas.map[y + height - 1][x] = { type: 'platform_corner_bottom_left' };
        this.canvas.map[y + height - 1][x + width - 1] = { type: 'platform_corner_bottom_right' };

        // Bordures horizontales
        for(let i = 1; i < width - 1; i++) {
            this.canvas.map[y][x + i] = { type: 'platform_edge_top' };
            this.canvas.map[y + height - 1][x + i] = { type: 'platform_edge_bottom' };
        }

        // Bordures verticales
        for(let j = 1; j < height - 1; j++) {
            this.canvas.map[y + j][x] = { type: 'platform_edge_left' };
            this.canvas.map[y + j][x + width - 1] = { type: 'platform_edge_right' };
        }

        // Centre
        for(let i = 1; i < width - 1; i++) {
            for(let j = 1; j < height - 1; j++) {
                this.canvas.map[y + j][x + i] = { type: 'platform_center' };
            }
        }
    }

    createHill(x, baseY, width, height) {
        // Créer la forme de la colline
        for(let i = 0; i < width; i++) {
            const hillHeight = Math.sin((i / width) * Math.PI) * height;
            const yPos = Math.floor(baseY - hillHeight);
            
            for(let y = yPos; y < this.height; y++) {
                if (x + i < this.width) {
                    if (y === yPos) {
                        if (i === 0) {
                            this.canvas.map[y][x + i] = { 
                                type: 'grass_left',
                                spriteX: MapModel.TILES.GRASS_SIDE.LEFT.x,
                                spriteY: MapModel.TILES.GRASS_SIDE.LEFT.y
                            };
                        } else if (i === width - 1) {
                            this.canvas.map[y][x + i] = { 
                                type: 'grass_right',
                                spriteX: MapModel.TILES.GRASS_SIDE.RIGHT.x,
                                spriteY: MapModel.TILES.GRASS_SIDE.RIGHT.y
                            };
                        } else {
                            this.canvas.map[y][x + i] = { 
                                type: 'grass',
                                spriteX: MapModel.TILES.GRASS.x,
                                spriteY: MapModel.TILES.GRASS.y
                            };
                        }
                    } else {
                        this.canvas.map[y][x + i] = { 
                            type: 'dirt',
                            spriteX: MapModel.TILES.DIRT.x,
                            spriteY: MapModel.TILES.DIRT.y
                        };
                    }
                }
            }
        }
    }

    addDecorations() {
        // Ajouter des arbres
        for(let x = 0; x < this.width; x++) {
            if (Math.random() < 0.2) { // 20% de chance d'avoir une décoration
                if (this.canvas.map[14][x].type === 'air') {
                    // Sélectionner aléatoirement un des deux types d'arbres
                    const treeIndex = Math.floor(Math.random() * 2);
                    const treeData = MapModel.TILES.TREE[treeIndex];
                    
                    this.canvas.map[14][x] = { 
                        type: 'tree',
                        spriteX: treeData.x,
                        spriteY: treeData.y,
                        width: treeData.width,
                        height: treeData.height,
                        variant: treeIndex
                    };
                }
            }
        }
    }

    createRoom(x, y, width, height) {
        for(let i = y; i < y + height; i++) {
            for(let j = x; j < x + width; j++) {
                if (i >= 0 && i < this.height && j >= 0 && j < this.width) {
                    this.canvas.map[i][j] = { type: 'floor' };
                }
            }
        }
    }

    generateRooms() {
        const rooms = [];
        for(let i = 0; i < 5; i++) {
            const room = this.generateRoom();
            if(room) rooms.push(room);
        }
        return rooms;
    }

    generateRoom() {
        const width = Math.floor(Math.random() * (this.maxRoomSize - this.minRoomSize + 1)) + this.minRoomSize;
        const height = Math.floor(Math.random() * (this.maxRoomSize - this.minRoomSize + 1)) + this.minRoomSize;
        const x = Math.floor(Math.random() * (this.width - width - 2)) + 1;
        const y = Math.floor(Math.random() * (this.height - height - 2)) + 1;

        // Créer la pièce
        for(let dy = y; dy < y + height; dy++) {
            for(let dx = x; dx < x + width; dx++) {
                this.canvas.map[dy][dx] = { type: 'floor' };
            }
        }

        return { x, y, width, height };
    }

    connectRooms(rooms) {
        // Connecter chaque pièce avec la suivante
        for (let i = 0; i < rooms.length - 1; i++) {
            const roomA = rooms[i];
            const roomB = rooms[i + 1];
            
            // Points de départ et d'arrivée pour le corridor
            let x1 = Math.floor(roomA.x + roomA.width / 2);
            let y1 = Math.floor(roomA.y + roomA.height / 2);
            let x2 = Math.floor(roomB.x + roomB.width / 2);
            let y2 = Math.floor(roomB.y + roomB.height / 2);
            
            // Créer le corridor horizontal puis vertical
            while (x1 !== x2) {
                x1 += (x2 > x1) ? 1 : -1;
                this.canvas.map[y1][x1] = { type: 'floor' };
            }
            while (y1 !== y2) {
                y1 += (y2 > y1) ? 1 : -1;
                this.canvas.map[y1][x1] = { type: 'floor' };
            }
        }
    }

    addDoors(rooms) {
        rooms.forEach(room => {
            // Ajouter des portes aux bords des pièces
            for(let x = room.x; x < room.x + room.width; x++) {
                for(let y = room.y; y < room.y + room.height; y++) {
                    if(x === room.x || x === room.x + room.width - 1 ||
                       y === room.y || y === room.y + room.height - 1) {
                        if(Math.random() < 0.2) { // 20% de chance d'avoir une porte
                            this.canvas.map[y][x] = { type: 'door' };
                        }
                    }
                }
            }
        });
    }
}
