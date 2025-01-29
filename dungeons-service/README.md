# Dungeons service - API Documentation

## Introduction
Cette API permet de générer des **donjons aléatoires** avec des **matrices de cellules** préalablement crée et stockés, des **backgrounds dynamiques**, et des **assets**.  
Elle expose différentes routes pour récupérer les **images**, **les matrices**, et **les backgrounds**.  

---

## Installation et configuration

### Installer les dépendances
```bash
npm install
```

### Configurer les variables d'environnement
Crée un fichier `.env` à la racine du projet :
```ini
API_URL=http://localhost
API_PORT=3005
```

### Démarrer l'API
```bash
npm start
```
L'API tournera sur `http://localhost:3005` (ou le port défini dans `.env`).

---

## Endpoints de l'API

### 1. Récupérer un donjon aléatoire  
```http
GET /api/dungeons
```
**Description** :  
- Génère une **matrice aléatoire** de cellules (`dungeon`).
- Sélectionne **un background aléatoire** (`background`).
- Retourne **une liste unique d'assets** pour minimiser les requêtes.

**Réponse JSON** :
```json
{
  "message": "ok",
  "assets": {
    "GRASS_1": "http://localhost:3005/api/images/cells/grass-1.png",
    "GRASS_2": "http://localhost:3005/api/images/cells/grass-2.png",
    "TREE_1": "http://localhost:3005/api/images/cells/tree-1.png",
    "TREE_2": "http://localhost:3005/api/images/cells/tree-2.png",
    "STONE_BARRIER_1": "http://localhost:3005/api/images/cells/stone-barrier-1.png",
    "STONE_BARRIER_2": "http://localhost:3005/api/images/cells/stone-barrier-2.png",
    "GROUND_STONE_1": "http://localhost:3005/api/images/cells/ground-stone-1.png",
    "GROUND_STONE_2": "http://localhost:3005/api/images/cells/ground-stone-2.png"
  },
  "background": {
    "folder": "Cave",
    "layers": {
      "layer1": "http://localhost:3005/api/images/backgrounds/Cave/1_layer_Cave.png",
      "layer2": "http://localhost:3005/api/images/backgrounds/Cave/2_layer_Cave.png",
      "layer3": "http://localhost:3005/api/images/backgrounds/Cave/3_layer_Cave.png",
      "layer4": "http://localhost:3005/api/images/backgrounds/Cave/4_layer_Cave.png"
    }
  },
  "dungeon": [
    [
      "GRASS_1",
      "GRASS_1",
      "GRASS_2",
      "GRASS_2"
    ],
    [
      "GRASS_1",
      "TREE_1",
      "TREE_2",
      "GRASS_2"
    ],
    [
      "STONE_BARRIER_1",
      "STONE_BARRIER_2",
      "GROUND_STONE_1",
      "GROUND_STONE_2"
    ]
  ]
}
```

---

### 2. Récupérer une image de **background**
```http
GET /api/images/backgrounds/{dossier}/{nomImage}
```
📌 **Exemple** :  
```http
GET /api/images/backgrounds/castle/1_layer_Castle.png
```
📌 **Réponse** : L'image est servie directement.

---

### 3. Récupérer une image de **cellule**
```http
GET /api/images/cells/{nomImage}
```
📌 **Exemple** :
```http
GET /api/images/cells/tree-1.png
```
📌 **Réponse** : L'image est servie directement.

---

## Comment ajouter un nouveau donjon ?  

### Étape 1 : Ajouter une **nouvelle matrice** dans `/assets/matrices/`
Crée un fichier `.json` dans `assets/matrices/` :
```json
[
  ["GRASS_1", "TREE_1", "STONE_BARRIER_1"],
  ["GRASS_2", "GROUND_STONE_1", "TREE_2"]
]
```
L'API détectera automatiquement ce fichier lors du chargement.

---
