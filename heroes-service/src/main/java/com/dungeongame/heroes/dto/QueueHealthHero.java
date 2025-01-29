package com.dungeongame.heroes.dto;

import java.io.Serializable;

public class QueueHealthHero implements Serializable {
    private Long heroId;

    private int heroHealth;

    public Long getHeroId() {
        return heroId;
    }

    public void setHeroId(Long heroId) {
        this.heroId = heroId;
    }

    public int getHeroHealth() {
        return heroHealth;
    }

    public void setHeroHealth(int heroHealth) {
        this.heroHealth = heroHealth;
    }
}
