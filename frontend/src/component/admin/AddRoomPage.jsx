import React, { useEffect, useState } from "react";
import ApiService from "../../service/ApiService";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import "./AddRoomPage.css";
import placeholderImage from "../../assets/images/newRoom.jpg";

const AddRoomPage = () => {
    const navigate = useNavigate();
    const [roomDetails, setRoomDetails] = useState({
        roomPhotoUrl: '',
        roomType: '',
        roomPrice: '',
        roomDescription: '',
    });

    const [file, setFile] = useState(null);
    const [preview, setPreview] = useState(placeholderImage); // Default image
    const [roomTypes, setRoomTypes] = useState([]);
    const [newRoomType, setNewRoomType] = useState(false);

    useEffect(() => {
        const fetchRoomTypes = async () => {
            try {
                const types = await ApiService.getRoomTypes();
                setRoomTypes(types);
            } catch (error) {
                console.error("Error fetching room types:", error.message);
            }
        };
        fetchRoomTypes();
    }, []);

    const checkTheChange = (e) => {
        const { name, value } = e.target;
        setRoomDetails(prevState => ({
            ...prevState,
            [name]: value,
        }));
    };

    const handleRoomTypeChange = (e) => {
        if (e.target.value === "new") {
            setNewRoomType(true);
            setRoomDetails(prevState => ({ ...prevState, roomType: "" }));
        } else {
            setNewRoomType(false);
            setRoomDetails(prevState => ({ ...prevState, roomType: e.target.value }));
        }
    };

    const checkTheFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            setFile(selectedFile);
            setPreview(URL.createObjectURL(selectedFile));
        } else {
            setFile(null);
            setPreview(placeholderImage);
        }
    };

    const addRoom = async () => {
        if (!roomDetails.roomType || !roomDetails.roomPrice || !roomDetails.roomDescription) {
            Swal.fire({
                icon: "error",
                title: "Missing Information",
                text: "All room details must be provided!",
                timer: 5000,
                timerProgressBar: true
            });
            return;
        }

        const conclusion = await Swal.fire({
            title: "Are You Sure?",
            text: "Do you want to add this room?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, add it!"
        });

        if (!conclusion.isConfirmed) {
            return;
        }

        try {
            const formData = new FormData();
            formData.append("roomType", roomDetails.roomType);
            formData.append("roomPrice", roomDetails.roomPrice);
            formData.append("roomDescription", roomDetails.roomDescription);

            if (file) {
                formData.append("photo", file);
            }

            const result = await ApiService.addRoom(formData);
            if (result.statusCode === 200) {
                await Swal.fire({
                    icon: "success",
                    title: "Room Added Successfully!",
                    text: "The room has been successfully added to the system.",
                    timer: 3000,
                    timerProgressBar: true,
                    showConfirmButton: false
                });
                navigate("/admin/manage-rooms");
            }
        } catch (error) {
            Swal.fire({
                icon: "error",
                title: "Error Occurred",
                text: error.response?.data?.message || error.message,
                confirmButtonColor: "#d33"
            });
        }
    };

    return (
        <div className="add-room-container">
            <h2>Add New Room</h2>
            <div className="add-room-content">
                {/* Left Side Form Section */}
                <div className="add-room-form-section">
                    <div className="add-room-form-group">
                        <label>Room Type:</label>
                        <select value={roomDetails.roomType} onChange={handleRoomTypeChange}>
                            <option value="">Select a room type</option>
                            {roomTypes.map(type => (
                                <option key={type} value={type}>{type}</option>
                            ))}
                            <option value="new">Other (please specify)</option>
                        </select>
                    </div>
                    {newRoomType && (
                        <div className="add-room-form-group">
                            <label>New Room Type:</label>
                            <input
                                type="text"
                                name="roomType"
                                placeholder="Enter new room type"
                                value={roomDetails.roomType}
                                onChange={checkTheChange}
                            />
                        </div>
                    )}
                    <div className="add-room-form-group">
                        <label>Room Price:</label>
                        <input
                            type="text"
                            name="roomPrice"
                            placeholder="Enter room price/night"
                            value={roomDetails.roomPrice}
                            onChange={checkTheChange}
                        />
                    </div>
                    <div className="add-room-form-group">
                        <label>Room Description:</label>
                        <textarea
                            name="roomDescription"
                            placeholder="Enter a description for the new room"
                            value={roomDetails.roomDescription}
                            onChange={checkTheChange}
                        ></textarea>
                    </div>
                    <div className="add-room-form-group">
                        <label>Upload Room Photo:</label>
                        <input type="file" onChange={checkTheFileChange} />
                    </div>
                    <button className="add-room-button" onClick={addRoom}>Add Room</button>
                </div>

                {/* Preview Image on Right Side */}
                <div className="add-room-preview-section">
                    <img src={preview} alt="Room Preview" className="room-photo-preview" />
                </div>
            </div>
        </div>
    );
};

export default AddRoomPage;