package com.dungeongame.heroes.config;

import com.dungeongame.heroes.model.Sprite;
import com.dungeongame.heroes.model.SpriteSet;
import com.dungeongame.heroes.model.Head;
import com.dungeongame.heroes.model.Body;
import com.dungeongame.heroes.repository.SpriteRepository;
import com.dungeongame.heroes.repository.SpriteSetRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.jpa.repository.JpaRepository;

import java.io.File;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Configuration
public class DatabaseInitializer {

    @Value("${app.images.api-url}")
    private String baseUrl;

    @Value("${app.images.head-dir}")
    private String headDir;

    @Value("${app.images.body-dir}")
    private String bodyDir;

    @Bean
    CommandLineRunner initDatabase(
            JpaRepository<Head, Long> headRepository,
            JpaRepository<Body, Long> bodyRepository,
            SpriteSetRepository spriteSetRepository,
            SpriteRepository spriteRepository) {
        return args -> {
            // Initialiser les Head
            initializeEntities("head", headDir, headRepository, spriteSetRepository, spriteRepository, Head.class);

            // Initialiser les Body
            initializeEntities("body", bodyDir, bodyRepository, spriteSetRepository, spriteRepository, Body.class);

            System.out.println("Heads and Bodies with sprites have been successfully loaded into the database.");
        };
    }

    private <T> void initializeEntities(
            String entityType,
            String directoryPath,
            JpaRepository<T, Long> entityRepository,
            SpriteSetRepository spriteSetRepository,
            SpriteRepository spriteRepository,
            Class<T> entityClass) {

        File directory = new File(directoryPath);
        if (!directory.exists() || !directory.isDirectory()) {
            throw new IllegalArgumentException("Invalid " + entityType + " directory: " + directoryPath);
        }

        Map<Long, SpriteSet> spriteSetsByEntityId = new HashMap<>();

        for (File file : directory.listFiles()) {
            if (!file.isFile() || !file.getName().endsWith(".png"))
                continue;

            String fileName = file.getName();
            String[] parts = fileName.split("-");

            if (parts.length < 3 || !parts[0].startsWith("sprite"))
                continue;

            try {
                Long entityId = Long.parseLong(parts[0].substring(6));
                String direction = parts[1];
                int state = Integer.parseInt(parts[2].split("x")[0]);

                if (!List.of("left", "right", "back", "front").contains(direction) || state < 1 || state > 3) {
                    continue;
                }

                Sprite sprite = new Sprite(fileName, this.baseUrl + entityType + "/" + fileName,
                        directoryPath + "/" + fileName);
                Sprite savedSprite = spriteRepository.save(sprite);

                spriteSetsByEntityId.putIfAbsent(entityId,
                        new SpriteSet(new ArrayList<>(), new ArrayList<>(), new ArrayList<>(), new ArrayList<>()));

                switch (direction) {
                    case "left" -> spriteSetsByEntityId.get(entityId).getLeft().add(savedSprite);
                    case "right" -> spriteSetsByEntityId.get(entityId).getRight().add(savedSprite);
                    case "back" -> spriteSetsByEntityId.get(entityId).getBack().add(savedSprite);
                    case "front" -> spriteSetsByEntityId.get(entityId).getFront().add(savedSprite);
                }
            } catch (NumberFormatException ex) {
                System.err.println("Ignoring file with invalid format: " + fileName);
            }
        }

        spriteSetsByEntityId.forEach((entityId, spriteSet) -> {
            SpriteSet savedSpriteSet = spriteSetRepository.save(spriteSet);

            try {
                // Créer une instance de l'entité (Head ou Body) dynamiquement
                T entity = entityClass.getDeclaredConstructor().newInstance();
                entityClass.getMethod("setSprites", SpriteSet.class).invoke(entity, savedSpriteSet);

                entityRepository.save(entity);
            } catch (Exception e) {
                throw new RuntimeException("Error creating entity of type " + entityClass.getName(), e);
            }
        });
    }
}
