package com.dungeongame.monsters.controllers;

import com.dungeongame.monsters.dto.MonsterDTO;
import com.dungeongame.monsters.services.MonsterService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
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

    @GetMapping("/random/{nb}")
    public ResponseEntity<List<MonsterDTO>> getRandomMonsters(@PathVariable int nb) {
        return ResponseEntity.ok(monsterService.getRandomMonsters(nb));
    }

    @GetMapping("/{monsterId}/{spriteId}")
    public ResponseEntity<Resource> getMonsterSprite(
            @PathVariable Long monsterId,
            @PathVariable Long spriteId) {
        try {
            Resource image = monsterService.getMonsterSprite(monsterId, spriteId);
            if (image != null && image.exists()) {
                return ResponseEntity.ok()
                    .contentType(MediaType.IMAGE_PNG)
                    .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"" + image.getFilename() + "\"")
                    .body(image);
            }
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().build();
        }
    }
}
