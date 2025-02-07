package com.dungeongame.fights.service;

import com.dungeongame.fights.dto.FightBody;
import com.dungeongame.fights.dto.FightResponse;
import org.springframework.stereotype.Service;

import java.util.Random;

@Service
public class FightService {
    private final Random random = new Random();

    public FightResponse fight(FightBody fight) {

        while (fight.getHeroHealth() > 0 || fight.getMonsterHealth() > 0) {
            int heroDamage = calculateDamage(fight.getHeroAttack(), fight.getHeroLevel());
            int monsterDamage = calculateDamage(fight.getMonsterAttack(), fight.getMonsterLevel());

            fight.setMonsterHealth(fight.getMonsterHealth() - heroDamage);
            fight.setHeroHealth(fight.getHeroHealth() - monsterDamage);
        }

        if (fight.getMonsterHealth() <= fight.getHeroHealth()) {
            return new FightResponse("hero", "monster", fight.getHeroHealth());
        } else {
            return new FightResponse("monster", "hero", fight.getHeroHealth());
        }
    }

    private int calculateDamage(int attack, int level) {
        double randomMultiplier = 0.2 + (0.6 - 0.2) * random.nextDouble();
        return (int) (attack * level * randomMultiplier);
    }
}