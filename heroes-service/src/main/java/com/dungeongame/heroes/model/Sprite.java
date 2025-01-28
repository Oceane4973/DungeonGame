package com.dungeongame.heroes.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Sprite {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private String url;
    private String imagePath;

    public Sprite(String name, String url, String imagePath) {
        this.name = name;
        this.url = url;
        this.imagePath = imagePath;
    }
}
