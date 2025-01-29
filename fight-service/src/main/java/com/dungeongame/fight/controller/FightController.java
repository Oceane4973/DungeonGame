package com.dungeongame.fight.controller;

import com.dungeongame.fight.dtos.FightBody;
import com.dungeongame.fight.dtos.FightResponse;
import com.dungeongame.fight.dtos.QueueGold;
import com.dungeongame.fight.queue.Sender;
import com.dungeongame.fight.service.FightService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Objects;

@RestController
@RequestMapping("/api/fight")
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
                queueGold.setUserId(fight.getUserId());

                sender.sendGold(queueGold);
            }
            return ResponseEntity.ok(fightService.fight(fight));
        } catch (Exception e) {
            return ResponseEntity
                    .status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("An error occurred during fight");
        }
    }
}
