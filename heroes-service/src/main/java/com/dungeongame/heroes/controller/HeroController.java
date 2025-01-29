package com.dungeongame.heroes.controller;

import com.dungeongame.heroes.dto.HeroDTO;
import com.dungeongame.heroes.model.*;
import com.dungeongame.heroes.service.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/heroes")
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
    public Hero createHero(@RequestBody HeroDTO herodto) {
        return heroService.createHero(herodto);
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
