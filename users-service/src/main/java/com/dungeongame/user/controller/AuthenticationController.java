package com.dungeongame.user.controller;

import com.dungeongame.user.dtos.LoginResponse;
import com.dungeongame.user.dtos.LoginUser;
import com.dungeongame.user.dtos.RegisterUser;
import com.dungeongame.user.model.User;
import com.dungeongame.user.repository.UserRepository;
import com.dungeongame.user.service.AuthenticationService;
import com.dungeongame.user.service.JwtService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:3000", maxAge = 3600)
public class AuthenticationController {
    @Autowired
    private JwtService jwtService;

    @Autowired
    private AuthenticationService authenticationService;

    @Autowired
    private UserRepository userRepository;

    @PostMapping("/signup")
    public ResponseEntity<?> register(@RequestBody RegisterUser registerUserDto) {
        if (userRepository.findUserByUsername(registerUserDto.getUsername()).isPresent()) {
            return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .body("Username is already in use");
        }

        try {
            User registeredUser = authenticationService.signup(registerUserDto);
            return ResponseEntity.ok(registeredUser);
        } catch (Exception e) {
            // Gestion générique des erreurs pour éviter les crashs
            return ResponseEntity
                    .status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("An error occurred during user registration");
        }
    }

    @PostMapping("/signin")
    public ResponseEntity<?> authenticate(@RequestBody LoginUser loginUserDto) {
        try {
            User authenticatedUser = authenticationService.authenticate(loginUserDto);

            String jwtToken = jwtService.generateToken(authenticatedUser);

            LoginResponse loginResponse = new LoginResponse();
            loginResponse.setToken(jwtToken);
            loginResponse.setExpiresIn(jwtService.getExpirationTime());

            return ResponseEntity.ok(loginResponse);
        } catch (Exception e) {
            return ResponseEntity
                    .status(HttpStatus.UNAUTHORIZED)
                    .body("Invalid username or password");
        }
    }
}
