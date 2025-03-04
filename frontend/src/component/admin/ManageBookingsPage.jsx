import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ApiService from "../../service/ApiService";
import Pagination from "../common/Pagination";
import './ManageBookingsPage.css';
import bookingsImage from "../../assets/images/bookings.jpg";

const ManageBookingsPage = () => {
    const [bookings, setBookings] = useState([]);
    const [filteredBookings, setFilteredBookings] = useState([]);
    const [searchCode, setSearchCode] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [bookingsPerPage] = useState(6);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchBookings = async () => {
            try {
                const response = await ApiService.getAllBookings();
                const allBookings = response.bookingList;
                setBookings(allBookings);
                setFilteredBookings(allBookings);
            } catch (error) {
                console.error('Error occurred when getting bookings: ', error.message);
            }
        };
        fetchBookings();
    }, []);

    useEffect(() => {
        filterBookings(searchCode);
    }, [searchCode, bookings]);

    const filterBookings = (term) => {
        if(term === '') {
            setFilteredBookings(bookings);
        } else {
            const filtered = bookings.filter((booking) => 
                booking.bookingConfirmationCode && booking.bookingConfirmationCode.toLowerCase().includes(term.toLowerCase())
            );
            setFilteredBookings(filtered);
        }
        setCurrentPage(1);
    };

    const handleSearchChange = (e) => {
        setSearchCode(e.target.value);
    };

    // Paginate
    const indexOfLastBooking = currentPage * bookingsPerPage;
    const indexOfFirstBooking = indexOfLastBooking - bookingsPerPage;
    const currentBookings = filteredBookings.slice(indexOfFirstBooking, indexOfLastBooking);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    return (
        <div className="manage-bookings-page">
            <div className="manage-bookings-container">
                {/* Left Side - Header and Filtering */}
                <div className="manage-bookings-content">
                    <h2 className="manage-bookings-title">Manage Bookings</h2>
                    <div className="filter-section">
                        <label className="filter-label">Filter by Booking Number:</label>
                        <input
                            type="text"
                            value={searchCode}
                            onChange={handleSearchChange}
                            placeholder="Enter booking number"
                            className="filter-input"
                        />
                    </div>
                </div>

                {/* Right Side - Visual */}
                <div className="manage-bookings-image">
                    <img src={bookingsImage} alt="Bookings Illustration" />
                </div>
            </div>

            {/* Booking Cards */}
            <div className="booking-results">
                {currentBookings.map((booking) => (
                    <div key={booking.id} className="booking-result-item">
                        <p><strong>Booking Code:</strong> {booking.bookingConfirmationCode}</p>
                        <p><strong>Check In Date:</strong> {booking.checkInDate}</p>
                        <p><strong>Check out Date:</strong> {booking.checkOutDate}</p>
                        <p><strong>Total Guests:</strong> {booking.totalNumOfGuests}</p>
                        <button
                            className="edit-room-button"
                            onClick={() => navigate(`/admin/edit-booking/${booking.bookingConfirmationCode}`)}
                        >Manage Booking</button>
                    </div>
                ))}
            </div>

            <Pagination
                roomsPerPage={bookingsPerPage}
                totalRooms={filteredBookings.length}
                currentPage={currentPage} 
                paginate={paginate}
            />
        </div>
    );
};

export default ManageBookingsPage;