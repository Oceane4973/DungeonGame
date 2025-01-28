package com.dungeongame.heroes.repository;

import com.dungeongame.heroes.model.Sprite;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface SpriteRepository extends JpaRepository<Sprite, Long> {}
