package com.dungeongame.heroes.repository;

import com.dungeongame.heroes.model.Body;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface BodyRepository extends JpaRepository<Body, Long> {}

