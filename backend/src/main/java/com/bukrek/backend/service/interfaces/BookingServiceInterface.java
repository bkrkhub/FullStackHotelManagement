package com.bukrek.backend.service.interfaces;

import com.bukrek.backend.dto.Response;
import com.bukrek.backend.entity.Booking;

public interface BookingServiceInterface {

    Response saveBookings(Long roomId, Long userId, Booking bookingRequest);

    Response findBookingByConfirmationCode(String confirmationCode);

    Response getAllBookings();

    Response cancelBooking(Long bookingId);
}
