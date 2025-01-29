package com.dungeongame.user.service;

import com.dungeongame.user.dtos.QueueGold;
import com.dungeongame.user.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class UserService {
    @Autowired
    private UserRepository userRepository;

    public void updateGold(QueueGold queueGold) {
        userRepository.findById(queueGold.getUserId()).ifPresent(user -> {
            user.setGold(queueGold.getGold());

            userRepository.save(user);
        });

    }
}
