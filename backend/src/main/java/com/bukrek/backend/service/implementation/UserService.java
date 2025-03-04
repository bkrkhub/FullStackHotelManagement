package com.bukrek.backend.service.implementation;

import com.bukrek.backend.dto.LoginRequest;
import com.bukrek.backend.dto.Response;
import com.bukrek.backend.dto.UserDTO;
import com.bukrek.backend.entity.User;
import com.bukrek.backend.exception.GlobalException;
import com.bukrek.backend.repository.UserRepository;
import com.bukrek.backend.service.interfaces.UserServiceInterface;
import com.bukrek.backend.utils.EntityConverterAndCodeGenerator;
import com.bukrek.backend.utils.JWTUtils;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UserService implements UserServiceInterface {
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private PasswordEncoder passwordEncoder;
    @Autowired
    private JWTUtils jwtUtils;
    @Autowired
    private AuthenticationManager authenticationManager;

    @Override
    public Response register(User user) {
        Response response = new Response();
        try{
            if (user.getRole() == null || user.getRole().isBlank()) {
                user.setRole("USER");
            }
            if (userRepository.existsByEmail(user.getEmail())) {
                throw new GlobalException(user.getEmail() + "Already exists.");
            }

            user.setPassword(passwordEncoder.encode(user.getPassword()));
            User savedUser = userRepository.save(user);
            UserDTO userDTO = EntityConverterAndCodeGenerator.convertUserEntityToUserDTO(savedUser);
            response.setStatusCode(200);
            response.setUser(userDTO);

        } catch (GlobalException e) {
            response.setStatusCode(400);
            response.setMessage(e.getMessage());
        }
        catch (Exception e) {
            response.setStatusCode(500);
            response.setMessage("Error occurred during user registration " + e.getMessage());
        }
        return response;
    }

    @Override
    public Response login(LoginRequest loginRequest) {
        Response response = new Response();

        try {
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            loginRequest.getEmail(), loginRequest.getPassword()
                    )
            );

            var user = userRepository.findByEmail(loginRequest.getEmail())
                    .orElseThrow(() -> new GlobalException("User Not Found !"));

            var jwtToken = jwtUtils.generateToken(user);
            response.setStatusCode(200);
            response.setToken(jwtToken);
            response.setRole(user.getRole());
            response.setExpirationTime("1 Days");
            response.setMessage("Successful :)");
        } catch (GlobalException e) {
            response.setStatusCode(404);
            response.setMessage(e.getMessage());

        } catch (Exception e) {
            response.setStatusCode(500);
            response.setMessage("Error occurred during user login " + e.getMessage());
        }
        return response;
    }

    @Override
    public Response getAllUsers() {
        Response response = new Response();

        try {
            List<User> userList = userRepository.findAll();
            List<UserDTO> userDTOList = EntityConverterAndCodeGenerator
                    .convertUserListEntityToUserListDTO(userList);

            response.setStatusCode(200);
            response.setMessage("Successful :)");
            response.setUserList(userDTOList);

        } catch (Exception e) {
            response.setStatusCode(500);
            response.setMessage("Error getting all users " + e.getMessage());
        }
        return response;
    }

    @Override
    public Response getUserBookingHistory(String userId) {
        Response response = new Response();

        try {
            User user = userRepository.findById(Long.valueOf(userId))
                    .orElseThrow(() -> new GlobalException("User Not Found !"));

            UserDTO userDTO = EntityConverterAndCodeGenerator
                    .convertUserEntityToUserDTOWithBookingAndRoom(user);

            response.setStatusCode(200);
            response.setMessage("Successful :)");
            response.setUser(userDTO);
        } catch (GlobalException e) {
            response.setStatusCode(404);
            response.setMessage(e.getMessage());
        } catch (Exception e) {
            response.setStatusCode(500);
            response.setMessage("Error getting all users " + e.getMessage());
        }
        return response;
    }

    @Override
    @Transactional
    public Response updateUser(Long userId, String name, String phoneNumber, String password) {
        Response response = new Response();
        try {
            User user = userRepository.findById(userId)
                    .orElseThrow(() -> new GlobalException("User Not Found!"));

            if (name != null && !name.isBlank()) user.setName(name);
            if (phoneNumber != null && !phoneNumber.isBlank()) user.setPhoneNumber(phoneNumber);

            // If the password is not empty, update it by hashing
            if (password != null && !password.isBlank()) {
                System.out.println("✅ Gelen yeni şifre (düz metin): " + password);
                String hashedPassword = passwordEncoder.encode(password);
                System.out.println("🔐 Hashlenmiş yeni şifre: " + hashedPassword);
                user.setPassword(hashedPassword);
            } else {
                System.out.println("⚠️ Şifre değişmedi, eski şifre korunuyor.");
            }

            userRepository.save(user);
            System.out.println("✅ Kullanıcı başarıyla kaydedildi: " + user);

            UserDTO userDTO = EntityConverterAndCodeGenerator.convertUserEntityToUserDTO(user);
            response.setStatusCode(200);
            response.setMessage("Successful :)");
            response.setUser(userDTO);
        } catch (Exception e) {
            response.setStatusCode(500);
            response.setMessage("Error occurred when updating user: " + e.getMessage());
        }
        return response;
    }

    @Override
    public Response deleteUser(String userId) {
        Response response = new Response();

        try {
            userRepository.findById(Long.valueOf(userId))
                    .orElseThrow(() -> new GlobalException("User Not Found !"));

            userRepository.deleteById(Long.valueOf(userId));

            response.setStatusCode(200);
            response.setMessage("Successful :/");
        } catch (Exception e) {
            response.setStatusCode(500);
            response.setMessage("Error occurred when deleting that user " + e.getMessage());
        }
        return response;
    }

    @Override
    public Response getUserById(String userId) {
        Response response = new Response();

        try {
            User user = userRepository.findById(Long.valueOf(userId))
                    .orElseThrow(() -> new GlobalException("User Not Found !"));

            UserDTO userDTO = EntityConverterAndCodeGenerator.convertUserEntityToUserDTO(user);
            response.setStatusCode(200);
            response.setMessage("Successful :)");
            response.setUser(userDTO);
        } catch (GlobalException e) {
            response.setStatusCode(404);
            response.setMessage("Error occurred when getting that user " + e.getMessage());
        } catch (Exception e) {
            response.setStatusCode(500);
            response.setMessage(e.getMessage());
        }
        return response;
    }

    @Override
    public Response getMyInfo(String email) {
        Response response = new Response();

        try {
            User user = userRepository.findByEmail(email)
                    .orElseThrow(() -> new GlobalException("User Not Found !"));

            UserDTO userDTO = EntityConverterAndCodeGenerator.convertUserEntityToUserDTO(user);
            response.setStatusCode(200);
            response.setMessage("Successful :)");
            response.setUser(userDTO);
        } catch (GlobalException e) {
            response.setStatusCode(404);
            response.setMessage("Error occurred when getting that user " + e.getMessage());
        } catch (Exception e) {
            response.setStatusCode(500);
            response.setMessage(e.getMessage());
        }
        return response;
    }
}
