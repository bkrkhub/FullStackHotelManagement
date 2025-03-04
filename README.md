# 🏖️ Full Stack Hotel Management
This project is a modern and secure hotel management system developed using React.js and Spring Boot. In the system, secure authentication is provided using Spring Security and JWT, and users are authorized according to their roles.

Users can perform full CRUD operations on reservation (Booking), room (Room) and user (User) management depending on their authorization.

In this way, the system facilitates hotel booking processes while offering a secure, scalable and user-friendly structure. 🚀

---

## 🌐 API ENDPOINTS

| HTTP Method | Endpoint | Name |
|------------|----------|------|
| **POST** | `/auth/register` | registerUser |
| **POST** | `/auth/login` | loginUser |
| **GET** | `/users/all` | getAllUsers |
| **GET** | `/users/get-by-id/{userId}` | getUserById |
| **GET** | `/users/get-logged-in-profile-info` | getLoggedInUserInfo |
| **GET** | `/users/get-user-bookings/{userId}` | getUserBookingHistory |
| **DELETE** | `/users/delete/{userId}` | deleteUser |
| **PUT** | `/users/update/{userId}` | updateUser |
| **PUT** | `/booking/update-booking/{bookingId}` | updateBooking |
| **POST** | `/rooms/add` | addRoom |
| **GET** | `/rooms/types` | getRoomTypes |
| **GET** | `/rooms/all` | getAllRooms |
| **GET** | `/rooms/room-by-id/{roomId}` | getRoomById |
| **DELETE** | `/rooms/delete/{roomId}` | deleteRoomById |
| **PUT** | `/rooms/update/{roomId}` | updateRoomById |
| **GET** | `/rooms/get-all-available-rooms` | getAllAvailableRooms |
| **GET** | `/rooms/available-rooms-by-date-and-type` | getAllAvailableRoomsByDate |
| **POST** | `/booking/book-room/{roomId}/{userId}` | bookRoom |
| **GET** | `/booking/all` | getAllBookings |
| **GET** | `/booking/get-by-confirmation-code/{confirmationCode}` | getBookingByConfirmationCode |
| **DELETE** | `/booking/cancel-booking/{bookingId}` | cancelBooking |


---
