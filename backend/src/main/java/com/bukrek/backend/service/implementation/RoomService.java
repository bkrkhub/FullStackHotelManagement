package com.bukrek.backend.service.implementation;

import com.bukrek.backend.dto.Response;
import com.bukrek.backend.dto.RoomDTO;
import com.bukrek.backend.entity.Room;
import com.bukrek.backend.exception.GlobalException;
import com.bukrek.backend.repository.BookingRepository;
import com.bukrek.backend.repository.RoomRepository;
import com.bukrek.backend.service.AwsS3Service;
import com.bukrek.backend.service.interfaces.RoomServiceInterface;
import com.bukrek.backend.utils.EntityConverterAndCodeGenerator;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Service
public class RoomService implements RoomServiceInterface {
    @Autowired
    private RoomRepository roomRepository;
    @Autowired
    private BookingRepository bookingRepository;
    @Autowired
    private AwsS3Service awsS3Service;

    @Override
    public Response addNewRoom(MultipartFile photo, String roomType, BigDecimal roomPrice, String description) {
        Response response = new Response();

        try {
            String imageUrl = awsS3Service.saveImageToS3Bucket(photo);
            Room room = new Room();
            room.setRoomPhotoUrl(imageUrl);
            room.setRoomType(roomType);
            room.setRoomPrice(roomPrice);
            room.setRoomDescription(description);

            Room savedRoom = roomRepository.save(room);
            RoomDTO roomDTO = EntityConverterAndCodeGenerator.convertRoomEntityToRoomDTO(savedRoom);

            response.setStatusCode(200);
            response.setMessage("Successful :)");
            response.setRoom(roomDTO);
        } catch (Exception e) {
            response.setStatusCode(500);
            response.setMessage("Error occurred when saving a room " + e.getMessage());
        }
        return response;
    }

    @Override
    public List<String> getAllRoomTypes() {
        return roomRepository.findDistinctRoomTypes();
    }

    @Override
    public Response getAllRooms() {
        Response response = new Response();

        try {
            List<Room> roomList = roomRepository.findAll(
                    Sort.by(Sort.Direction.DESC, "id"));

            List<RoomDTO> roomDTOList = EntityConverterAndCodeGenerator
                    .convertRoomListEntityToRoomListDTO(roomList);

            response.setStatusCode(200);
            response.setMessage("Successful :)");
            response.setRoomList(roomDTOList);
        } catch (Exception e) {
            response.setStatusCode(500);
            response.setMessage("Error occurred when getting all rooms " + e.getMessage());
        }
        return response;
    }

    @Override
    public Response deleteRoom(Long roomId) {
        Response response = new Response();

        try {
            roomRepository.findById(roomId).
                    orElseThrow(() -> new GlobalException("Room Not Found !"));

            roomRepository.deleteById(roomId);
            response.setStatusCode(200);
            response.setMessage("Successful :/");
        }catch (GlobalException e) {
            response.setStatusCode(404);
            response.setMessage(e.getMessage());
        } catch (Exception e) {
            response.setStatusCode(500);
            response.setMessage("Error occurred when deleting that room " + e.getMessage());
        }
        return response;
    }

    @Override
    public Response updateRoom(Long roomId,String description, String roomType,
                               BigDecimal roomPrice, MultipartFile photo) {

        Response response = new Response();
        try {
            String imageUrl = null;

            if (photo != null && !photo.isEmpty()) {
                imageUrl = awsS3Service.saveImageToS3Bucket(photo);
            }

            Room room = roomRepository.findById(roomId)
                            .orElseThrow(() -> new GlobalException("Room Not Found !"));

            if (roomType != null) room.setRoomType(roomType);
            if (roomPrice != null) room.setRoomPrice(roomPrice);
            if (description != null) room.setRoomDescription(description);
            if (imageUrl != null) room.setRoomPhotoUrl(imageUrl);

            Room updatedRoom = roomRepository.save(room);
            RoomDTO roomDTO = EntityConverterAndCodeGenerator
                    .convertRoomEntityToRoomDTO(updatedRoom);

            response.setStatusCode(200);
            response.setMessage("Successful :)");
            response.setRoom(roomDTO);
        }catch (GlobalException e) {
            response.setStatusCode(404);
            response.setMessage(e.getMessage());
        } catch (Exception e) {
            response.setStatusCode(500);
            response.setMessage("Error occurred when updating that room " + e.getMessage());
        }
        return response;
    }

    @Transactional
    @Override
    public Response getRoomById(Long roomId) {
        Response response = new Response();

        try {
            Room room = roomRepository.findById(roomId).
                    orElseThrow(() -> new GlobalException("Room Not Found !"));

            RoomDTO roomDTO = EntityConverterAndCodeGenerator
                    .convertRoomEntityToRoomDTOWithBookings(room);

            response.setStatusCode(200);
            response.setMessage("Successful :/");
            response.setRoom(roomDTO);
        }catch (GlobalException e) {
            response.setStatusCode(404);
            response.setMessage(e.getMessage());
        } catch (Exception e) {
            response.setStatusCode(500);
            response.setMessage("Error occurred when getting that room by id " + e.getMessage());
        }
        return response;
    }

    @Override
    public Response getAvailableRoomsByDateAndType(LocalDate checkInDate, LocalDate checkOutDate, String roomType) {
        Response response = new Response();

        try {
            if (checkInDate.isAfter(checkOutDate)) {
                response.setStatusCode(400);
                response.setMessage("Check-in date must be before the check-out date!");
                return response;
            }

            List<Room> availableRooms = roomRepository.findAvailableRoomsByDateAndTypes(
                    checkInDate, checkOutDate, roomType);

            List<RoomDTO> roomDTOList = EntityConverterAndCodeGenerator
                    .convertRoomListEntityToRoomListDTO(availableRooms);

            response.setStatusCode(200);
            response.setMessage("Successful :)");
            response.setRoomList(roomDTOList);
        } catch (Exception e) {
            response.setStatusCode(500);
            response.setMessage("Error occurred when getting available rooms by date and type " + e.getMessage());
        }
        return response;
    }

    @Override
    public Response getAllAvailableRooms() {
        Response response = new Response();

        try {
            List<Room> roomList = roomRepository.getAllAvailableRooms();
            List<RoomDTO> roomDTOList = EntityConverterAndCodeGenerator
                    .convertRoomListEntityToRoomListDTO(roomList);

            response.setStatusCode(200);
            response.setMessage("Successful :)");
            response.setRoomList(roomDTOList);
        } catch (GlobalException e) {
            response.setStatusCode(404);
            response.setMessage(e.getMessage());
        } catch (Exception e) {
            response.setStatusCode(500);
            response.setMessage("Error occurred when getting all available rooms " + e.getMessage());
        }
        return response;
    }
}
