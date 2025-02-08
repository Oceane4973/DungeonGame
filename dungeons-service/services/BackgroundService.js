const fs = require('fs');
const path = require('path');

const BACKGROUNDS_DIR = path.join(__dirname, '../assets/backgrounds');

const API_PORT = process.env.SERVICE_DUNGEONS_PORT || 3000;
const API_URL = `http://${process.env.SERVICE_DUNGEONS_HOST || "localhost" }`;

const BASE_URL = `${API_URL}:${API_PORT}/api/images/backgrounds`;

/**
 * Sélectionne un dossier de background aléatoirement
 * @returns {string} Le nom du dossier sélectionné
 */
function getRandomBackgroundFolder() {
    const folders = fs.readdirSync(BACKGROUNDS_DIR).filter(file => 
        fs.statSync(path.join(BACKGROUNDS_DIR, file)).isDirectory()
    );

    if (folders.length === 0) {
        throw new Error("Aucun dossier de backgrounds trouvé !");
    }

    return folders[Math.floor(Math.random() * folders.length)];
}

/**
 * Récupère tous les layers du dossier sélectionné
 * @returns {Object} Un objet avec les layers classés
 */
function getDungeonBackground() {
    try {
        const selectedFolder = getRandomBackgroundFolder();
        const folderPath = path.join(BACKGROUNDS_DIR, selectedFolder);

        const files = fs.readdirSync(folderPath).filter(file => file.match(/^(\d+)_layer_/i));

        if (files.length === 0) {
            throw new Error(`Aucun fichier de layer trouvé dans ${selectedFolder}`);
        }

        const layers = {};

        files.forEach(file => {
            const match = file.match(/^(\d+)_layer_/i);
            if (match) {
                const layerNum = `layer${match[1]}`;
                layers[layerNum] = `${BASE_URL}/${selectedFolder}/${file}`;
            }
        });

        console.log(`✅ Background choisi: ${selectedFolder}`);
        return { folder: selectedFolder, layers };

    } catch (error) {
        console.error("❌ Erreur lors du chargement du background :", error);
        return null;
    }
}

module.exports = { getDungeonBackground };
