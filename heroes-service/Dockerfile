FROM maven:3.9.9-eclipse-temurin-17-alpine AS builder

WORKDIR /app

COPY . .

RUN mvn install -DskipTests

EXPOSE 8081

ENTRYPOINT ["mvn", "spring-boot:run", "-DskipTests"]