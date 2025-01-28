package com.dungeongame.heroes.service;

import com.dungeongame.heroes.model.Hero;
import com.dungeongame.heroes.repository.HeroRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class HeroService {

    @Autowired
    private HeroRepository heroRepository;

    public List<Hero> getAllHeroesByUserId(Long userId) {
        return heroRepository.findByUserId(userId);
    }

    public Hero getHeroById(Long id) {
        return heroRepository.findById(id).orElse(null);
    }

    public Hero createHero(Hero hero) {
        return heroRepository.save(hero);
    }

    public void deleteHero(Long id) {
        heroRepository.deleteById(id);
    }
}
