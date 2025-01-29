const express = require('express');
const path = require('path');
const fs = require('fs');

const router = express.Router();

router.use('/backgrounds', express.static(path.join(__dirname, '../assets/backgrounds')));
router.use('/cells', express.static(path.join(__dirname, '../assets/cells')));

router.get('/backgrounds/*', (req, res) => {
    const imagePath = path.join(__dirname, '../assets', req.path);

    if (!fs.existsSync(imagePath)) {
        return res.status(404).json({ error: 'Image non trouvée' });
    }

    res.sendFile(imagePath);
});

router.get('/cells/:imageName', (req, res) => {
    const { imageName } = req.params;
    const imagePath = path.join(__dirname, '../assets/cells', imageName);

    if (!fs.existsSync(imagePath)) {
        return res.status(404).json({ error: 'Image non trouvée' });
    }

    res.sendFile(imagePath);
});

module.exports = router;
