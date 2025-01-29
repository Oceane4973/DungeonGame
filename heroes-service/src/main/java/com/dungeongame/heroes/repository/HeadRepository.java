package com.dungeongame.heroes.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.dungeongame.heroes.model.Head;

@Repository
public interface HeadRepository extends JpaRepository<Head, Long> {}