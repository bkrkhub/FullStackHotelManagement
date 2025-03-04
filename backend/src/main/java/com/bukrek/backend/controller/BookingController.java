package com.bukrek.backend.controller;

import com.bukrek.backend.dto.Response;
import com.bukrek.backend.entity.Booking;
import com.bukrek.backend.service.interfaces.BookingServiceInterface;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.Map;

@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
@RestController
@RequestMapping("/booking")
public class BookingController {

    @Autowired
    private BookingServiceInterface bookingServiceInterface;

    @PostMapping("/book-room/{roomId}/{userId}")
    @PreAuthorize("hasAuthority('ADMIN') or hasAuthority('USER')")
    public ResponseEntity<Response> saveBookings(@PathVariable Long roomId,
                                                 @PathVariable Long userId, @RequestBody Booking bookingRequest) {

        Response response = bookingServiceInterface.saveBookings(roomId, userId, bookingRequest);
        return ResponseEntity.status(response.getStatusCode()).body(response);
    }

    @GetMapping("/all")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<Response> getAllBookings() {
        Response response = bookingServiceInterface.getAllBookings();
        return ResponseEntity.status(response.getStatusCode()).body(response);
    }

    @GetMapping("/get-by-confirmation-code/{confirmationCode}")
    public ResponseEntity<Response> getBookingByConfirmationCode(@PathVariable String confirmationCode) {
        Response response = bookingServiceInterface.findBookingByConfirmationCode(confirmationCode);
        return ResponseEntity.status(response.getStatusCode()).body(response);
    }

    @PutMapping("/update-booking/{bookingId}")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<Response> updateBooking(@PathVariable Long bookingId,
                                                  @RequestBody Map<String, Object>requestData) {
        try {
            // Get data from JSON
            LocalDate checkInDate = LocalDate.parse((String) requestData.get("checkInDate"));
            LocalDate checkOutDate = LocalDate.parse((String) requestData.get("checkOutDate"));
            int numOfAdults = (int) requestData.get("numOfAdults");
            int numOfChildren = (int) requestData.get("numOfChildren");
            Long roomId = Long.valueOf(requestData.get("roomId").toString());

            // call the service layer
            Response response = bookingServiceInterface.updateBooking(bookingId, checkInDate, checkOutDate,
                    numOfAdults, numOfChildren, roomId);

            return ResponseEntity.status(response.getStatusCode()).body(response);
        } catch (Exception e) {
            Response errorResponse = new Response();
            errorResponse.setStatusCode(500);
            errorResponse.setMessage("Invalid request data: " + e.getMessage());
            return ResponseEntity.status(500).body(errorResponse);
        }
    }

    @DeleteMapping("/cancel-booking/{bookingId}")
    @PreAuthorize("hasAuthority('ADMIN') or hasAuthority('USER')")
    public ResponseEntity<Response> cancelBooking(@PathVariable Long bookingId) {
        Response response = bookingServiceInterface.cancelBooking(bookingId);
        return ResponseEntity.status(response.getStatusCode()).body(response);
    }

}
