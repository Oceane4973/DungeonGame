package com.dungeongame.monsters.dto;

import java.util.List;
import com.dungeongame.monsters.model.MonsterSprite;

public class MonsterDTO {
    private Long id;
    private String name;
    private Integer pv;
    private Integer attack;
    private Integer level;
    private List<MonsterSprite> sprites;

    // Constructeur par défaut
    public MonsterDTO() {}

    // Getters et Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

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

    public List<MonsterSprite> getSprites() {
        return sprites;
    }

    public void setSprites(List<MonsterSprite> sprites) {
        this.sprites = sprites;
    }
}
