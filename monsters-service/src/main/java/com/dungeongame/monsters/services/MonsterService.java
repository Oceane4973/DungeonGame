package com.dungeongame.monsters.services;

import com.dungeongame.monsters.dto.MonsterDTO;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.core.io.Resource;
import org.springframework.core.io.FileSystemResource;
import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Value;
import jakarta.annotation.PostConstruct;
import java.io.File;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Map;
import java.util.List;
import java.util.ArrayList;
import java.util.Random;
import java.util.HashMap;
import java.util.stream.Collectors;
import com.dungeongame.monsters.model.MonsterSprite;

@Service
public class MonsterService {
    
    @Value("${monsters.assets.path}")
    private String assetsPath;
    
    private final ObjectMapper objectMapper = new ObjectMapper();
    private Map<String, MonsterDTO> monsters = new HashMap<>();

    // Charge les monstres depuis le JSON au démarrage
    @PostConstruct
    public void init() {
        try {
            System.out.println("Initializing MonsterService...");
            System.out.println("Assets path: " + assetsPath);
            
            // Vérifier le contenu du dossier sprites
            File spritesDir = new File(assetsPath + "/sprites");
            System.out.println("Sprites directory exists: " + spritesDir.exists());
            if (spritesDir.exists()) {
                System.out.println("Contenu du dossier sprites:");
                for (File file : spritesDir.listFiles()) {
                    System.out.println(" - " + file.getName());
                }
            }
            
            File jsonFile = new File(assetsPath + "/monsters.json");
            System.out.println("Loading monsters from: " + jsonFile.getAbsolutePath());
            System.out.println("File exists: " + jsonFile.exists());
            
            List<MonsterDTO> monstersList = objectMapper.readValue(jsonFile, 
                new TypeReference<List<MonsterDTO>>() {});
            
            System.out.println("Loaded " + monstersList.size() + " monsters");
            
            for (MonsterDTO monster : monstersList) {
                System.out.println("Processing monster: " + monster.getName());
                monsters.put(monster.getName(), monster);
            }
        } catch (Exception e) {
            System.err.println("Error during initialization: ");
            e.printStackTrace();
            throw new RuntimeException("Error loading monsters configuration: " + e.getMessage(), e);
        }
    }
    
    public List<MonsterDTO> getAllMonsters() {
        return new ArrayList<>(monsters.values());
    }
    
    public MonsterDTO getMonster(String name) {
        MonsterDTO monster = monsters.get(name);
        if (monster == null) {
            throw new RuntimeException("Monster not found: " + name);
        }
        return monster;
    }
    
    public Resource getMonsterImage(String name) {
        System.out.println("Getting image for monster: " + name);
        MonsterDTO monster = getMonster(name);
        try {
            if (monster.getSprites() != null && !monster.getSprites().isEmpty()) {
                String imagePath = monster.getSprites().get(0).getImagePath();
                System.out.println("Original imagePath: " + imagePath);
                
                // Extract just the filename from the path
                String fileName = imagePath.substring(imagePath.lastIndexOf("/") + 1);
                System.out.println("File name: " + fileName);
                
                // Construct the full path using the sprites path
                File file = new File(assetsPath + "sprites/" + fileName);
                System.out.println("Full path: " + file.getAbsolutePath());
                
                Resource resource = new FileSystemResource(file);
                System.out.println("Resource exists: " + resource.exists());
                
                if (resource.exists()) {
                    return resource;
                }
            }
            System.out.println("No sprites found for monster: " + name);
            throw new RuntimeException("Monster image not found: " + name);
        } catch (Exception e) {
            System.err.println("Error getting monster image: ");
            e.printStackTrace();
            throw new RuntimeException("Error loading monster image: " + name, e);
        }
    }

    public List<MonsterDTO> getRandomMonsters(int nb) {
        List<MonsterDTO> allMonsters = new ArrayList<>(monsters.values());
        
        if (nb > allMonsters.size()) {
            nb = allMonsters.size();
        }
        
        List<Integer> indices = new ArrayList<>();
        for (int i = 0; i < allMonsters.size(); i++) {
            indices.add(i);
        }
        
        Random random = new Random();
        List<MonsterDTO> randomMonsters = new ArrayList<>();
        
        for (int i = 0; i < nb; i++) {
            int randomIndex = random.nextInt(indices.size());
            int selectedIndex = indices.remove(randomIndex);
            randomMonsters.add(allMonsters.get(selectedIndex));
        }
        
        return randomMonsters;
    }

    public Resource getMonsterSprite(Long monsterId, Long spriteId) {
        System.out.println("Getting sprite " + spriteId + " for monster ID: " + monsterId);
        
        MonsterDTO monster = monsters.values().stream()
            .filter(m -> m.getId().equals(monsterId))
            .findFirst()
            .orElseThrow(() -> new RuntimeException("Monster not found with ID: " + monsterId));

        try {
            MonsterSprite sprite = monster.getSprites().stream()
                .filter(s -> s.getId().equals(spriteId))
                .findFirst()
                .orElseThrow(() -> new RuntimeException("Sprite not found with ID: " + spriteId));

            String fileName = sprite.getName();
            System.out.println("Loading sprite: " + fileName);
            
            File file = new File(assetsPath + "sprites/" + fileName);
            System.out.println("Full path: " + file.getAbsolutePath());
            
            Resource resource = new FileSystemResource(file);
            System.out.println("Resource exists: " + resource.exists());
            
            if (resource.exists()) {
                return resource;
            }
            
            throw new RuntimeException("Sprite file not found: " + fileName);
        } catch (Exception e) {
            System.err.println("Error getting monster sprite: ");
            e.printStackTrace();
            throw new RuntimeException("Error loading monster sprite", e);
        }
    }
}
