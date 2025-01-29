# DungeonGame : Jeu sur Navigateur avec Architecture Micro-Services

## Description du Projet

Ce projet a pour but de créer un jeu sur navigateur en utilisant une architecture basée sur des micro-services. Le concept principal du jeu est simple : 

- L’utilisateur peut créer des héros et visualiser une liste complète des héros disponibles.
- Après avoir choisi ou créé un héros, celui-ci peut être envoyé dans un donjon.
- Le but du jeu est de terminer le donjon en atteignant sa destination finale.

> Pour plus de détails :
>
> Il est possible d'accéder au cahier des charges en ce rendant au [lien](https://docs.google.com/document/d/1Eci92m6q-oKlKMv--bAx6Pk5aolsxWc57Y1MMQFHlyA/edit?tab=t.0) suivant
> 
### Fonctionnalités principales

1. **Gestion des héros :**
   - Création de héros avec des caractéristiques spécifiques (PV, niveau, caractéristiques de combat, inventaire, or, etc.).
   - Liste des héros disponibles visible lors de la connexion.

2. **Donjons :**
   - Donjons générés ou prédéfinis au moment où le héros entre dedans.
   - Donjons linéaires ou avec embranchements.
   - Chaque case du donjon peut contenir un combat.

3. **Système de combat :**
   - Un combat se termine lorsque les PV d'un des participants atteignent 0.

## Contraintes Techniques

1. **Architecture Micro-Services :**
   - Le projet doit être réalisé avec une approche micro-service.
   - Une première étape consiste à fournir un schéma représentant l’architecture des micro-services.

2. **Technologies Utilisées :**
   - **Backend :** Spring Boot (recommandé pour sa simplicité).
   - **Base de données :** Minimum une technologie de base de données.
   - **File d’attente :** Minimum une technologie de file d’attente.

3. **Frontend :**
   - Peut être textuel ou visuel (aucune obligation de créer un jeu 2D ou 3D).
   - Doit être exécutable localement pour interagir avec les services.

4. **Livraison :**
   - Le code doit être déposé dans un repository public sur GitHub.
   - Un fichier `docker-compose` est attendu pour faciliter le déploiement.

## Cas d'utilisation

- Je veux créer mon compte utilisateur
- Je veux me connecter à mon compte utilisateur
- Je veux récupérer la liste des héros existants
- Je veux créer un héros personnalisé et non modifiable
- Je veux créer un nouvel héros avec mon or
- Je veux choisir mon héros
- Je veux rentrer dans un donjon
- Je veux me déplacer dans le donjon selon des touches génériques
- Je veux tuer des monstres et gagner de l'or
- Je veux aller au donjon suivant
- Je veux sortir du donjon
- Je veux supprimer mon héros

## Architecture du logiciel

### Architecture du backend

![Capture d’écran du 2025-01-27 12-14-22](https://github.com/user-attachments/assets/2bb26c44-61c1-4b06-ab75-d6e612d650c4)

## Démarrage du projet

Pour démarrer le projet, suivre ces étapes :
- Configurer les différents services en suivant les étapes définis dans le README
- Démarrer les conteneurs avec la commande `docker compose up -d`