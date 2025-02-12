package com.bukrek.backend.utils;

import com.bukrek.backend.dto.BookingDTO;
import com.bukrek.backend.dto.RoomDTO;
import com.bukrek.backend.dto.UserDTO;
import com.bukrek.backend.entity.Booking;
import com.bukrek.backend.entity.Room;
import com.bukrek.backend.entity.User;

import java.security.SecureRandom;
import java.util.List;
import java.util.stream.Collectors;

public class EntityConverterAndCodeGenerator {
    /*
        The static keyword makes a variable or method belong to a class. In other words,
         it makes it directly accessible through the class without creating an object (instance).
    */
    private static final String ALPHANUMERICAL_STRING = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

    private static final SecureRandom secureRandom = new SecureRandom();

    public static String generateRandomConfirmation(int length) {
        StringBuilder stringBuilder = new StringBuilder();

        for (int i = 0; i < length; i++) {

            int randomIndex = secureRandom.nextInt(ALPHANUMERICAL_STRING.length());
            char randomChar = ALPHANUMERICAL_STRING.charAt(randomIndex);
            stringBuilder.append(randomChar);
        }
        return stringBuilder.toString();
    }

    // This method creates UserDTO from UserEntity
    public static UserDTO convertUserEntityToUserDTO(User user) {
        UserDTO userDTO = new UserDTO();

        userDTO.setId(user.getId());
        userDTO.setName(user.getName());
        userDTO.setPhoneNumber(user.getPhoneNumber());
        userDTO.setRole(user.getRole());

        return userDTO;
    }

    // This method creates RoomDTO from RoomEntity
    public static RoomDTO convertRoomEntityToRoomDTO(Room room) {
        RoomDTO roomDTO = new RoomDTO();

        roomDTO.setId(room.getId());
        roomDTO.setRoomType(room.getRoomType());
        roomDTO.setRoomPrice(room.getRoomPrice());
        roomDTO.setRoomPhotoUrl(room.getRoomPhotoUrl());
        roomDTO.setRoomDescription(room.getRoomDescription());

        return roomDTO;
    }

    // This method creates BookingDTO from BookingEntity
    public static BookingDTO convertBookingEntityToBookingDTO(Booking booking) {
        BookingDTO bookingDTO = new BookingDTO();

        // Maps single fields.
        bookingDTO.setId(booking.getId());
        bookingDTO.setCheckInDate(booking.getCheckInDate());
        bookingDTO.setCheckOutDate(booking.getCheckOutDate());
        bookingDTO.setNumOfAdults(booking.getNumOfAdults());
        bookingDTO.setNumOfChildren(booking.getNumOfChildren());
        bookingDTO.setTotalNumOfGuests(booking.getTotalNumOfGuests());
        bookingDTO.setBookingConfirmationCode(booking.getBookingConfirmationCode());

        return bookingDTO;
    }

    // This method creates RoomDTO with Bookings from RoomEntity
    public static RoomDTO convertRoomEntityToRoomDTOWithBookings(Room room) {
        RoomDTO roomDTO = new RoomDTO();

        roomDTO.setId(room.getId());
        roomDTO.setRoomType(room.getRoomType());
        roomDTO.setRoomPrice(room.getRoomPrice());
        roomDTO.setRoomPhotoUrl(room.getRoomPhotoUrl());
        roomDTO.setRoomDescription(room.getRoomDescription());

        if (room.getBookings() != null) {
            roomDTO.setBookings(room.getBookings()
                    .stream()
                    .map(EntityConverterAndCodeGenerator::convertBookingEntityToBookingDTO)
                    .collect(Collectors.toList()));
        }
        return roomDTO;
    }

    // This method creates BookingDTO with room and user from BookingEntity
    public static BookingDTO convertBookingEntityToBookingDTOWithBookedRooms(Booking booking, boolean mapUser) {
        BookingDTO bookingDTO = new BookingDTO();

        // Maps simple fields
        bookingDTO.setId(booking.getId());
        bookingDTO.setCheckInDate(booking.getCheckInDate());
        bookingDTO.setCheckOutDate(booking.getCheckOutDate());
        bookingDTO.setNumOfAdults(booking.getNumOfAdults());
        bookingDTO.setNumOfChildren(booking.getNumOfChildren());
        bookingDTO.setTotalNumOfGuests(booking.getTotalNumOfGuests());
        bookingDTO.setBookingConfirmationCode(booking.getBookingConfirmationCode());

        if (mapUser) {
            bookingDTO.setUser(EntityConverterAndCodeGenerator.convertUserEntityToUserDTO(booking.getUser()));
        }
        if (booking.getRoom() != null) {
            RoomDTO roomDTO = new RoomDTO();

            roomDTO.setId(booking.getRoom().getId());
            roomDTO.setRoomType(booking.getRoom().getRoomType());
            roomDTO.setRoomPrice(booking.getRoom().getRoomPrice());
            roomDTO.setRoomPhotoUrl(booking.getRoom().getRoomPhotoUrl());
            roomDTO.setRoomDescription(booking.getRoom().getRoomDescription());
            bookingDTO.setRoom(roomDTO);
        }
        return bookingDTO;
    }

    // This method creates UserDTO with booking and room from UserEntity
    public static UserDTO convertUserEntityToUserDTOWithBookingAndRoom(User user) {
        UserDTO userDTO = new UserDTO();

        userDTO.setId(user.getId());
        userDTO.setName(user.getName());
        userDTO.setEmail(user.getEmail());
        userDTO.setPhoneNumber(user.getPhoneNumber());
        userDTO.setRole(user.getRole());

        if (!user.getBookings().isEmpty()) {
            userDTO.setBookings(user.getBookings()
                    .stream()
                    .map(booking -> convertBookingEntityToBookingDTOWithBookedRooms(booking, false))
                    .collect(Collectors.toList()));
        }
        return userDTO;
    }

    // This method returns List<UserDTO> which you want with List<UserEntity> method parameter
    public static List<UserDTO> convertUserListEntityToUserListDTO(List<User> userList) {
        return userList.stream()
                .map(EntityConverterAndCodeGenerator::convertUserEntityToUserDTO)
                .collect(Collectors.toList());
    }

    // This method returns List<RoomDTO> which you want with List<RoomEntity> method parameter
    public static List<RoomDTO> convertRoomListEntityToRoomListDTO(List<Room> roomList) {
        return roomList.stream()
                .map(EntityConverterAndCodeGenerator::convertRoomEntityToRoomDTO)
                .collect(Collectors.toList());
    }

    // This method returns List<BookingDTO> which you want with List<BookingEntity> method parameter
    public static List<BookingDTO> convertBookingListEntityToBookingListDTO(List<Booking> bookingList) {
        return bookingList.stream()
                .map(EntityConverterAndCodeGenerator::convertBookingEntityToBookingDTO)
                .collect(Collectors.toList());
    }

}
