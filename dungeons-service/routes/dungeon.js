const express = require('express');
const Matrix = require('../services/MatrixService');
const Cell = require('../models/cell')
const { getDungeonBackground } = require('../services/BackgroundService.js');
const router = express.Router();

router.get('/', (req, res) => {
    const randomMatrix = Matrix.getRandomMatrix();
    const background = getDungeonBackground();

    if (!randomMatrix || !background) {
        return res.status(500).json({ error: "Aucune matrice trouvée" });
    }

    const assets = {};

    randomMatrix.flat().forEach(cellType => {
        if (!assets[cellType] && Cell[cellType]) {
            assets[cellType] = Cell[cellType].url;
        }
    });

    return res.status(200).json({
        message: "ok",
        assets: assets,
        background : background,
        dungeon: randomMatrix
    });
});


module.exports = router;
