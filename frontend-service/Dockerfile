FROM node:23-bullseye-slim

WORKDIR /app

# Copier et installer les dépendances racine
COPY package*.json ./
RUN npm install

# Copier et installer les dépendances de l'app
COPY app/package*.json ./app/
WORKDIR /app/app
RUN npm install

# Ajouter la dépendance manquante
RUN npm install --save-dev @babel/plugin-proposal-private-property-in-object

# Copier le reste des fichiers
WORKDIR /app
COPY . .

EXPOSE 8080

WORKDIR /app/app

# Nettoyer le cache npm et réinstaller react-scripts localement
RUN npm cache clean --force && \
    npm uninstall -g react-scripts && \
    npm install react-scripts

# Définir le port explicitement
ENV PORT=8080
ENV DISABLE_ESLINT_PLUGIN=true

CMD ["npm", "start"]
