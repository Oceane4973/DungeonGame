const express = require('express');
const path = require('path');

const app = express();

// Configuration du type MIME pour les modules ES6
app.use((req, res, next) => {
    if (req.url.endsWith('.js')) {
        res.type('application/javascript');
    }
    next();
});

// Servir les fichiers statiques du répertoire racine
app.use(express.static(path.join(__dirname, '..'), {
    setHeaders: (res, path) => {
        if (path.endsWith('.js')) {
            res.setHeader('Content-Type', 'application/javascript');
        }
    }
}));

// Route principale
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../index.html'));
});

// Gestion des erreurs 404
app.use((req, res) => {
    res.status(404).send('Page not found');
});

// Export de l'app sans la démarrer
module.exports = app; 