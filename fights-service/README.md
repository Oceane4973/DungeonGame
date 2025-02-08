# Fights service - API Documentation

## Introduction

Cette API permet de gérer le service de combat.

## Routes

Ce service propose les routes suivantes :
- **POST** `api/fights`
    - *Headers*
        - `Content-Type` : `application/json`
    - *Body*
        - `monsterHealth` : Les points de vie du monstre
        - `monsterAttack` : L'attaque du monstre
        - `monsterLevel` : Le niveau du monstre
        - `heroHealth` : Les points de vie du héros
        - `heroAttack` : L'attaque du héros
        - `heroLevel` : Le niveau du héros
        - `heroId` : L'identifiant du héros
        - `username` : Le nom d'utilisateur de l'utilisateur lié au héros
    - *Réponse*
        - **200** : Un JSON avec les informations du combat (gagnant et perdant)
        - **500** : Erreur interne
