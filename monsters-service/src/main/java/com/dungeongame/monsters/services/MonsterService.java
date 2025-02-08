package com.dungeongame.monsters.services;

import com.dungeongame.monsters.dto.MonsterDTO;
import com.dungeongame.monsters.dto.SpriteDTO;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Value;
import jakarta.annotation.PostConstruct;
import java.io.File;
import java.util.Map;
import java.util.List;
import java.util.ArrayList;
import java.util.Random;
import java.util.stream.Collectors;

@Service
public class MonsterService {

    @Value("${MONSTERS_HOST}")
    private String monstersHost;

    @Value("${monsters.assets.path}")
    private String assetsPath;

    private final ObjectMapper objectMapper = new ObjectMapper();
    private Map<String, MonsterDTO> monsters;

    // Charge les monstres depuis le JSON au démarrage
    @PostConstruct
    public void init() {
        try {
            File jsonFile = new File(assetsPath + "monsters.json");
            monsters = objectMapper.readValue(jsonFile,
                    new TypeReference<Map<String, MonsterDTO>>() {
                    });

            monsters.values().forEach(monster -> {
                List<SpriteDTO> updatedSprites = monster.getSprites().stream()
                        .map(sprite -> {
                            SpriteDTO spriteDTO = new SpriteDTO();
                            spriteDTO.setName(sprite.getName());
                            spriteDTO.setImagePath(sprite.getImagePath());
                            spriteDTO.setUrl(monstersHost + sprite.getUrl());
                            return spriteDTO;
                        })
                        .collect(Collectors.toList());
                monster.setSprites(updatedSprites);
            });
        } catch (Exception e) {
            throw new RuntimeException("Error loading monsters configuration", e);
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
}
