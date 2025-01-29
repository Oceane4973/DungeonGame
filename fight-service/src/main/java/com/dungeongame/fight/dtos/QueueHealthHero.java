package com.dungeongame.fight.dtos;

public class QueueHealthHero {
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
