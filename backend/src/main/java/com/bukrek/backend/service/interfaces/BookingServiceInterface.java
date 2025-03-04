package com.bukrek.backend.service.interfaces;

import com.bukrek.backend.dto.Response;
import com.bukrek.backend.entity.Booking;

import java.time.LocalDate;

public interface BookingServiceInterface {

    Response saveBookings(Long roomId, Long userId, Booking bookingRequest);

    Response findBookingByConfirmationCode(String confirmationCode);

    Response getAllBookings();

    Response updateBooking(Long bookingId, LocalDate checkInDate, LocalDate checkOutDate,
                           int numOfAdults, int numOfChildren, Long roomId);

    Response cancelBooking(Long bookingId);
}
