package com.dungeongame.fights.queue;

import com.dungeongame.fights.dto.QueueGold;
import com.dungeongame.fights.dto.QueueHealthHero;
import org.springframework.amqp.core.Queue;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class Sender {
    @Autowired
    private RabbitTemplate rabbitTemplate;

    public String sendQueueFightsToUserGold(QueueGold queueGold) {
        rabbitTemplate.convertAndSend(
                "rabbitmq-fights-exchange",
                "fights.to.users.gold",
                queueGold);
        return " [x] Sent " + queueGold.getGold() + " gold to user " + queueGold.getUsername();
    }

    public String sendQueueFightsToHeroesHealth(QueueHealthHero queueHealthHero) {
        rabbitTemplate.convertAndSend(
                "rabbitmq-fights-exchange",
                "fights.to.heroes.health",
                queueHealthHero);
        return " [x] Sent " + queueHealthHero.getHeroHealth() + " health to hero " + queueHealthHero.getHeroId();
    }
}
