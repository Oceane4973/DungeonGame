package com.dungeongame.fight.service;

import com.dungeongame.fight.dtos.FightBody;
import com.dungeongame.fight.dtos.FightResponse;
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

        if (fight.getMonsterHealth() <= 0) {
            return new FightResponse("hero", "monster");
        } else {
            return new FightResponse("hero", "monster");
        }
    }

    private int calculateDamage(int attack, int level) {
        double randomMultiplier = 0.8 + (1.2 - 0.8) * random.nextDouble();
        return (int) (attack * level * randomMultiplier);
    }
}