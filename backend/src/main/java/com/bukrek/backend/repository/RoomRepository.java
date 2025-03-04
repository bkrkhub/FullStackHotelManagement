package com.bukrek.backend.repository;

import com.bukrek.backend.entity.Room;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.time.LocalDate;
import java.util.List;

public interface RoomRepository extends JpaRepository<Room, Long> {

    // Fetches room types uniquely
    @Query("SELECT DISTINCT r.roomType FROM Room r")
    List<String> findDistinctRoomTypes();

    // Retrieves available rooms in the specified date range and room type
    @Query("SELECT r FROM Room r WHERE r.roomType = :roomType AND r.id NOT IN " +
            "(SELECT b.room.id FROM Booking b WHERE " +
            "(:checkInDate BETWEEN b.checkInDate AND b.checkOutDate OR " +
            ":checkOutDate BETWEEN b.checkInDate AND b.checkOutDate OR " +
            "(b.checkInDate BETWEEN :checkInDate AND :checkOutDate)))")
    List<Room> findAvailableRoomsByDateAndTypes(LocalDate checkInDate, LocalDate checkOutDate, String roomType);

    // Brings all available rooms (no reservations)
    @Query("SELECT r FROM Room r WHERE r.id NOT IN (SELECT b.room.id FROM Booking b)")
    List<Room> getAllAvailableRooms();
}
