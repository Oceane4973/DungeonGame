# Heroes service - API Documentation

## Introduction
Cette API permet de gérer les héros (`Hero`), leurs composants (`Head`, `Body`) et leurs sprites (`SpriteSet`).  
Elle fournit également des endpoints pour récupérer des images associées.

## Routes API

### Héros (`/api/heroes`)

### 🔹 Récupérer tous les **Heads**
```http
GET /api/heroes/heads
```
**Description** : Récupère la liste de toutes les têtes (`Head`) disponibles.

**Paramètres** : Aucun  
**Réponse** (JSON) :
```json
[
    {
        "id": 1,
        "sprites": { 
            "id": 10, 
            "front": [...], 
            "back": [...], 
            "left": [...], 
            "right": [...] 
        }
    }
]
```

---

### 🔹 Récupérer tous les **Bodies**
```http
GET /api/heroes/bodies
```
**Description** : Récupère la liste de tous les corps (`Body`) disponibles.

**Paramètres** : Aucun  
**Réponse** (JSON) :
```json
[
    {
        "id": 1,
        "sprites": { 
            "id": 15, 
            "front": [...], 
            "back": [...], 
            "left": [...], 
            "right": [...]
        }
    }
]
```

---

### 🔹 Récupérer un héros par **ID**
```http
GET /api/heroes/heroById?id={heroId}
```
**Description** : Récupère les informations d'un héros spécifique par son **ID**.

 **Paramètres** :  
| Nom      | Type   | Requis | Description |
|----------|--------|--------|-------------|
| `id`     | `Long` | ✅     | ID du héros |

**Réponse** (JSON) :
```json
{
    "id": 1,
    "userId": 2,
    "name": "HeroName",
    "level": 10,
    "attack": 50,
    "healthPoints": 100,
    "sprites": { 
        "id": 25, 
        "front": [...], 
        "back": [...], 
        "left": [...], 
        "right": [...]
    }
}
```

---

### 🔹 Créer un nouveau héros
```http
POST /api/heroes/hero
```
**Description** : Crée un héros avec les informations fournies.

 **Corps de la requête** (JSON) :
```json
{
    "userId": 1,
    "name": "HeroName",
    "level": 10,
    "attack": 50,
    "healthPoints": 100,
    "headId": 1,
    "bodyId": 1
}
```
**Réponse** (JSON) :
```json
{
    "id": 5,
    "userId": 1,
    "name": "HeroName",
    "level": 10,
    "attack": 50,
    "healthPoints": 100,
    "sprites": { 
        "id": 30, 
        "front": [...], 
        "back": [...], 
        "left": [...], 
        "right": [...]
    }
}
```

---

### 🔹 Supprimer un héros par **ID**
```http
DELETE /api/heroes/hero?id={heroId}
```
**Description** : Supprime un héros de la base de données.

 **Paramètres** :
| Nom   | Type   | Requis | Description  |
|-------|--------|--------|--------------|
| `id`  | `Long` | ✅     | ID du héros à supprimer |

**Réponse** : Code `204 No Content` en cas de succès.

---

### 🔹 Récupérer tous les héros d'un utilisateur
```http
GET /api/heroes/heroByUserId?userId={userId}
```
**Description** : Récupère tous les héros appartenant à un utilisateur spécifique.

 **Paramètres** :
| Nom      | Type   | Requis | Description |
|----------|--------|--------|-------------|
| `userId` | `Long` | ✅     | ID de l'utilisateur |

**Réponse** (JSON) :
```json
[
    {
        "id": 1,
        "userId": 1,
        "name": "Hero1",
        "level": 5,
        "attack": 20,
        "healthPoints": 80,
        "sprites": { 
            "id": 21, 
            "front": [...], 
            "back": [...], 
            "left": [...], 
            "right": [...]
        }
    },
    {
        "id": 2,
        "userId": 1,
        "name": "Hero2",
        "level": 8,
        "attack": 35,
        "healthPoints": 120,
        "sprites": { 
            "id": 22, 
            "front": [...], 
            "back": [...], 
            "left": [...], 
            "right": [...]
        }
    }
]
```

---

### Images (`/api/images`)

### 🔹 Récupérer une image spécifique
```http
GET /api/images/{type}/{fileName}
```
**Description** : Récupère une image spécifique stockée sur le serveur.

 **Paramètres** :
| Nom       | Type   | Requis | Description                           |
|-----------|--------|--------|---------------------------------------|
| `type`    | `String` | ✅   | Type d'image (`head`, `body`, `hero`) |
| `fileName` | `String` | ✅  | Nom du fichier image                 |

**Réponse** : Fichier image correspondant.

**Exemple d'utilisation** :
```http
GET /api/images/hero/hero1-front-1-32x36.png
```

**Réponse** :
- `200 OK` : Image affichée.
- `404 Not Found` : L'image n'existe pas.
- `500 Internal Server Error` : Problème de serveur.

---

## Environnements et Configurations

L'API utilise les variables de configuration suivantes :
| Variable                     | Description                                | Exemple                        |
|------------------------------|--------------------------------------------|--------------------------------|
| `app.images.hero-dir`        | Dossier contenant les sprites des héros    | `/path/to/hero/sprites/`       |
| `app.images.head-dir`        | Dossier contenant les sprites des têtes    | `/path/to/head/sprites/`       |
| `app.images.body-dir`        | Dossier contenant les sprites des corps    | `/path/to/body/sprites/`       |

---

## Exemples de Requêtes `curl`

### 🔹 Créer un héros
```bash
curl -X POST "http://localhost:8081/api/heroes/hero" \
-H "Content-Type: application/json" \
-d '{
    "userId": 1,
    "name": "HeroName",
    "level": 10,
    "attack": 50,
    "healthPoints": 100,
    "headId": 1,
    "bodyId": 1
}'
```

### 🔹 Supprimer un héros
```bash
curl -X DELETE "http://localhost:8081/api/heroes/hero?id=1"
```

### 🔹 Récupérer une image
```bash
curl -X GET "http://localhost:8081/api/images/hero/hero1-front-1-32x36.png"
```

## Configuration de PostgreSQL

### 1. Installer PostgreSQL (si ce n'est pas déjà fait)

Sur Ubuntu :
``` bash
sudo apt update
sudo apt install postgresql postgresql-contrib
```

Vérifier le statut du service PostgreSQL :
```bash
sudo systemctl status postgresql
```

### 2. Se connecter à PostgreSQL
Connectez-vous au shell PostgreSQL avec l'utilisateur par défaut (postgres) :

```bash
sudo -u postgres psql
```
Une fois dans le shell psql, vous pouvez exécuter des commandes SQL.

### 3. Créer une base de données et un utilisateur
Créez une base de données pour votre projet (par exemple, dungeon_game) et un utilisateur avec des permissions associées.

Commandes SQL pour PostgreSQL :
```sql
-- Créer une base de données
CREATE DATABASE dungeon_game_heroes;

-- Créer un utilisateur avec un mot de passe
CREATE USER dungeon_user WITH PASSWORD 'password';

-- Donner les droits à cet utilisateur sur la base de données
GRANT ALL PRIVILEGES ON DATABASE dungeon_game_heroes TO dungeon_user;
```

GRANT USAGE ON SCHEMA public TO dungeon_user;
GRANT CREATE ON SCHEMA public TO dungeon_user;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO dungeon_user;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO dungeon_user;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO dungeon_user;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO dungeon_user;

ALTER ROLE dungeon_user CREATEDB;


Pour quitter psql, tapez :

```bash
\q
```

Redemarre postgres

```bash
sudo systemctl restart postgresql
```

### 4. Configurer Spring Boot pour PostgreSQL
Ajoutez la configuration de connexion dans votre fichier `src/main/java/resources/application.properties`.

Exemple de fichier application.properties :
```properties
spring.datasource.url=jdbc:postgresql://localhost:5432/dungeon_game_heroes
spring.datasource.username=dungeon_user
spring.datasource.password=password
spring.datasource.driver-class-name=org.postgresql.Driver

# Options pour Hibernate (JPA)
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
spring.jpa.properties.hibernate.format_sql=true
ddl-auto=update : Permet de générer ou mettre à jour automatiquement les tables dans la base (utile pour le développement).
show-sql=true : Affiche les requêtes SQL générées dans la console.

```

### 5. Redémarrer votre application
Lancez votre application avec Maven ou votre IDE :

```bash
mvn spring-boot:run
```

Si tout est bien configuré, Spring Boot se connectera automatiquement à votre base de données, et les entités (comme Head, Hero, etc.) seront mappées en tables dans la base.

## Configuration Docker

Pour démarrer les conteneurs Docker associés à ce projet, suivre ces étapes :
- Se positionner dans le dossier racine
- Démarrer les conteneurs avec la commande `docker compose up -d --build`
- Vérifier que les conteneurs sont fonctionnels
  - Lister les conteneurs avec la commande `docker ps`
  - Se rendre sur `http://localhost` et vérifier que la page d'accueil s'affiche
