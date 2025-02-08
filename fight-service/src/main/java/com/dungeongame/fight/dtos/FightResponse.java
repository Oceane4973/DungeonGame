package com.dungeongame.fight.dtos;

public class FightResponse {
    private String winner;

    private String looser;

    private Integer heroHealth;

    public FightResponse(String winner, String looser, Integer heroHealth) {
        this.winner = winner;
        this.looser = looser;
        this.heroHealth = heroHealth;
    }

    public String getWinner() {
        return winner;
    }

    public Integer getHeroHealth(){
        return heroHealth;
    }

    public String getLooser() {
        return looser;
    }
}
