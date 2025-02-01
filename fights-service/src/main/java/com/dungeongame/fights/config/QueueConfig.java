package com.dungeongame.fights.config;

import com.dungeongame.fights.queue.Sender;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.amqp.core.Queue;
import org.springframework.amqp.support.converter.Jackson2JsonMessageConverter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class QueueConfig {
    @Bean
    public Queue queueFightsToUsersGold() {
        return new Queue("rabbitmq-fights-to-user-gold");
    }

    @Bean
    public Queue queueFightsToHeroHealth() {
        return new Queue("rabbitmq-fights-to-heroes-health");
    }

    @Bean
    public Sender sender() {
        return new Sender();
    }

    @Bean
    public ObjectMapper getObjectMapper() {
        return new ObjectMapper();
    }

    @Bean
    public Jackson2JsonMessageConverter getConverter(@Autowired ObjectMapper objectMapper) {
        return new Jackson2JsonMessageConverter(objectMapper);
    }
}
