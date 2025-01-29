
const API_PORT = process.env.SERVICE_DUNGEON_PORT || 3000;
const API_URL = `http://${process.env.SERVICE_DUNGEON_HOST || "localhost" }`;

const BASE_URL = `${API_URL}:${API_PORT}/api/images/cells`;

const Cell = {
    BARRIER_1: { name: "barrier-1.png", url: `${BASE_URL}/barrier-1.png` },
    BARRIER_2: { name: "barrier-2.png", url: `${BASE_URL}/barrier-2.png` },
    BARRIER_3: { name: "barrier-3.png", url: `${BASE_URL}/barrier-3.png` },
    BLUE_WATER: { name: "blue-water.png", url: `${BASE_URL}/blue-water.png` },
    BRIDGE_LEFT: { name: "bridge-left.png", url: `${BASE_URL}/bridge-left.png` },
    BRIDGE: { name: "bridge.png", url: `${BASE_URL}/bridge.png` },
    BRIDGE_RIGHT: { name: "bridge-right.png", url: `${BASE_URL}/bridge-right.png` },
    GROUND_STONE_2: { name: "gorund-stone-2.png", url: `${BASE_URL}/gorund-stone-2.png` },
    GRASS_1: { name: "grass-1.png", url: `${BASE_URL}/grass-1.png` },
    GRASS_2: { name: "grass-2.png", url: `${BASE_URL}/grass-2.png` },
    GRASS_3: { name: "grass-3.png", url: `${BASE_URL}/grass-3.png` },
    GREEN_WATER: { name: "green-water.png", url: `${BASE_URL}/green-water.png` },
    GROUND_BOTTOM_GRASS_1: { name: "ground-bottom-grass-1.png", url: `${BASE_URL}/ground-bottom-grass-1.png` },
    GROUND_FULL_1: { name: "ground-full-1.png", url: `${BASE_URL}/ground-full-1.png` },
    GROUND_FULL_2: { name: "ground-full-2.png", url: `${BASE_URL}/ground-full-2.png` },
    GROUND_FULL_3: { name: "ground-full-3.png", url: `${BASE_URL}/ground-full-3.png` },
    GROUND_SIDE_1: { name: "ground-side-1.png", url: `${BASE_URL}/ground-side-1.png` },
    GROUND_STONE_1: { name: "ground-stone-1.png", url: `${BASE_URL}/ground-stone-1.png` },
    GROUND_STONE_2: { name: "ground-stone-2.png", url: `${BASE_URL}/ground-stone-2.png` },
    GROUND_TOP_LEFT: { name: "ground-top-left.png", url: `${BASE_URL}/ground-top-left.png` },
    GROUND_TOP: { name: "ground-top.png", url: `${BASE_URL}/ground-top.png` },
    GROUND_TOP_RIGHT: { name: "ground-top-right.png", url: `${BASE_URL}/ground-top-right.png` },
    GROUND_LEFT: { name: "ground-left.png", url: `${BASE_URL}/ground-left.png` },
    GROUND_RIGHT: { name: "ground-right.png", url: `${BASE_URL}/ground-right.png` },
    GROUND_BOTTOM_LEFT: { name: "ground-bottom-left.png", url: `${BASE_URL}/ground-bottom-left.png` },
    GROUND_BOTTOM: { name: "ground-bottom.png", url: `${BASE_URL}/ground-bottom.png` },
    GROUND_BOTTOM_RIGHT: { name: "ground-bottom-right.png", url: `${BASE_URL}/ground-bottom-right.png` },
    LADDER: { name: "ladder.png", url: `${BASE_URL}/ladder.png` },
    MUSHROOM_1: { name: "mushroom-1.png", url: `${BASE_URL}/mushroom-1.png` },
    MUSHROOM_2: { name: "mushroom-2.png", url: `${BASE_URL}/mushroom-2.png` },
    MUSHROOM_3: { name: "mushroom-3.png", url: `${BASE_URL}/mushroom-3.png` },
    MUSHROOM_4: { name: "mushroom-4.png", url: `${BASE_URL}/mushroom-4.png` },
    MUSHROOM_5: { name: "mushroom-5.png", url: `${BASE_URL}/mushroom-5.png` },
    RED_WATER: { name: "red-water.png", url: `${BASE_URL}/red-water.png` },
    ROCK_1: { name: "rock-1.png", url: `${BASE_URL}/rock-1.png` },
    ROCK_2: { name: "rock-2.png", url: `${BASE_URL}/rock-2.png` },
    STONE_BARRIER_1: { name: "stone-barrier-1.png", url: `${BASE_URL}/stone-barrier-1.png` },
    STONE_BARRIER_2: { name: "stone-barrier-2.png", url: `${BASE_URL}/stone-barrier-2.png` },
    STONE_BARRIER_3: { name: "stone-barrier-3.png", url: `${BASE_URL}/stone-barrier-3.png` },
    TREE_1: { name: "tree-1.png", url: `${BASE_URL}/tree-1.png` },
    TREE_2: { name: "tree-2.png", url: `${BASE_URL}/tree-2.png` }
};

module.exports = Cell;
