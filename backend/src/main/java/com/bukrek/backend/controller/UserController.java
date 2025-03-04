package com.bukrek.backend.controller;

import com.bukrek.backend.dto.Response;
import com.bukrek.backend.service.interfaces.UserServiceInterface;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/users")
public class UserController {

    @Autowired
    private UserServiceInterface userServiceInterface;

    @GetMapping("/all")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<Response> getAllUsers() {
        Response response = userServiceInterface.getAllUsers();
        return ResponseEntity.status(response.getStatusCode()).body(response);
    }

    @GetMapping("/get-by-id/{userId}")
    public ResponseEntity<Response> getUserById(@PathVariable("userId") String userId) {
        Response response = userServiceInterface.getUserById(userId);
        return ResponseEntity.status(response.getStatusCode()).body(response);
    }

    @PutMapping("/update/{userId}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Response> updateUser(@PathVariable Long userId, @RequestBody Map<String, Object> requestData) {
        System.out.println("🔍 API'ye frontend'den istek geldi!");

        // We retrieve values manually from JSON
        String name = requestData.containsKey("name") ? (String) requestData.get("name") : null;
        String phoneNumber = requestData.containsKey("phoneNumber") ? (String) requestData.get("phoneNumber") : null;
        String password = requestData.containsKey("password") ? (String) requestData.get("password") : null;

        System.out.println("🔍 Backend'e gelen password değeri: " + (password != null ? password : "Şifre değiştirilmedi"));

        Response response = userServiceInterface.updateUser(userId, name, phoneNumber, password);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/delete/{userId}")
    public ResponseEntity<Response> deleteUserById(@PathVariable("userId") String userId) {
        Response response = userServiceInterface.deleteUser(userId);
        return ResponseEntity.status(response.getStatusCode()).body(response);
    }

    @GetMapping("/get-logged-in-profile-info")
    public ResponseEntity<Response> getLoggedInUserProfile() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();
        Response response = userServiceInterface.getMyInfo(email);
        return ResponseEntity.status(response.getStatusCode()).body(response);
    }

    @Transactional
    @GetMapping("/get-user-bookings/{userId}")
    public ResponseEntity<Response> getUserBookingHistory(@PathVariable("userId") String userId) {
        Response response = userServiceInterface.getUserBookingHistory(userId);
        return ResponseEntity.status(response.getStatusCode()).body(response);
    }
}
