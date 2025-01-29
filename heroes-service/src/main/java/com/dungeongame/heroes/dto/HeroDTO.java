package com.dungeongame.heroes.dto;

import lombok.Data;

@Data
public class HeroDTO {
    private Long userId;
    private String name;
    private int level;
    private int attack;
    private int healthPoints;
    private Long headId;
    private Long bodyId;

    public Long getUserId() {
        return userId;
    }

    public String getName() {
        return name;
    }

    public int getLevel() {
        return level;
    }

    public int getAttack() {
        return attack;
    }

    public int getHealthPoints() {
        return healthPoints;
    }

    public Long getHeadId() {
        return headId;
    }

    public Long getBodyId() {
        return bodyId;
    }
}
