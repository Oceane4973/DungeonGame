package com.dungeongame.heroes.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.springframework.data.jpa.repository.Query;
import com.dungeongame.heroes.model.Head;

@Repository
public interface HeadRepository extends JpaRepository<Head, Long> {
    @Query("SELECT new com.dungeongame.heroes.model.Head(h.id, s.id, s.front, s.back) " +
            "FROM Head h " +
            "LEFT JOIN h.sprites s")
    List<Head> findAllWithSprites();

}