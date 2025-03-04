package com.bukrek.backend.service.implementation;

import com.bukrek.backend.dto.BookingDTO;
import com.bukrek.backend.dto.Response;
import com.bukrek.backend.entity.Booking;
import com.bukrek.backend.entity.Room;
import com.bukrek.backend.entity.User;
import com.bukrek.backend.exception.GlobalException;
import com.bukrek.backend.repository.BookingRepository;
import com.bukrek.backend.repository.RoomRepository;
import com.bukrek.backend.repository.UserRepository;
import com.bukrek.backend.service.interfaces.BookingServiceInterface;
import com.bukrek.backend.service.interfaces.RoomServiceInterface;
import com.bukrek.backend.utils.EntityConverterAndCodeGenerator;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
public class BookingService implements BookingServiceInterface {

    @Autowired
    private BookingRepository bookingRepository;
    @Autowired
    private RoomServiceInterface roomServiceInterface;
    @Autowired
    private RoomRepository roomRepository;
    @Autowired
    private UserRepository userRepository;

    @Transactional
    @Override
    public Response saveBookings(Long roomId, Long userId, Booking bookingRequest) {
        Response response = new Response();

        try {
            if (bookingRequest.getCheckOutDate().isBefore(bookingRequest.getCheckInDate())) {
                throw new IllegalArgumentException("Check-out date mustn't be before the check-in date.");
            }
            Room room = roomRepository.findById(roomId)
                    .orElseThrow(() -> new GlobalException("Room Not Found !"));

            User user = userRepository.findById(userId)
                    .orElseThrow(() -> new GlobalException("User Not Found !"));

            List<Booking> existingBooking = room.getBookings();

            if (!roomIsAvailable(bookingRequest, existingBooking)) {
                throw new GlobalException("Room not Available for selected date range !");
            }

            bookingRequest.setRoom(room);
            bookingRequest.setUser(user);
            String bookingConfirmationCode = EntityConverterAndCodeGenerator
                    .generateRandomConfirmation(10);
            bookingRequest.setBookingConfirmationCode(bookingConfirmationCode);
            bookingRepository.save(bookingRequest);

            response.setStatusCode(200);
            response.setMessage("Successful :)");
            response.setBookingConfirmationCode(bookingConfirmationCode);
        } catch (GlobalException e) {
            response.setStatusCode(404);
            response.setMessage(e.getMessage());
        } catch (Exception e) {
            response.setStatusCode(500);
            response.setMessage("Error occurred when saving that booking " + e.getMessage());
        }
        return response;
    }

    @Transactional
    @Override
    public Response findBookingByConfirmationCode(String confirmationCode) {
        Response response = new Response();

        try {
            Booking booking = bookingRepository.findByBookingConfirmationCode(confirmationCode)
                    .orElseThrow(() -> new GlobalException("Booking Not Found !"));

            BookingDTO bookingDTO = EntityConverterAndCodeGenerator
                    .convertBookingEntityToBookingDTOWithBookedRooms(booking, true);

            response.setStatusCode(200);
            response.setMessage("Successful :)");
            response.setBooking(bookingDTO);
        } catch (GlobalException e) {
            response.setStatusCode(404);
            response.setMessage(e.getMessage());
        } catch (Exception e) {
            response.setStatusCode(500);
            response.setMessage("Error occurred when finding that booking " + e.getMessage());
        }
        return response;
    }

    @Override
    public Response getAllBookings() {
        Response response = new Response();

        try {
            List<Booking> bookingList = bookingRepository.findAll(
                    Sort.by(Sort.Direction.DESC, "id"));

            List<BookingDTO> bookingDTOList = EntityConverterAndCodeGenerator
                    .convertBookingListEntityToBookingListDTO(bookingList);

            response.setStatusCode(200);
            response.setMessage("Successful :)");
            response.setBookingList(bookingDTOList);
        } catch (GlobalException e) {
            response.setStatusCode(404);
            response.setMessage(e.getMessage());
        } catch (Exception e) {
            response.setStatusCode(500);
            response.setMessage("Error occurred when getting all bookings " + e.getMessage());
        }
        return response;
    }

    @Transactional
    @Override
    public Response updateBooking(Long bookingId, LocalDate checkInDate, LocalDate checkOutDate,
                                  int numOfAdults, int numOfChildren, Long roomId) {
        Response response = new Response();
        try {
            // Find the reservation to update
            Booking booking = bookingRepository.findById(bookingId)
                    .orElseThrow(() -> new GlobalException("Booking Not Found!"));

            // Check the logical correctness of the dates
            if (checkOutDate.isBefore(checkInDate)) {
                throw new IllegalArgumentException("Check-out date mustn't be before the check-in date.");
            }

            // Bring new room information
            Room newRoom = roomRepository.findById(roomId)
                    .orElseThrow(() -> new GlobalException("Room Not Found!"));

            // Check if the selected room is available for new dates
            List<Booking> existingBookings = newRoom.getBookings();

            // Check room availability using the current function
            Booking tempBooking = new Booking();
            tempBooking.setCheckInDate(checkInDate);
            tempBooking.setCheckOutDate(checkOutDate);

            if (!roomIsAvailable(tempBooking, existingBookings)) {
                throw new GlobalException("Room is not available for the selected date range!");
            }

            // Apply updates
            booking.setCheckInDate(checkInDate);
            booking.setCheckOutDate(checkOutDate);
            booking.setNumOfAdults(numOfAdults);
            booking.setNumOfChildren(numOfChildren);
            booking.setRoom(newRoom);
            bookingRepository.save(booking);

            // Convert the updated booking to DTO and prepare the response
            BookingDTO updatedBookingDTO = EntityConverterAndCodeGenerator
                    .convertBookingEntityToBookingDTOWithBookedRooms(booking, true);
            response.setStatusCode(200);
            response.setMessage("Booking updated successfully.");
            response.setBooking(updatedBookingDTO);

        } catch (GlobalException e) {
            response.setStatusCode(404);
            response.setMessage(e.getMessage());
        } catch (Exception e) {
            response.setStatusCode(500);
            response.setMessage("Error occurred while updating booking: " + e.getMessage());
        }
        return response;
    }


    @Override
    public Response cancelBooking(Long bookingId) {
        Response response = new Response();

        try {
            bookingRepository.findById(bookingId)
                    .orElseThrow(() -> new GlobalException("Booking Doesn't Exist !"));

            bookingRepository.deleteById(bookingId);

            response.setStatusCode(200);
            response.setMessage("Successful :/");

        } catch (GlobalException e) {
            response.setStatusCode(404);
            response.setMessage(e.getMessage());
        } catch (Exception e) {
            response.setStatusCode(500);
            response.setMessage("Error occurred when canceled that booking " + e.getMessage());
        }
        return response;
    }

    private boolean roomIsAvailable(Booking bookingRequest, List<Booking> existingBookings) {
        System.out.println("Checking availability for room...");
        System.out.println("Check-in Date: " + bookingRequest.getCheckInDate());
        System.out.println("Check-out Date: " + bookingRequest.getCheckOutDate());
        System.out.println("Existing Bookings: " + existingBookings.size());

        for (Booking existingBooking : existingBookings) {
            System.out.println("Existing Booking - Check-in: " + existingBooking.getCheckInDate() +
                    ", Check-out: " + existingBooking.getCheckOutDate());
        }

        return existingBookings.stream()
                .noneMatch(existingBooking ->
                        bookingRequest.getCheckInDate().isBefore(existingBooking.getCheckOutDate())
                                && bookingRequest.getCheckOutDate().isAfter(existingBooking.getCheckInDate()));
    }
}
