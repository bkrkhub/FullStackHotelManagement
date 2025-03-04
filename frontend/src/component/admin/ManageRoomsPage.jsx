import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ApiService from "../../service/ApiService";
import Pagination from "../common/Pagination";
import RoomResult from "../common/RoomResult";
import "./ManageRoomsPage.css";
import roomsImage from "../../assets/images/rooms.jpg";

const ManageRoomsPage = () => {
    const [rooms, setRooms] = useState([]);
    const [filteredRooms, setFilteredRooms] = useState([]);
    const [roomTypes, setRoomTypes] = useState([]);
    const [selectedRoomType, setSelectedRoomType] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [roomsPerPage] = useState(5);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchRooms = async () => {
            try {
                const response = await ApiService.getAllRooms();
                const allRooms = response.roomList;
                setRooms(allRooms);
                setFilteredRooms(allRooms);
            } catch (error) {
                console.error('Error occurred when filtering rooms: ', error.message);                
            }
        };

        const fetchRoomTypes = async () => {
            try {
                const roomTypes = await ApiService.getRoomTypes();
                setRoomTypes(roomTypes);
            } catch (error) {
                console.error('Error occured when getting all room types: ', error.message);
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
        setCurrentPage(1);
    };

    // Paginate
    const indexOfLastRoom = currentPage * roomsPerPage;
    const indexOfFirstRoom = indexOfLastRoom - roomsPerPage;
    const currentRooms = filteredRooms.slice(indexOfFirstRoom, indexOfLastRoom);

    // Changes page
    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    return (
        <div className="manage-rooms-page">
            <div className="manage-rooms-container">
                {/* Left Side - Header and Filter */}
                <div className="manage-rooms-content">
                    <h2 className="manage-rooms-title">Manage Rooms</h2>
                    <div className="filter-section">
                        <label className="filter-label">Filter by Room Type:</label>
                        <select value={selectedRoomType} onChange={handleRoomTypeChange} className="filter-select">
                            <option value="">All</option>
                            {roomTypes.map((type) => (
                                <option key={type} value={type}>{type}</option>
                            ))}
                        </select>
                        <button className="add-room-button" onClick={() => navigate('/admin/add-room')}>
                            Add Room
                        </button>
                    </div>
                </div>

                {/* Right Side - Image */}
                <div className="manage-rooms-image">
                    <img src={roomsImage} alt="Rooms Illustration" />
                </div>
            </div>

            {/* Room List */}
            <RoomResult roomSearchResults={currentRooms} />
            <Pagination
                roomsPerPage={roomsPerPage}
                totalRooms={filteredRooms.length}
                currentPage={currentPage}
                paginate={paginate}
            />
        </div>
    );
};

export default ManageRoomsPage;
