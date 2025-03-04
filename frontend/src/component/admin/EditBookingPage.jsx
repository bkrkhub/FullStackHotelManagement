import React, { useEffect, useState } from "react";
import ApiService from "../../service/ApiService";
import { useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";
import DatePicker from "react-datepicker";  
import "react-datepicker/dist/react-datepicker.css"; 
import { format } from "date-fns"; 
import "./EditBookingPage.css";
import bookingImage from "../../assets/images/editBooking.jpg"; 

const EditBookingPage = () => {
    const navigate = useNavigate();
    const { bookingCode } = useParams();
    const [bookingDetails, setBookingDetails] = useState(null);
    const [updatedBooking, setUpdatedBooking] = useState(null);
    const [rooms, setRooms] = useState([]);

    useEffect(() => {
        console.log("📌 Güncellenmiş Odalar:", rooms);
    }, [rooms]);

    useEffect(() => {
        const fetchBookingAndRooms = async () => {
            try {
                console.log("📌 Booking Code:", bookingCode);
    
                const response = await ApiService.getBookingByConfirmationCode(bookingCode);
                console.log("📌 Booking API Response:", response);
    
                if (!response.booking || !response.booking.room) {
                    throw new Error("Rezervasyon veya oda bilgisi eksik!");
                }
    
                setBookingDetails(response.booking);
    
                setUpdatedBooking({
                    ...response.booking,
                    checkInDate: new Date(response.booking.checkInDate),
                    checkOutDate: new Date(response.booking.checkOutDate),
                    roomId: response.booking.room.id,
                });
    
                const roomsResponse = await ApiService.getAllRooms();
                console.log("📌 getAllRooms API Response:", roomsResponse);
    
                if (roomsResponse.roomList && Array.isArray(roomsResponse.roomList)) {
                    setRooms(roomsResponse.roomList);
                } else {
                    console.error("⚠️ Oda listesi boş!", roomsResponse);
                    setRooms([]);
                }
            } catch (error) {
                console.error("❌ API Hatası:", error);
                Swal.fire({
                    icon: "error",
                    title: "Error!",
                    text: error.response?.data?.message || "Failed to fetch booking details.",
                    confirmButtonColor: "#d33",
                });
            }
        };
    
        fetchBookingAndRooms();
    }, [bookingCode]);
    
    
    
    
    const handleDateChange = (date, field) => {
        setUpdatedBooking((prev) => ({
            ...prev,
            [field]: date,
        }));
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setUpdatedBooking((prev) => ({
            ...prev,
            [name]: value,
        }));
    };
    
    const handleRoomChange = (e) => {
        const selectedRoomId = parseInt(e.target.value, 10);
        const selectedRoom = rooms.find(room => room.id === selectedRoomId);
    
        if (selectedRoom) {
            setUpdatedBooking((prev) => ({
                ...prev,
                roomId: selectedRoom.id,
                room: selectedRoom,
            }));
        }
    };
    
    const cancelBooking = async () => {
        console.log("📌 Cancel Booking - Booking ID:", bookingDetails?.id);
    
        if (!bookingDetails?.id) {
            console.error("❌ Error: Booking ID is undefined!");
            return;
        }
    
        const cancelConfirmation = await Swal.fire({
            title: "Are You Sure?",
            text: "Do you really want to cancel this booking?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, cancel it!",
            cancelButtonText: "No, keep it",
        });
    
        if (!cancelConfirmation.isConfirmed) return;
    
        try {
            const response = await ApiService.cancelBooking(bookingDetails.id);
            console.log("📌 API Response:", response);
    
            if (response.statusCode === 200) {
                await Swal.fire({
                    icon: "success",
                    title: "Booking Canceled!",
                    text: "The booking was successfully canceled.",
                    timer: 3000,
                    showConfirmButton: false,
                });
    
                navigate("/admin/manage-bookings");
            }
        } catch (error) {
            console.error("❌ API Error:", error);
            await Swal.fire({
                icon: "error",
                title: "Cancellation Failed!",
                text: error.response?.data?.message || "An error occurred while canceling the booking.",
                confirmButtonColor: "#d33",
            });
        }
    };
    

    const updateBooking = async () => {
        const updateConfirmation = await Swal.fire({
            title: "Are you sure?",
            text: "Do you want to update this booking?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, update it!",
        });
        
        if(!updateConfirmation.isConfirmed) return;

        try {
            const updateFormData = {
                checkInDate: format(updatedBooking.checkInDate, "yyyy-MM-dd"),
            checkOutDate: format(updatedBooking.checkOutDate, "yyyy-MM-dd"),
            numOfAdults: parseInt(updatedBooking.numOfAdults, 10),
            numOfChildren: parseInt(updatedBooking.numOfChildren, 10),
            roomId: parseInt(updatedBooking.roomId, 10),
            };

            const response = await ApiService.updateBookingById(bookingDetails.id, updateFormData);

            if(response.statusCode === 200) {
                await Swal.fire({
                    icon: "success",
                    title: "Booking Updated!",
                    text: "The booking details have been successfully updated.",
                    timer: 3000,
                    showConfirmButton: false,
                });
                navigate("/admin/manage-bookings");
            }
        } catch (error) {
            Swal.fire({
                icon: "error",
                title: "Update Failed",
                text: error.response?.data?.message || "Couldn't update booking.",
                confirmButtonColor: "#d33",
            });            
        }
    };

    return (
        <div className="edit-booking-container">
            {bookingDetails && updatedBooking && (
                <div className="edit-booking-content">
                    <div className="edit-booking-form-section">
                        <hr />
                        <h3>Booking Details</h3>
                        <div className="edit-booking-form-group">
                            <label>Confirmation Code (readOnly):</label>
                            <input type="text" value={updatedBooking.bookingConfirmationCode} readOnly />
                        </div>

                        <div className="edit-booking-form-group">
                            <label>Check-in Date:</label>
                            <DatePicker
                                selected={updatedBooking.checkInDate}
                                onChange={(date) => handleDateChange(date, "checkInDate")}
                                dateFormat="dd.MM.yyyy"
                                className="date-picker-input"
                            />
                        </div>

                        <div className="edit-booking-form-group">
                            <label>Check-out Date:</label>
                            <DatePicker
                                selected={updatedBooking.checkOutDate}
                                onChange={(date) => handleDateChange(date, "checkOutDate")}
                                dateFormat="dd.MM.yyyy"
                                className="date-picker-input"
                            />
                        </div>

                        <div className="edit-booking-form-group">
                            <label>Number of Adults:</label>
                            <input type="number" name="numOfAdults" value={updatedBooking.numOfAdults} onChange={handleInputChange} />
                        </div>

                        <div className="edit-booking-form-group">
                            <label>Number of Children:</label>
                            <input type="number" name="numOfChildren" value={updatedBooking.numOfChildren} onChange={handleInputChange} />
                        </div>

                        <hr />
                        <h3>Room Details</h3>

                        <div className="edit-booking-form-group">
                            <label>Room's Id:</label>
                            <select value={updatedBooking.roomId || ""} onChange={handleRoomChange}>
                                {rooms.length > 0 ? (
                                    rooms.map((room) => (
                                        <option key={room.id} value={room.id}>
                                            {room.id} - {room.roomType} - {room.roomPrice}₺
                                        </option>
                                    ))
                                ) : (
                                    <option disabled>Loading rooms...</option>
                                )}
                            </select>
                        </div>

                        <div className="edit-booking-form-group">
                            <label>Room Type (readOnly):</label>
                            <input type="text" value={updatedBooking.room.roomType} readOnly />
                        </div>

                        <div className="edit-booking-form-group">
                            <label>Room Price (readOnly):</label>
                            <input type="text" value={updatedBooking.room.roomPrice} readOnly />
                        </div>

                        <div className="edit-booking-form-group">
                            <label>Room Description (readOnly):</label>
                            <input type="text" value={updatedBooking.room.roomDescription} readOnly />
                        </div>

                        <hr />

                        <h3>Booker Details</h3>
                        <div className="edit-booking-form-group">
                            <label>Username (readOnly):</label>
                            <input type="text" value={updatedBooking.user.name} readOnly />
                        </div>

                        <div className="edit-booking-form-group">
                            <label>User Email (readOnly):</label>
                            <input type="text" value={updatedBooking.user.email} readOnly />
                        </div>

                        <div className="edit-booking-form-group">
                            <label>Phone Number (readOnly):</label>
                            <input type="text" value={updatedBooking.user.phoneNumber} readOnly />
                        </div>
                        <hr />
                        <div className="edit-booking-buttons">
                            <button className="update-booking-btn" onClick={updateBooking}>
                                Update Booking
                            </button>
                            <button className="cancel-booking-btn" onClick={() => cancelBooking(bookingDetails.id)}>
                                Cancel Booking
                            </button>
                        </div>
                    </div>
                    <div className="preview-section">
                        <img src={bookingImage} alt="Booking Preview" className="booking-photo-preview" />
                    </div>
                </div>
            )}
        </div>
    );
};

export default EditBookingPage;
