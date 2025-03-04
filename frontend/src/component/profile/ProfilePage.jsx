import React, { useEffect, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import ApiService from "../../service/ApiService";
import './ProfilePage.css';
import Swal from "sweetalert2";

const ProfilePage = () => {
    const [user, setUser] = useState(null);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const getUserProfile = async () => {
            try {
                const response = await ApiService.getUserProfile();
                
                // get user bookings
                const userWithBookings = await ApiService.getUserBookingHistory(response.user.id);
                setUser(userWithBookings.user); 
            } catch (error) {
                setError(error.response?.data?.message || error.message);
            }
        };
        getUserProfile();
    }, []);

    const handleLogout = () => {
        Swal.fire({
            title: "Are You Sure ?",
            text: "You will be logged out of your account.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#DC3545",
            cancelButtonColor: "#6C757D",
            confirmButtonText: "Yes, logout!",
            cancelButtonText: "Cancel"
        }).then((result) => {
            if(result.isConfirmed) {
                ApiService.logout();
                localStorage.removeItem("user");
                navigate('/home');
                Swal.fire(
                    "Logged Out",
                    "You have been successfully logged out.",
                    "success"
                );
            }
        });
    };

    const deleteProfile = () => {
        navigate('/edit-profile');
    };

    return (
        <div className="profile-page">
            {user && <h2>Welcome, {user.name}</h2>}
            <div className="profile-actions">
                <hr/>
                <button className="edit-profile-button" onClick={deleteProfile}>Edit Profile</button>
                <button className="logout-button" onClick={handleLogout}>Logout</button>
            </div>
            {error && <p className="error-message">{error}</p>}
            {user && (
                <div className="profile-details">
                    <hr/>
                    <h3>My Profile Details</h3>
                    <p><strong>Email:</strong>{user.email}</p>
                    <p><strong>Phone Number:</strong>{user.phoneNumber}</p>
                </div>
            )}
            <div className="booking-history-section">
                <hr/>
                <h3>My Booking History</h3>
                <div className="booking-list">
                    {user && user.bookings.length > 0 ? (
                        user.bookings.map((booking) => (
                            <div key={booking.id} className="booking-item">
                                <p><strong>Booking Code:</strong> {booking.bookingConfirmationCode}</p>
                                <p><strong>Check-in Date:</strong> {booking.checkInDate}</p>
                                <p><strong>Check-out Date:</strong> {booking.checkOutDate}</p>
                                <p><strong>Total Guests:</strong> {booking.totalNumOfGuests}</p>
                                <p><strong>Room Type:</strong> {booking.room.roomType}</p>
                                <img src={booking.room.roomPhotoUrl} alt="Room" className="room-photo" />
                            </div>
                        ))
                    ): (
                        <p>Bookings Not Found.</p>
                    )}
                </div>
            </div>
        </div>
    )
}

export default ProfilePage;