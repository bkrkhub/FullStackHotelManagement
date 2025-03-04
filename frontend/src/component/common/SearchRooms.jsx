import React, {useState, useEffect} from "react";
import DatePicker from "react-datepicker";
import 'react-datepicker/dist/react-datepicker.css';
import ApiService from '../../service/ApiService';
import './SearchRooms.css';
import Swal from "sweetalert2";
import "sweetalert2/dist/sweetalert2.min.css";

const SearchRooms = ({handleSearchResult}) => {
    
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [roomType, setRoomType] = useState('');
    const [roomTypes, setRoomTypes] = useState([]);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchRoomTypes = async () => {
            try {
                const types = await ApiService.getRoomTypes();
                setRoomTypes(types);
            } catch (error) {
                console.log(error.message);
            }
        }
        fetchRoomTypes();
    }, []);

    const showError = (message) => {
        Swal.fire({
            title: "Error",
            text: message,
            icon: "error",
            confirmButtonText: "OK"
        });
    };

    const handleInternalSearch = async () => {
        if (!startDate || !endDate || !roomType) {
            showError("Please select check-in & check-out dates and a room type.");
            return;
        }

        try {
            const formattedStartDate = startDate ? startDate.toISOString().split('T')[0] : null;
            const formattedEndDate = endDate ? endDate.toISOString().split('T')[0] : null;

            const response = await ApiService.getAvailableRoomsByDateAndType(
                formattedStartDate, formattedEndDate, roomType
            );

            if (response.statusCode === 200) {
                if (response.roomList.length === 0) {
                    showError("No rooms available for the selected date range and room type. Please try different dates or room options.");
                    return;
                }
                handleSearchResult(response.roomList);
            }

        } catch (error) {
            showError(error?.response?.data?.message || "An error occurred while searching for rooms.");
        }
    };

    return (
        <section>
            <div className="search-container">
                <div className="search-field">
                    <label>Check-In Date</label>
                    <DatePicker
                        selected={startDate}
                        onChange={(date) => setStartDate(date)}
                        minDate={new Date()} //  // Prevents choosing before today
                        dateFormat="dd/MM/yyyy"
                        placeholderText="Select Check-In Date"
                    />    
                </div>
                <div className="search-field">
                    <label>Check-Out Date</label>
                    <DatePicker
                        selected={endDate}
                        onChange={(date) => setEndDate(date)}
                        minDate={new Date()} //  // Prevents choosing before today
                        dateFormat="dd/MM/yyyy"
                        placeholderText="Select Check-Out Date"
                    />
                </div>
                <div className="search-field">
                    <label>Room Types</label>
                    <select value={roomType} onChange={(e) => setRoomType(e.target.value)}>
                        <option disabled value="">Select Room Type</option>
                        {roomTypes.map((roomType) => (
                            <option key={roomType} value={roomType}>
                                {roomType}
                            </option>
                        ))}
                    </select> 
                </div>
                <button className="home-search-button" onClick={handleInternalSearch}>
                    Search Rooms
                </button>
            </div>
            {error && <p className="error-message">{error}</p>}
        </section>
    );
}

export default SearchRooms;