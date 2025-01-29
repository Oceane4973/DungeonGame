package com.dungeongame.fight.dtos;

public class FightResponse {
    private String winner;

    private String looser;

    public FightResponse(String winner, String looser) {
        this.winner = winner;
        this.looser = looser;
    }

    public String getWinner() {
        return winner;
    }

    public String getLooser() {
        return looser;
    }
}
