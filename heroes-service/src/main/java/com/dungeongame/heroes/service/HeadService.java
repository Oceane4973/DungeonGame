package com.dungeongame.heroes.service;

import com.dungeongame.heroes.model.Head;
import com.dungeongame.heroes.repository.HeadRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class HeadService {

    @Autowired
    private HeadRepository headRepository;

    public List<Head> getAllHeads() {
        return headRepository.findAll();
    }
}
