package com.dungeongame.monsters.dto;

import java.util.List;

public class MonsterDTO {
    private String name;
    private Integer pv;
    private Integer attack;
    private Integer level;
    private List<SpriteDTO> sprites;

    // Constructeurs
    public MonsterDTO() {}

    // Getters et Setters
    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Integer getPv() {
        return pv;
    }

    public void setPv(Integer pv) {
        this.pv = pv;
    }

    public Integer getAttack() {
        return attack;
    }

    public void setAttack(Integer attack) {
        this.attack = attack;
    }

    public Integer getLevel() {
        return level;
    }

    public void setLevel(Integer level) {
        this.level = level;
    }

    public List<SpriteDTO> getSprites() {
        return sprites;
    }

    public void setSprites(List<SpriteDTO> sprites) {
        this.sprites = sprites;
    }
}
