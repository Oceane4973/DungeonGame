package com.dungeongame.fight.dtos;

import java.io.Serializable;

public class QueueGold implements Serializable {
    String username;

    int gold;

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public int getGold() {
        return gold;
    }

    public void setGold(int gold) {
        this.gold = gold;
    }
}
