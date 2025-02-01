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

    public String sendQueueUsersToFrontendGold(String userGold) {
        rabbitTemplate.convertAndSend(queueUsersToFrontendGold.getName(), userGold);
        return " [x] Sent " + userGold + " gold to frontend";
    }
}
