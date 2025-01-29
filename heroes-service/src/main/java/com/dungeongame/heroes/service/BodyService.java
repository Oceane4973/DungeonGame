package com.dungeongame.heroes.service;

import com.dungeongame.heroes.model.Body;
import com.dungeongame.heroes.repository.BodyRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class BodyService {

    @Autowired
    private BodyRepository bodyRepository;

    public List<Body> getAllBodies() {
        return bodyRepository.findAll();
    }
}
