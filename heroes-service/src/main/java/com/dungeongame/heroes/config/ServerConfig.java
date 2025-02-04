package com.dungeongame.heroes.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;

@Configuration
public class ServerConfig {

    @Value("${service.heroes.host:localhost}")
    private String host = "localhost";

    @Value("${service.heroes.port:8083}")
    private int port = 8083;

    public String getServerUrl() {
        return String.format("http://%s:%s", host, port);
    }
}