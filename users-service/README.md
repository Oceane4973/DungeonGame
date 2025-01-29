# Service Users

Ce service permet de gérer la connexion utilisateur au jeu de donjon.

## Installation

Pour installer ce projet, suivre ces étapes :
- Copier le fichier `src/main/resources/application.example.properties`
- Le coller en tant que `src/main/resources/application.example.properties`
- Remplacer les variables d'environnement par les valeurs de production
    - `{{DB_HOST}}` : L'hôte qui héberge la base de données
    - `{{DB_PORT}}` : Le port de la base de données
    - `{{DB_NAME}}` : Le nom de la base de données utilisée
    - `{{DB_USERNAME}}` : L'utilisateur qui se connecte à la base de données
    - `{{DB_PASSWORD}}` : Le mot de l'utilisateur
    - `{{SECRET_KEY}}` : Le secret utilisé pour générer les JWT
    - `{{TIME_EXPIRATION}}` : La durée de validité du token

> Génération du secret
> 
> Pour générer le secret, vous pouvez utiliser la commande `openssl rand -base64 32`.

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

---

#### Liens utiles

- [Implémenter JWT dans application Spring boot - medium.com](https://medium.com/@tericcabrel/implement-jwt-authentication-in-a-spring-boot-3-application-5839e4fd8fac)