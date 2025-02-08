# Users service - API Documentation

## Introduction

Cette API permet de gérer le service utilisateurs.

## Routes

Ce service propose les routes suivantes :
- **POST** `api/auth/signup`
  - *Headers*
    - `Content-Type` : `application/json`
  - *Body*
    - `username` : L'identifiant de l'utilisateur
    - `password` : Le mot de passe de l'utilisateur
  - *Réponse*
    - **200** : Un JSON avec les informations de l'utilisateur
  - *Erreur*
    - **400** : `Username is already in use`
    - **500** : `An error occurred during user registration`
- **POST** `api/auth/signin`
  - *Headers*
    - `Content-Type` : `application/json`
  - *Body*
    - `username` : L'identifiant de l'utilisateur
    - `password` : Le mot de passe de l'utilisateur
  - *Réponse*
    - **200** : Le JWT de l'utilisateur est renvoyé
  - *Erreur*
    - **401** : `Invalid username or password`
- **GET** `api/users/me`
  - *Headers*
    - `Content-Type` : `application/json`
    - `Authorization` : `Bearer Token`
  - *Réponse*
    - **200** : Les informations de l'utilisateur sont renvoyées
