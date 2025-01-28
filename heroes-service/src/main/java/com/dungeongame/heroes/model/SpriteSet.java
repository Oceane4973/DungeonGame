package com.dungeongame.heroes.model;

import jakarta.persistence.*;
import lombok.*;
import java.util.List;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class SpriteSet {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToMany(fetch = FetchType.EAGER)
    @JoinTable(name = "sprite_set_front", joinColumns = @JoinColumn(name = "sprite_set_id"), inverseJoinColumns = @JoinColumn(name = "sprite_id"))
    private List<Sprite> front;

    @ManyToMany(fetch = FetchType.EAGER)
    @JoinTable(name = "sprite_set_back", joinColumns = @JoinColumn(name = "sprite_set_id"), inverseJoinColumns = @JoinColumn(name = "sprite_id"))
    private List<Sprite> back;

    @ManyToMany(fetch = FetchType.EAGER)
    @JoinTable(name = "sprite_set_left", joinColumns = @JoinColumn(name = "sprite_set_id"), inverseJoinColumns = @JoinColumn(name = "sprite_id"))
    private List<Sprite> left;

    @ManyToMany(fetch = FetchType.EAGER)
    @JoinTable(name = "sprite_set_right", joinColumns = @JoinColumn(name = "sprite_set_id"), inverseJoinColumns = @JoinColumn(name = "sprite_id"))
    private List<Sprite> right;

    public SpriteSet(List<Sprite> front, List<Sprite> back, List<Sprite> left, List<Sprite> right) {
        this.front = front;
        this.back = back;
        this.left = left;
        this.right = right;
    }

    public List<Sprite> getLeft() {
        return left;
    }

    public List<Sprite> getRight() {
        return right;
    }

    public List<Sprite> getBack() {
        return back;
    }

    public List<Sprite> getFront() {
        return front;
    }
}
