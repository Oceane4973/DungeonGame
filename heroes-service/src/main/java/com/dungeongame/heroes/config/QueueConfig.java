package com.dungeongame.heroes.config;

import com.dungeongame.heroes.dto.QueueHealthHero;
import com.dungeongame.heroes.queue.Receiver;
import com.dungeongame.heroes.queue.Sender;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.amqp.core.Binding;
import org.springframework.amqp.core.BindingBuilder;
import org.springframework.amqp.core.DirectExchange;
import org.springframework.amqp.core.Queue;
import org.springframework.amqp.support.converter.DefaultClassMapper;
import org.springframework.amqp.support.converter.DefaultJackson2JavaTypeMapper;
import org.springframework.amqp.support.converter.Jackson2JavaTypeMapper;
import org.springframework.amqp.support.converter.Jackson2JsonMessageConverter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.HashMap;
import java.util.Map;

@Configuration
public class QueueConfig {
    @Bean
    public Queue queueHeroesToFrontendHealth() {
        return new Queue("rabbitmq-heroes-to-frontend-health", true);
    }

    @Bean
    public Receiver receiver() {
        return new Receiver();
    }

    @Bean
    Sender sender() {
        return new Sender();
    }

    @Bean
    public DirectExchange heroesExchange() {
        return new DirectExchange("rabbitmq-heroes-exchange");
    }

    @Bean
    public Binding bindingHeroesToFrontendHealth(Queue queueHeroesToFrontendHealth, DirectExchange heroesExchange) {
        return BindingBuilder.bind(queueHeroesToFrontendHealth)
                .to(heroesExchange)
                .with("heroes.to.frontend.health");
    }

    @Bean
    public ObjectMapper getObjectMapper() {
        return new ObjectMapper();
    }

    @Bean
    public Jackson2JsonMessageConverter getConverter(@Autowired ObjectMapper objectMapper) {
        Jackson2JsonMessageConverter messageConverter = new Jackson2JsonMessageConverter(objectMapper);
        DefaultJackson2JavaTypeMapper typeMapper = new DefaultJackson2JavaTypeMapper();

        typeMapper.setTrustedPackages("*", "java.util", "java.lang");
        typeMapper.setTypePrecedence(Jackson2JavaTypeMapper.TypePrecedence.TYPE_ID);

        messageConverter.setJavaTypeMapper(typeMapper);
        messageConverter.setClassMapper(getClassMapper());
        return messageConverter;
    }

    @Bean
    public DefaultClassMapper getClassMapper() {
        DefaultClassMapper classMapper = new DefaultClassMapper();
        Map<String, Class<?>> map = new HashMap<>();
        map.put("com.dungeongame.fights.dto.QueueHealthHero", QueueHealthHero.class);
        classMapper.setIdClassMapping(map);
        return classMapper;
    }
}
