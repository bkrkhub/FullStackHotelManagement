package com.bukrek.backend.repository;

import com.bukrek.backend.entity.Booking;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface BookingRepository  extends JpaRepository<Booking, Long> {

    List<Booking> findByRoomId(Long roomId);

    Optional<Booking> findByBookingConfirmationCode(String bookingConfirmationCode);

    List<Booking> findByUserId(Long UserId);
}
