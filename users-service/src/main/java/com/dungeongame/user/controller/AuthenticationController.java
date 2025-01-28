package com.dungeongame.user.controller;

import com.dungeongame.user.dtos.LoginResponse;
import com.dungeongame.user.dtos.LoginUserDto;
import com.dungeongame.user.dtos.RegisterUserDto;
import com.dungeongame.user.model.User;
import com.dungeongame.user.repository.UserRepository;
import com.dungeongame.user.service.AuthenticationService;
import com.dungeongame.user.service.JwtService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.naming.AuthenticationException;

@RestController
@RequestMapping("/api/auth")
public class AuthenticationController {
    private final JwtService jwtService;

    private final AuthenticationService authenticationService;

    private final UserRepository userRepository;

    public AuthenticationController(
            JwtService jwtService,
            AuthenticationService authenticationService,
            UserRepository userRepository
    ) {
        this.jwtService = jwtService;
        this.authenticationService = authenticationService;
        this.userRepository = userRepository;
    }

    @PostMapping("/signup")
    public ResponseEntity<?> register(@RequestBody RegisterUserDto registerUserDto) {
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
                    .body("An error occurred during user registration.");
        }
    }

    @PostMapping("/signin")
    public ResponseEntity<?> authenticate(@RequestBody LoginUserDto loginUserDto) {
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
