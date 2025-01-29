package com.donjon.controllers;

import com.donjon.dto.MonsterDTO;
import com.donjon.services.MonsterService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
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

    @GetMapping("/{name}/image")
    public ResponseEntity<Resource> getMonsterImage(@PathVariable String name) {
        Resource image = monsterService.getMonsterImage(name);
        return ResponseEntity.ok()
            .contentType(MediaType.IMAGE_PNG)
            .body(image);
    }

    @GetMapping("/random/{nb}")
    public ResponseEntity<List<MonsterDTO>> getRandomMonsters(@PathVariable int nb) {
        return ResponseEntity.ok(monsterService.getRandomMonsters(nb));
    }
}
