const fs = require('fs');
const path = require('path');

const MATRIX_DIR = path.join(__dirname, '../assets/dungeons');

const Matrix = {};

const matrixFiles = fs.readdirSync(MATRIX_DIR).filter(file => file.endsWith('.json'));

if (matrixFiles.length === 0) {
    console.warn("⚠️ Aucun fichier JSON trouvé dans le dossier matrices !");
}

matrixFiles.forEach(file => {
    const matrixName = path.basename(file, '.json').toUpperCase();
    const matrixPath = path.join(MATRIX_DIR, file);

    try {
        const matrixData = JSON.parse(fs.readFileSync(matrixPath, 'utf8'));
        Matrix[matrixName] = matrixData;
        console.log(`✅ Matrice chargée: ${matrixName}`);
    } catch (err) {
        console.error(`❌ Erreur lors du chargement de ${file}:`, err);
    }
});

/**
 * Fonction pour obtenir une matrice aléatoire
 * @returns {Object} La matrice choisie au hasard
 */
Matrix.getRandomMatrix = function () {
    if (matrixFiles.length === 0) {
        console.error("❌ Aucune matrice disponible !");
        return null;
    }

    const randomFile = matrixFiles[Math.floor(Math.random() * matrixFiles.length)];
    const matrixName = path.basename(randomFile, '.json').toUpperCase();
    
    return Matrix[matrixName]; 
};

module.exports = Matrix;
