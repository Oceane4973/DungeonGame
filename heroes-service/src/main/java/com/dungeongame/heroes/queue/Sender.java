package com.dungeongame.heroes.queue;

import org.springframework.amqp.core.Queue;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class Sender {
    @Autowired
    private RabbitTemplate rabbitTemplate;

    public void sendQueueHeroesToFrontendHealth(Integer heroHealth) {
        rabbitTemplate.convertAndSend(
                "rabbitmq-heroes-exchange",
                "heroes.to.frontend.health",
                heroHealth);

        System.out.println(" [x] Sent " + heroHealth + " health to frontend");
    }
}
