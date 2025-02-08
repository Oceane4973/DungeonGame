package com.dungeongame.fights.service;

import com.dungeongame.fights.dto.FightBody;
import com.dungeongame.fights.dto.FightResponse;
import org.springframework.stereotype.Service;

import java.util.Random;

@Service
public class FightService {
    private final Random random = new Random();

    public FightResponse fight(FightBody fight) {
        while (fight.getHeroHealth() > 0 && fight.getMonsterHealth() > 0) {
            int heroDamage = fight.getHeroAttack() * fight.getHeroLevel();
            int monsterDamage = fight.getMonsterAttack() * fight.getMonsterLevel();

            fight.setMonsterHealth(Math.max(fight.getMonsterHealth() - heroDamage, 0));
            fight.setHeroHealth(Math.max(fight.getHeroHealth() - monsterDamage, 0));
        }

        if (fight.getHeroHealth() == 0) {
            return new FightResponse("monster", "hero");
        } else {
            return new FightResponse("hero", "monster");
        }
    }
}
