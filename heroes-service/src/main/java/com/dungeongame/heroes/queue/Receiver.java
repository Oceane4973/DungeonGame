package com.dungeongame.heroes.queue;

import com.dungeongame.heroes.dto.QueueHealthHero;
import com.dungeongame.heroes.service.HeroService;
import org.springframework.amqp.rabbit.annotation.RabbitHandler;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.util.StopWatch;

@RabbitListener(queues = "health-hero")
public class Receiver {
    @Autowired
    private HeroService heroService;

    @RabbitHandler
    public void receive(QueueHealthHero in) {
        StopWatch watch = new StopWatch();
        watch.start();
        System.out.println("[x] Received " + in.getHeroHealth() + " health for hero " + in.getHeroId());

        heroService.updateHealthHero(in);
    }
}
