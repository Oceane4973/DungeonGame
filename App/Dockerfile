FROM nginx:alpine

# Copier les fichiers du projet dans le répertoire de nginx
COPY . /usr/share/nginx/html/

# Configurer nginx pour gérer les modules ES6
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
