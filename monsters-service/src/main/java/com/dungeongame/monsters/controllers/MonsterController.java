package com.dungeongame.monsters.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ClassPathResource;
import org.springframework.core.io.Resource;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.dungeongame.monsters.dto.MonsterDTO;
import com.dungeongame.monsters.services.MonsterService;

import io.jsonwebtoken.io.IOException;

import java.util.List;

@RestController
@RequestMapping("/api/monsters")
public class MonsterController {

    @Autowired
    private MonsterService monsterService;

    @GetMapping
    public ResponseEntity<List<MonsterDTO>> getAllMonsters() {
        return ResponseEntity.ok(monsterService.getAllMonsters());
    }

    @GetMapping("/{name}")
    public ResponseEntity<MonsterDTO> getMonster(@PathVariable String name) {
        return ResponseEntity.ok(monsterService.getMonster(name));
    }

    @GetMapping("/images/{imageName}")
    public ResponseEntity<Resource> getMonsterSprite(@PathVariable String imageName) {
        try {
            // Accéder à l'image dans le dossier resources/assets/monsters/
            Resource image = new ClassPathResource("assets/monsters/" + imageName);

            if (image.exists() && image.isReadable()) {
                return ResponseEntity.ok()
                        .contentType(MediaType.IMAGE_PNG)
                        .body(image);
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (IOException e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    @GetMapping("/random/{nb}")
    public ResponseEntity<List<MonsterDTO>> getRandomMonsters(@PathVariable int nb) {
        return ResponseEntity.ok(monsterService.getRandomMonsters(nb));
    }
}
