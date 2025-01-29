package com.dungeongame.fight.config;

import com.dungeongame.fight.queue.Sender;
import io.micrometer.observation.transport.SenderContext;
import org.springframework.amqp.core.Queue;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class QueueConfig {
    @Bean
    public Queue goldUserQueue() {
        return new Queue("gold-user");
    }

    @Bean
    public Sender sender() {
        return new Sender();
    }
}
