package com.dungeongame.fight.dtos;

import java.io.Serializable;

public class QueueHero implements Serializable {
    Integer id;

    Integer health;

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public Integer getHealth() {
        return health;
    }

    public void setHealth(int health) {
        this.health = health;
    }
}
