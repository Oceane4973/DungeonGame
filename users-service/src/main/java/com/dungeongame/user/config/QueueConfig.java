package com.dungeongame.user.config;

import com.dungeongame.user.queue.Receiver;
import org.springframework.amqp.core.Queue;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class QueueConfig {
    @Bean
    public Queue userGoldQueue() {
        return new Queue("user-gold");
    }

    @Bean
    public Receiver receiver() {
        return new Receiver();
    }
}
