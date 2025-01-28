package com.dungeongame.heroes.repository;

import com.dungeongame.heroes.model.SpriteSet;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface SpriteSetRepository extends JpaRepository<SpriteSet, Long> {}
