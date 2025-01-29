package com.dungeongame.fight.dtos;

public class FightBody {
    private int monsterHealth;
    private int monsterAttack;
    private int monsterLevel;

    private int heroHealth;
    private int heroAttack;
    private int heroLevel;

    private Long userId;

    public int getMonsterHealth() {
        return monsterHealth;
    }

    public void setMonsterHealth(int monsterHealth) {
        this.monsterHealth = monsterHealth;
    }

    public int getMonsterAttack() {
        return monsterAttack;
    }

    public int getMonsterLevel() {
        return monsterLevel;
    }

    public int getHeroHealth() {
        return heroHealth;
    }

    public void setHeroHealth(int heroHealth) {
        this.heroHealth = heroHealth;
    }

    public int getHeroLevel() {
        return heroLevel;
    }

    public int getHeroAttack() {
        return heroAttack;
    }

    public Long getUserId() {
        return userId;
    }
}