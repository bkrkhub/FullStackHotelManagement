import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import ApiService from "../../service/ApiService";
import DatePicker from "react-datepicker";
import Swal from "sweetalert2";
import "react-datepicker/dist/react-datepicker.css";
import "sweetalert2/dist/sweetalert2.min.css";
import "../bookingRooms/RoomDetails.css";

const RoomDetails = () => {
    const navigate = useNavigate();
    const { roomId } = useParams();
    
    const [roomDetails, setRoomDetails] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    const [checkInDate, setCheckInDate] = useState(null);
    const [checkOutDate, setCheckOutDate] = useState(null);
    const [numOfAdults, setNumOfAdults] = useState(1);
    const [numOfChildren, setNumOfChildren] = useState(0);
    const [totalGuests, setTotalGuests] = useState(1);
    const [totalPrice, setTotalPrice] = useState(0);
    const [userId, setUserId] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            try {
                setIsLoading(true);
                const response = await ApiService.getRoomById(roomId);
                setRoomDetails(response.room);

                const userProfile = await ApiService.getUserProfile();
                setUserId(userProfile.user.id);
            } catch (error) {
                setError(error.response?.data?.message || error.message);
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, [roomId]);

    const confirmTheBooking = async () => {
        if (!checkInDate || !checkOutDate) {
            Swal.fire({
                title: "Error",
                text: "Please select your check-in and check-out dates.",
                icon: "error",
                confirmButtonText: "OK",
            });
            return;
        }

        const oneDay = 24 * 60 * 60 * 1000;
        const startDate = new Date(checkInDate);
        const endDate = new Date(checkOutDate);
        const totalDay = Math.round(Math.abs((endDate - startDate) / oneDay)) + 1;
        const totalGuests = numOfAdults + numOfChildren;
        const roomPricePerNight = roomDetails.roomPrice;
        const totalPrice = roomPricePerNight * totalDay;

        setTotalGuests(totalGuests);
        setTotalPrice(totalPrice);

        Swal.fire({
            title: "Confirm Your Booking",
            html: `
                <p><b>Total Price:</b> $${totalPrice}</p>
                <p><b>Total Guests:</b> ${totalGuests}</p>
                <p><b>Check-in:</b> ${checkInDate.toLocaleDateString()}</p>
                <p><b>Check-out:</b> ${checkOutDate.toLocaleDateString()}</p>
            `,
            icon: "info",
            showCancelButton: true,
            confirmButtonText: "Yes, book it!",
            cancelButtonText: "Cancel",
        }).then((result) => {
            if (result.isConfirmed) {
                acceptTheBooking();
            }
        });
    };

    const acceptTheBooking = async () => {
      try {
          const formattedCheckInDate = checkInDate.toISOString().split("T")[0];
          const formattedCheckOutDate = checkOutDate.toISOString().split("T")[0];
  
          const oneDay = 24 * 60 * 60 * 1000;
          const startDate = new Date(checkInDate);
          const endDate = new Date(checkOutDate);
          const totalDay = Math.round(Math.abs((endDate - startDate) / oneDay)) + 1;
          const calculatedTotalPrice = roomDetails.roomPrice * totalDay;
  
          const booking = {
              checkInDate: formattedCheckInDate,
              checkOutDate: formattedCheckOutDate,
              numOfAdults: numOfAdults,
              numOfChildren: numOfChildren
          };
  
          const response = await ApiService.bookTheRoom(roomId, userId, booking);
  
          if (response.statusCode === 200) {
              Swal.fire({
                  title: "Booking Successful!",
                  html: `
                      <b>Room:</b> ${roomDetails.roomType} <br>
                      <b>Price:</b> $${roomDetails.roomPrice} / night <br>
                      <b>Check-in:</b> ${formattedCheckInDate} <br>
                      <b>Check-out:</b> ${formattedCheckOutDate} <br>
                      <b>Total Guests:</b> ${totalGuests} <br>
                      <b>Total Price:</b> $${calculatedTotalPrice} 
                  `,
                  icon: "success",
                  confirmButtonText: "OK",
              }).then(() => {
                  navigate("/rooms");
              });
          }
      } catch (error) {
          Swal.fire({
              title: "Error",
              text: error.response?.data?.message || error.message,
              icon: "error",
              confirmButtonText: "OK",
          });
      }
  };
  

    if (isLoading) return <p className="room-detail-loading">Loading room details...</p>;
    if (error) return <p className="room-detail-error">{error}</p>;
    if (!roomDetails) return <p className="room-detail-error">Room not found.</p>;

    return (
        <div className="room-details-container">
            <h2>Details of the Room You Are Inspecting</h2>
            <div className="room-details-content">
                <div className="room-booking-form">
                    <label>Check-in Date:</label>
                    <DatePicker
                       selected={checkInDate}
                       onChange={setCheckInDate}
                      dateFormat="dd/MM/yyyy"
                      placeholderText="Please Select Check-In Date"
                      minDate={new Date()}
                    />
                    <label>Check-out Date:</label>
                    <DatePicker
                      selected={checkOutDate}
                      onChange={setCheckOutDate}
                      dateFormat="dd/MM/yyyy"
                      placeholderText="Please Select Check-Out Date"
                      minDate={new Date()}   
                    />
                    <label>Adults:</label>
                    <input type="number" min="1" value={numOfAdults} onChange={(e) => setNumOfAdults(parseInt(e.target.value))} />
                    <label>Children:</label>
                    <input type="number" min="0" value={numOfChildren} onChange={(e) => setNumOfChildren(parseInt(e.target.value))} />
                    <button className="confirm-booking-btn" onClick={confirmTheBooking}>CONFIRM BOOKING</button>
                </div>

                <div className="room-info-section">
                    <img src={roomDetails.roomPhotoUrl} alt="Room" className="room-image" />
                    <h3>{roomDetails.roomType}</h3>
                    <p>Price: ${roomDetails.roomPrice} / night</p>
                    <h4>Existing Booking Details</h4>
                    <ul>
                        {roomDetails.bookings.length > 0 ? (
                            roomDetails.bookings.map((booking, index) => (
                                <li key={index}>Booking {index + 1} - {booking.checkInDate} to {booking.checkOutDate}</li>
                            ))
                        ) : (
                            <li>No existing bookings available.</li>
                        )}
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default RoomDetails;
