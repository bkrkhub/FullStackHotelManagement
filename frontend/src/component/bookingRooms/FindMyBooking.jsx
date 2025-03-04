import React, { useState } from "react";
import ApiService from "../../service/ApiService";
import './FindMyBooking.css';
import Swal from "sweetalert2";

const FindMyBooking = () => {
    const [confirmationCode, setConfirmationCode] = useState('');
    const [bookingDetails, setBookingDetails] = useState(null);

    const handleSearch = async () => {
        if (!confirmationCode.trim()) {
            Swal.fire({
                title: "Error",
                text: "Please enter your booking confirmation code",
                icon: "error",
                confirmButtonText: "OK"
            });
            return;
        }

        try {
            const response = await ApiService.getBookingByConfirmationCode(confirmationCode);
            setBookingDetails(response.booking);

            Swal.fire({
                title: "Booking Found!",
                text: `Your booking with confirmation code "${confirmationCode}" has been found.`,
                icon: "success",
                confirmButtonText: "OK"
            });

        } catch (error) {
            Swal.fire({
                title: "Error",
                text: error.response?.data?.message || "An error occurred while searching for the booking.",
                icon: "error",
                confirmButtonText: "OK"
            });
        }
    };

    return (
        <div className="find-booking-page">
            <div className="find-booking-search-container">
                <h2 className="find-booking-h2">Find My Booking</h2>
                <div className="find-booking-input-group">
                    <input
                        type="text"
                        placeholder="Enter Your Booking Confirmation Code"
                        value={confirmationCode}
                        onChange={(e) => setConfirmationCode(e.target.value)}
                    />
                    <button onClick={handleSearch}>Find</button>
                </div>
            </div>

            {bookingDetails && (
                <div className="booking-details">
                    <div className="detail-card">
                        <h3>Your Booking Details</h3>
                        <hr/>
                        <p><strong>Confirmation Code:</strong> {bookingDetails.bookingConfirmationCode}</p>
                        <p><strong>Check-In Date:</strong> {bookingDetails.checkInDate}</p>
                        <p><strong>Check-Out Date:</strong> {bookingDetails.checkOutDate}</p>
                        <p><strong>Number Of Adults:</strong> {bookingDetails.numOfAdults}</p>
                        <p><strong>Number Of Children:</strong> {bookingDetails.numOfChildren}</p>
                    </div>

                    <div className="detail-card">
                        <h3>Booker Details</h3>
                        <hr/>
                        <p><strong>Name:</strong> {bookingDetails.user.name}</p>
                        <p><strong>Email:</strong> {bookingDetails.user.email}</p>
                        <p><strong>Phone Number:</strong> {bookingDetails.user.phoneNumber}</p>
                    </div>

                    <div className="detail-card">
                        <h3>Room Details</h3>
                        <hr/>
                        <p><strong>Room Type:</strong> {bookingDetails.room.roomType}</p>
                        <img
                            className="room-image"
                            src={bookingDetails.room.roomPhotoUrl}
                            alt="Room"
                        />
                    </div>
                </div>
            )}
        </div>
    );
};

export default FindMyBooking;
