package com.dungeongame.user.controller;

import com.dungeongame.user.model.User;
import com.dungeongame.user.service.UserService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private UserService userService;

    @PostMapping("/signup")
    public ResponseEntity<String> signup(@RequestBody @Valid User user) {
        if (userService.findByUsername(user.getUsername()).isPresent()) {
            return ResponseEntity.badRequest().body("Username already taken");
        }
        userService.register(user);
        return ResponseEntity.ok("User created");
    }

    @PostMapping("/signin")
    public ResponseEntity<String> signin(@RequestBody User user) {
        if (user.getUsername().isEmpty() || user.getPassword().isEmpty()) {
            return ResponseEntity.badRequest().body("Username or password cannot be empty");
        }

        Optional<User> potentialUser = userService.findByUsername(user.getUsername());
        if (potentialUser.isPresent() &&
                new BCryptPasswordEncoder().matches(user.getPassword(), potentialUser.get().getPassword())) {
            return ResponseEntity.ok("User logged in : " + user);
        }
        return ResponseEntity.badRequest().body("Username or password is incorrect");
    }
}
