# Stage 1: Build
FROM maven:3.9.9-eclipse-temurin-17-alpine AS builder

WORKDIR /app

# Copier d'abord le pom.xml pour optimiser le cache des dépendances
COPY pom.xml .
COPY .mvn .mvn
COPY mvnw .
COPY mvnw.cmd .

# Télécharger les dépendances
RUN mvn dependency:go-offline

# Copier le reste du code source
COPY src src

# Builder l'application
RUN mvn clean package -DskipTests

# Stage 2: Runtime
FROM openjdk:17-jdk-slim

WORKDIR /app

# Copier le JAR depuis le stage de build
COPY --from=builder /app/target/*.jar app.jar

# Copier les ressources nécessaires
COPY src/main/resources/assets /app/src/main/resources/assets

EXPOSE 8080

ENTRYPOINT ["java", "-jar", "app.jar"]