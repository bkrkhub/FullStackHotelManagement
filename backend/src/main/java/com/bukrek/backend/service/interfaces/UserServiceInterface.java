package com.bukrek.backend.service.interfaces;

import com.bukrek.backend.dto.LoginRequest;
import com.bukrek.backend.dto.Response;
import com.bukrek.backend.entity.User;

public interface UserServiceInterface {

    Response register(User user);

    Response login(LoginRequest loginRequest);

    Response getAllUsers();

    Response getUserBookingHistory(String userId);

    Response deleteUser(String userId);

    Response updateUser(Long userId, String name, String phoneNumber, String password);

    Response getUserById(String userId);

    Response getMyInfo(String email);
}
