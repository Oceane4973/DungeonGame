package com.dungeongame.heroes.controller;

import com.dungeongame.heroes.dto.HeroDTO;
import com.dungeongame.heroes.model.*;
import com.dungeongame.heroes.service.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/heroes")
@CrossOrigin(origins = "http://localhost:8080")
public class HeroController {

    @Autowired
    private HeroService heroService;

    @Autowired
    private HeadService headService;

    @Autowired
    private BodyService bodyService;

    @GetMapping("/heads")
    public List<Head> getAllHeads() {
        return headService.getAllHeads();
    }

    @GetMapping("/bodies")
    public List<Body> getAllBodies() {
        return bodyService.getAllBodies();
    }

    @GetMapping("/heroById")
    public Hero getHeroById(@RequestParam Long id) {
        return heroService.getHeroById(id);
    }

    @PostMapping("/hero")
    public ResponseEntity<Hero> createHero(@RequestBody HeroDTO heroDTO) {
        Hero createdHero = heroService.createHero(heroDTO);
        return ResponseEntity.ok(createdHero);
    }

    @DeleteMapping("/hero")
    public void deleteHero(@RequestParam Long id) {
        heroService.deleteHero(id);
    }

    @GetMapping("/heroByUserId")
    public List<Hero> getAllHeroesByUserId(@RequestParam Long userId) {
        return heroService.getAllHeroesByUserId(userId);
    }
}
