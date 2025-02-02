package com.dungeongame.fights.controller;

import com.dungeongame.fights.dto.FightBody;
import com.dungeongame.fights.dto.FightResponse;
import com.dungeongame.fights.dto.QueueGold;
import com.dungeongame.fights.dto.QueueHealthHero;
import com.dungeongame.fights.queue.Sender;
import com.dungeongame.fights.service.FightService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Objects;

@RestController
@RequestMapping("/api/fights")
@CrossOrigin(origins = "*", maxAge = 3600)
public class FightController {

    @Autowired
    private Sender sender;

    @Autowired
    private FightService fightService;

    @PostMapping("/")
    public ResponseEntity<?> fight(@RequestBody FightBody fight) {
        try {
            FightResponse response = fightService.fight(fight);

            if (Objects.equals(response.getWinner(), "hero")) {
                QueueGold queueGold = new QueueGold();
                queueGold.setGold(5);
                queueGold.setUsername(fight.getUsername());

                sender.sendQueueFightsToUserGold(queueGold);
            }

            QueueHealthHero queueHealthHero = new QueueHealthHero();
            queueHealthHero.setHeroId(fight.getHeroId());
            queueHealthHero.setHeroHealth(fight.getHeroHealth());

            sender.sendQueueFightsToHeroesHealth(queueHealthHero);

            return ResponseEntity.ok(fightService.fight(fight));
        } catch (Exception e) {
            return ResponseEntity
                    .status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("An error occurred during fight");
        }
    }
}
