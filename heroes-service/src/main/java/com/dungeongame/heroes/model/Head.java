package com.dungeongame.heroes.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Data
@NoArgsConstructor
@Builder
public class Head {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.EAGER)
    private SpriteSet sprites;

    public Head(Long id, SpriteSet sprites) {
        this.id = id;
        this.sprites = sprites;
    }

    public SpriteSet getSprites() {
        return this.sprites;
    }
}
