package com.dungeongame.monsters.model;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class MonsterSprite {
    private Long id;
    private String name;
    private String imagePath;

    public MonsterSprite(String name, String imagePath) {
        this.name = name;
        this.imagePath = imagePath;
    }
}