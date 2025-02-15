package com.dungeongame.users.queue;

import org.springframework.amqp.core.Queue;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class Sender {
    @Autowired
    private RabbitTemplate rabbitTemplate;

    @Autowired
    private Queue queueUsersToFrontendGold;

    public void sendQueueUsersToFrontendGold(String userGold) {
        rabbitTemplate.convertAndSend(
                "rabbitmq-users-exchange",
                "users.to.frontend.gold",
                userGold);
        System.out.println("[x] Sent " + userGold + " gold to frontend");
    }
}
