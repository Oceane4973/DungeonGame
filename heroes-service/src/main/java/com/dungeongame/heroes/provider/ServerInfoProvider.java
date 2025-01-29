package com.dungeongame.heroes.provider;

import org.springframework.core.env.Environment;
import org.springframework.stereotype.Component;
import java.net.InetAddress;
import java.net.UnknownHostException;

@Component
public class ServerInfoProvider {

    private final Environment environment;

    public ServerInfoProvider(Environment environment) {
        this.environment = environment;
    }

    public String getHost() {
        try {
            return InetAddress.getLocalHost().getHostAddress();
        } catch (UnknownHostException e) {
            return "Unknown Host";
        }
    }

    public String getPort() {
        return environment.getProperty("server.port", "8080");
    }

    public String getServerUrl() {
        return "http://" + getHost() + ":" + getPort();
    }
}
