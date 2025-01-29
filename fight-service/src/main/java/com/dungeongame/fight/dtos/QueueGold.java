package com.dungeongame.fight.dtos;

import java.io.Serializable;

public class QueueGold implements Serializable {
    Long userId;

    int gold;

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public int getGold() {
        return gold;
    }

    public void setGold(int gold) {
        this.gold = gold;
    }
}
