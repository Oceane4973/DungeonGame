package com.dungeongame.heroes;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import java.io.File;

@SpringBootApplication
public class HeroesServiceApplication implements CommandLineRunner {

    @Value("${app.images.head-dir}")
    private String headDir;

    @Value("${app.images.body-dir}")
    private String bodyDir;

    @Value("${app.images.hero-dir}")
    private String heroDir;

    public static void main(String[] args) {
        SpringApplication.run(HeroesServiceApplication.class, args);
    }

    @Override
    public void run(String... args) {
        createDirectory(bodyDir);
        createDirectory(headDir);
        createDirectory(heroDir);
    }

    private void createDirectory(String dir) {
        File directory = new File(dir);
        if (!directory.exists()) {
            directory.mkdirs();
            System.out.println("Répertoire créé : " + directory.getAbsolutePath());
        }
    }
}
