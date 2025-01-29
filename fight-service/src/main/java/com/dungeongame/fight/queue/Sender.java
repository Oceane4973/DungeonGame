package com.dungeongame.fight.queue;

import com.dungeongame.fight.dtos.QueueGold;
import com.dungeongame.fight.dtos.QueueHealthHero;
import org.springframework.amqp.core.Queue;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class Sender {
    @Autowired
    private RabbitTemplate rabbitTemplate;

    @Autowired
    private Queue goldUserQueue;

    @Autowired
    private Queue healthHeroQueue;

    public String sendGold(QueueGold queueGold) {
        rabbitTemplate.convertAndSend(goldUserQueue.getName(), queueGold);
        return " [x] Sent " + queueGold.getGold() + " gold to user " + queueGold.getUsername();
    }

    public String updateHealth(QueueHealthHero queueHealthHero) {
        rabbitTemplate.convertAndSend(healthHeroQueue.getName(), queueHealthHero);
        return " [x] Sent " + queueHealthHero.getHeroHealth() + " health to hero " + queueHealthHero.getHeroId();
    }
}
