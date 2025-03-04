import React, { useEffect, useState } from "react";
import ApiService from '../../service/ApiService';
import Pagination from '../common/Pagination';
import RoomResult from '../common/RoomResult';
import SearchRooms from '../common/SearchRooms';
import '../bookingRooms/RoomsPage.css';

const RoomsPage = () => {
    const [rooms, setRooms] = useState([]);
    const [filteredRooms, setFilteredRooms] = useState([]);
    const [roomTypes, setRoomTypes] = useState([]);
    const [selectedRoomType, setSelectedRoomType] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [roomsPerPage] = useState(5);

    const handleSearchResults = (results) => {
        setRooms(results);
        setFilteredRooms(results);
    };

    useEffect(() => {
        const fetchRooms = async () => {
            try {
                const response = await ApiService.getAllRooms();
                setRooms(response.roomList);
                setFilteredRooms(response.roomList);
            } catch (error) {
                console.error('Error fetching rooms:', error.message);
            }
        };

        const fetchRoomTypes = async () => {
            try {
                const types = await ApiService.getRoomTypes();
                setRoomTypes(types);
            } catch (error) {
                console.error('Error fetching room types:', error.message);
            }
        };

        fetchRooms();
        fetchRoomTypes();
    }, []);

    const handleRoomTypeChange = (e) => {
        setSelectedRoomType(e.target.value);
        filterRooms(e.target.value);
    };
    
    const filterRooms = (type) => {
        if (type === '') {
          setFilteredRooms(rooms);
        } else {
          const filtered = rooms.filter((room) => room.roomType === type);
          setFilteredRooms(filtered);
        }
        setCurrentPage(1); // Reset to first page after filtering
    };

    // Pagination
    const indexOfLastRoom = currentPage * roomsPerPage;
    const indexOfFirstRoom = indexOfLastRoom - roomsPerPage;
    const currentRooms = filteredRooms.slice(indexOfFirstRoom, indexOfLastRoom);

    // Change page
    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    return (
        <div className="rooms-page">
            {/* Premium Header Alanı */}
            <div className="hero-section">
                <div className="hero-overlay"></div>
                <div className="hero-content">
                    <h1>Discover Your</h1>
                    <h3>Perfect Stay</h3>
                    <SearchRooms handleSearchResult={handleSearchResults} className="rooms-search-container"/>
                    <label className="room-filter-label">Filter by Room Type:</label>
                        <select value={selectedRoomType} onChange={handleRoomTypeChange}>
                            <option value="">All</option>
                            {roomTypes.map((type) => (
                            <option key={type} value={type}>
                                {type}
                            </option>
          ))}
        </select>
                </div>
            </div>

            <RoomResult roomSearchResults={filteredRooms.slice((currentPage - 1) * roomsPerPage, currentPage * roomsPerPage)} />

            <Pagination
                roomsPerPage={roomsPerPage}
                totalRooms={filteredRooms.length}
                currentPage={currentPage}
                paginate={paginate}
            />
        </div>
    );
};

export default RoomsPage;
