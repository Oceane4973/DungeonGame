package com.dungeongame.user.queue;

import com.dungeongame.user.dtos.QueueGold;
import com.dungeongame.user.service.UserService;
import org.springframework.amqp.rabbit.annotation.RabbitHandler;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.util.StopWatch;

@RabbitListener(queues = "user-gold")
public class Receiver {
    @Autowired
    private UserService userService;

    @RabbitHandler
    public void receive(QueueGold in) throws InterruptedException {
        StopWatch watch = new StopWatch();
        watch.start();
        System.out.println("[x] Received " + in.getGold() + " for user " + in.getUsername());

        userService.updateGold(in);
    }
}
