package com.dungeongame.heroes.queue;

import org.springframework.amqp.core.Queue;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class Sender {
    @Autowired
    private RabbitTemplate rabbitTemplate;

    @Autowired
    private Queue queueHeroesToFrontendHealth;

    public String sendQueueHeroesToFrontendHealth(String heroHealth) {
        rabbitTemplate.convertAndSend(queueHeroesToFrontendHealth.getName(), heroHealth);
        return " [x] Sent " + heroHealth + " health to frontend";
    }
}
