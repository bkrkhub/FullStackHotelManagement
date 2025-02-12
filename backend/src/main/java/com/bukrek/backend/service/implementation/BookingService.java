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
        return existingBookings.stream()
                .noneMatch(existingBooking ->
                        bookingRequest.getCheckInDate().equals(existingBooking.getCheckInDate())
                                || bookingRequest.getCheckOutDate().isBefore(existingBooking.getCheckOutDate())
                                || (bookingRequest.getCheckInDate().isAfter(existingBooking.getCheckInDate())
                                && bookingRequest.getCheckInDate().isBefore(existingBooking.getCheckOutDate()))
                                || (bookingRequest.getCheckInDate().isBefore(existingBooking.getCheckInDate())

                                && bookingRequest.getCheckOutDate().equals(existingBooking.getCheckOutDate()))
                                || (bookingRequest.getCheckInDate().isBefore(existingBooking.getCheckInDate())

                                && bookingRequest.getCheckOutDate().isAfter(existingBooking.getCheckOutDate()))

                                || (bookingRequest.getCheckInDate().equals(existingBooking.getCheckOutDate())
                                && bookingRequest.getCheckOutDate().equals(existingBooking.getCheckInDate()))

                                || (bookingRequest.getCheckInDate().equals(existingBooking.getCheckOutDate())
                                && bookingRequest.getCheckOutDate().equals(bookingRequest.getCheckInDate()))
                );
    }
}
