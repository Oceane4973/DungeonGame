# Monsters service - API Documentation

## Introduction

Cette API permet de gérer le service des monstres dans le jeu.

## Routes

Ce service propose les routes suivantes :

- **GET** `api/monsters`
    - *Réponse*
        - **200** : Une liste JSON contenant tous les monstres
        - **500** : `An error occurred while fetching monsters`

- **GET** `api/monsters/{name}`
    - *Paramètres de chemin* :
        - `name` : Le nom du monstre à récupérer
    - *Réponse*
        - **200** : Un JSON contenant les informations du monstre
        - **404** : `Monster not found` si le monstre n'existe pas
        - **500** : `An error occurred while fetching the monster`

- **GET** `api/monsters/images/{imageName}`
    - *Paramètres de chemin* :
        - `imageName` : Le nom de l'image du sprite du monstre à récupérer
    - *Réponse*
        - **200** : L'image du sprite du monstre
        - **404** : `Image not found` si l'image n'existe pas
        - **500** : `An error occurred while fetching the image`

- **GET** `api/monsters/random/{nb}`
    - *Paramètres de chemin* :
        - `nb` : Le nombre de monstres à récupérer de manière aléatoire
    - *Réponse*
        - **200** : Une liste JSON contenant des monstres aléatoires
        - **500** : `An error occurred while fetching random monsters`
