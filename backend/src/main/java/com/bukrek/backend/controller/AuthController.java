package com.bukrek.backend.controller;

import com.bukrek.backend.dto.LoginRequest;
import com.bukrek.backend.dto.Response;
import com.bukrek.backend.entity.User;
import com.bukrek.backend.service.interfaces.UserServiceInterface;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/auth")
public class AuthController {
    @Autowired
    private UserServiceInterface userServiceInterface;

    @PostMapping("/register")
    public ResponseEntity<Response> register(@RequestBody User user) {
        Response response = userServiceInterface.register(user);
        return ResponseEntity.status(response.getStatusCode()).body(response);
    }

    @PostMapping("/login")
    public ResponseEntity<Response> login(@RequestBody LoginRequest loginRequest) {
        Response response = userServiceInterface.login(loginRequest);
        return ResponseEntity.status(response.getStatusCode()).body(response);
    }
}
