package com.dungeongame.heroes.repository;

import com.dungeongame.heroes.model.Hero;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface HeroRepository extends JpaRepository<Hero, Long> {
    List<Hero> findByUserId(Long userId);
}
