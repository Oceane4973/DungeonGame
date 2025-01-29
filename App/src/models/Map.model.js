export default class MapModel {
    static TILES = {
        GRASS: {
            x: 310,
            y: 224,
            width: 32,
            height: 32
        },
        DIRT: {
            x: 310,
            y: 234,
            width: 32,
            height: 32
        },
        TREE: [
            {
                x: 65,
                y: 95,
                width: 32,
                height: 96,
                mushrooms: false
            },
            {
                x: 65,
                y: 95,
                width: 32,
                height: 96,
                mushrooms: false
            }
        ],
        PLATFORM: {
            CORNER: {
                TOP_LEFT: { x: 304, y: 224, width: 32, height: 32 },
                TOP_RIGHT: { x: 320, y: 224, width: 32, height: 32 },
                BOTTOM_LEFT: { x: 304, y: 240, width: 32, height: 32 },
                BOTTOM_RIGHT: { x: 320, y: 240, width: 32, height: 32 }
            },
            EDGE: {
                LEFT: { x: 304, y: 233, width: 32, height: 32 },
                RIGHT: { x: 320, y: 233, width: 32, height: 32 },
                TOP: { x: 310, y: 224, width: 32, height: 32 },
                BOTTOM: { x: 310, y: 240, width: 32, height: 32 }
            },
            CENTER: { x: 310, y: 234, width: 32, height: 32 }
        },
        GRASS_SIDE: {
            LEFT: { x: 304, y: 224, width: 32, height: 32 },
            RIGHT: { x: 320, y: 224, width: 32, height: 32 }
        }
    };
}


// const map1 = {
//     cells : {
//         grass : { url : "http://localhost:3000/assets/tiles/grass.png" },
//         anthill : { url : "http://localhost:3000/assets/tiles/anthill.png" },
//         tree : { url : "http://localhost:3000/assets/tiles/tree.png" },
//     }, 
//     map : [
//         [Cell.Anthill, Cell.grass, Cell.grass],
//         [Cell.grass, Cell.grass, Cell.grass],
//         [Cell.grass, Cell.grass, Cell.grass],
//         [Cell.grass, Cell.grass, Cell.grass],
//         [Cell.grass, Cell.grass, Cell.tree],
//     ]
// }


// const map = [
//     [Cell.Anthill, Cell.grass, Cell.grass],
//     [Cell.grass, Cell.grass, Cell.grass],
//     [Cell.grass, Cell.grass, Cell.grass],
//     [Cell.grass, Cell.grass, Cell.grass],
//     [Cell.grass, Cell.grass, Cell.tree],
//     [Cell.grass, Cell.grass, Cell.grass],
//     [Cell.grass, Cell.grass, Cell.grass],
// ]