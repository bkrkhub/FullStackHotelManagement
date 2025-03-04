import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import ApiService from "../../service/ApiService";
import Swal from "sweetalert2";
import "./AddRoomPage.css";
import placeholderImage from "../../assets/images/newRoom.jpg";
import './EditRoomPage.css';

const EditRoomPage = () => {
    const { roomId } = useParams();
    const navigate = useNavigate();

    const [roomDetails, setRoomDetails] = useState({
        roomPhotoUrl: "",
        roomType: "",
        roomPrice: "",
        roomDescription: "",
    });

    const [file, setFile] = useState(null);
    const [preview, setPreview] = useState(placeholderImage);
    const [roomTypes, setRoomTypes] = useState([]);
    const [newRoomType, setNewRoomType] = useState(false);

    useEffect(() => {
        const fetchRoomDetails = async () => {
            try {
                const response = await ApiService.getRoomById(roomId);
                setRoomDetails({
                    roomPhotoUrl: response.room.roomPhotoUrl,
                    roomType: response.room.roomType,
                    roomPrice: response.room.roomPrice,
                    roomDescription: response.room.roomDescription,
                });

                if (response.room.roomPhotoUrl) {
                    setPreview(response.room.roomPhotoUrl);
                }
            } catch (error) {
                Swal.fire({
                    icon: "error",
                    title: "Error!",
                    text: error.response?.data?.message || "Failed to fetch room details.",
                    confirmButtonColor: "#d33",
                });
            }
        };

        const fetchRoomTypes = async () => {
            try {
                const types = await ApiService.getRoomTypes();
                setRoomTypes(types);
            } catch (error) {
                console.error("Error fetching room types:", error.message);
            }
        };

        fetchRoomDetails();
        fetchRoomTypes();
    }, [roomId]);

    const checkTheChange = (e) => {
        const { name, value } = e.target;
        setRoomDetails((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };

    const handleRoomTypeChange = (e) => {
        if (e.target.value === "new") {
            setNewRoomType(true);
            setRoomDetails((prevState) => ({ ...prevState, roomType: "" }));
        } else {
            setNewRoomType(false);
            setRoomDetails((prevState) => ({ ...prevState, roomType: e.target.value }));
        }
    };

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            setFile(selectedFile);
            setPreview(URL.createObjectURL(selectedFile));
        } else {
            setFile(null);
            setPreview(placeholderImage);
        }
    };

    const handleUpdate = async () => {
        if (!roomDetails.roomType || !roomDetails.roomPrice || !roomDetails.roomDescription) {
            Swal.fire({
                icon: "error",
                title: "Missing Information",
                text: "All room details must be provided!",
                timer: 5000,
                timerProgressBar: true,
            });
            return;
        }

        const conclusion = await Swal.fire({
            title: "Are You Sure?",
            text: "Do you want to update this room?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, update it!",
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

            const result = await ApiService.updateRoomById(roomId, formData);
            if (result.statusCode === 200) {
                await Swal.fire({
                    icon: "success",
                    title: "Room Updated Successfully!",
                    text: "The room has been successfully updated.",
                    timer: 3000,
                    timerProgressBar: true,
                    showConfirmButton: false,
                });
                navigate("/admin/manage-rooms");
            }
        } catch (error) {
            Swal.fire({
                icon: "error",
                title: "Error Occurred",
                text: error.response?.data?.message || error.message,
                confirmButtonColor: "#d33",
            });
        }
    };

    const handleDelete = async () => {
        Swal.fire({
            title: "Are you sure?",
            text: "Do you want to delete this room?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "#3085d6",
            confirmButtonText: "Yes, delete it!",
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    const res = await ApiService.deleteRoomById(roomId);
                    if (res.statusCode === 200) {
                        Swal.fire({
                            icon: "success",
                            title: "Deleted!",
                            text: "Room deleted successfully.",
                            confirmButtonColor: "#28a745",
                        }).then(() => {
                            navigate("/admin/manage-rooms");
                        });
                    }
                } catch (error) {
                    Swal.fire({
                        icon: "error",
                        title: "Error!",
                        text: error.response?.data?.message || error.message,
                        confirmButtonColor: "#d33",
                    });
                }
            }
        });
    };

    return (
        <div className="update-room-container">
            <h2>Update Room</h2>
            <div className="update-room-content">
                <div className="update-room-form-section">
                    <div className="update-room-form-group">
                        <label>Room Type:</label>
                        <select value={roomDetails.roomType} onChange={handleRoomTypeChange}>
                            <option value="">Select a room type</option>
                            {roomTypes.map((type) => (
                                <option key={type} value={type}>
                                    {type}
                                </option>
                            ))}
                            <option value="new">Other (please specify)</option>
                        </select>
                    </div>
                    {newRoomType && (
                        <div className="update-room-form-group">
                            <label>New Room Type:</label>
                            <input type="text" name="roomType" value={roomDetails.roomType} onChange={checkTheChange} />
                        </div>
                    )}
                    <div className="update-room-form-group">
                        <label>Room Price:</label>
                        <input type="text" name="roomPrice" value={roomDetails.roomPrice} onChange={checkTheChange} />
                    </div>
                    <div className="update-room-form-group">
                        <label>Room Description:</label>
                        <textarea name="roomDescription" value={roomDetails.roomDescription} onChange={checkTheChange}></textarea>
                    </div>
                    <div className="update-room-form-group">
                        <label>Upload Room Photo:</label>
                        <input type="file" onChange={handleFileChange} />
                    </div>
                    <div className="update-room-buttons">
                        <button className="update-room-button" onClick={handleUpdate}>
                            Update Room
                        </button>
                        <button className="delete-room-button" onClick={handleDelete}>
                            Delete Room
                        </button>
                    </div>
                </div>
                <div className="update-room-preview-section">
                    <img src={preview} alt="Room Preview" className="room-photo-preview" />
                </div>
            </div>
        </div>
    );
};

export default EditRoomPage;
