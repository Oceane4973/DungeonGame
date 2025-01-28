package com.dungeongame.heroes.config;

import com.dungeongame.heroes.model.Head;
import com.dungeongame.heroes.model.Sprite;
import com.dungeongame.heroes.model.SpriteSet;
import com.dungeongame.heroes.repository.HeadRepository;
import com.dungeongame.heroes.repository.SpriteSetRepository;
import com.dungeongame.heroes.repository.SpriteRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.io.File;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Configuration
public class DatabaseInitializer {

    @Value("${app.images.head-dir}")
    private String headDir;

    @Bean
    CommandLineRunner initDatabase(HeadRepository headRepository, SpriteSetRepository spriteSetRepository,
            SpriteRepository spriteRepository) {
        return args -> {
            File directory = new File(headDir);
            if (!directory.exists() || !directory.isDirectory()) {
                throw new IllegalArgumentException("Invalid head directory: " + headDir);
            }

            Map<Long, SpriteSet> spriteSetsByHeadId = new HashMap<>();

            // Parcourir tous les fichiers du répertoire
            for (File file : directory.listFiles()) {
                if (!file.isFile() || !file.getName().endsWith(".png"))
                    continue;

                // Extraire les informations du nom de fichier
                String fileName = file.getName();
                String[] parts = fileName.split("-");

                if (parts.length < 3 || !parts[0].startsWith("sprite"))
                    continue;

                try {
                    // Extraire les métadonnées à partir du nom du fichier
                    Long headId = Long.parseLong(parts[0].substring(6)); // sprite<id>
                    String direction = parts[1]; // left, right, back, front
                    int state = Integer.parseInt(parts[2].split("x")[0]); // état du sprite

                    // Valider les données
                    if (!List.of("left", "right", "back", "front").contains(direction) || state < 1 || state > 3) {
                        continue;
                    }

                    // Créer l'objet Sprite
                    Sprite sprite = new Sprite(fileName, file.getAbsolutePath(), headDir + "/" + fileName);
                    // Sauvegarder le sprite
                    Sprite savedSprite = spriteRepository.save(sprite);

                    // Ajouter le sprite dans le SpriteSet correspondant
                    spriteSetsByHeadId.putIfAbsent(headId,
                            new SpriteSet(new ArrayList<>(), new ArrayList<>(), new ArrayList<>(), new ArrayList<>()));

                    switch (direction) {
                        case "left" -> spriteSetsByHeadId.get(headId).getLeft().add(savedSprite);
                        case "right" -> spriteSetsByHeadId.get(headId).getRight().add(savedSprite);
                        case "back" -> spriteSetsByHeadId.get(headId).getBack().add(savedSprite);
                        case "front" -> spriteSetsByHeadId.get(headId).getFront().add(savedSprite);
                    }
                } catch (NumberFormatException ex) {
                    // Ignorer les fichiers avec des noms mal formatés
                    System.err.println("Ignoring file with invalid format: " + fileName);
                }
            }

            // Sauvegarder les SpriteSet et créer les entités Head
            spriteSetsByHeadId.forEach((headId, spriteSet) -> {
                // Sauvegarder le SpriteSet
                SpriteSet savedSpriteSet = spriteSetRepository.save(spriteSet);

                // Associer le SpriteSet sauvegardé à un Head
                Head head = Head.builder()
                        .sprites(savedSpriteSet) // Associer le SpriteSet sauvegardé
                        .build();
                headRepository.save(head);
            });

            System.out.println("Heads and sprites have been successfully loaded into the database.");
        };
    }

}
