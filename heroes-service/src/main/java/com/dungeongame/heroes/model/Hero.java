package com.dungeongame.heroes.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.*;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Hero {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull
    private Long userId;

    @NotBlank
    private String name;

    @Min(1)
    private int level;

    @Min(0)
    private int attack;

    @Min(0)
    private int healthPoints;

    @NotNull
    private String imagePath;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "head_id")
    private Head head;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "body_id")
    private Body body;

    @OneToOne(fetch = FetchType.EAGER, cascade = CascadeType.ALL, orphanRemoval = true)
    @JoinColumn(name = "sprite_set_id")
    private SpriteSet sprites;

}
