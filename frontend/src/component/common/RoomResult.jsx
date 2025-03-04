import React from 'react';
import { useNavigate } from 'react-router-dom';
import ApiService from '../../service/ApiService';
import './RoomResult.css';

const RoomResult = ({ roomSearchResults }) => {
    const navigate = useNavigate(); // Initialize useNavigate hook
    const isAdmin = ApiService.isAdmin();

    const handleAuthentication = (roomId) => {
        const token = localStorage.getItem("token");
        if (token) {
            navigate(`/room-details-book/${roomId}`);
        } else {
            navigate('/login');
        }
    };

    return (
        <section className="room-results">
            {roomSearchResults && roomSearchResults.length > 0 && (
                <div className="room-list">
                    {roomSearchResults.map(room => (
                        <div key={room.id} className="room-list-item">
                            <img className='room-list-item-image' src={room.roomPhotoUrl} alt={room.roomType} />
                            <div className="room-details">
                                <h3>{room.roomType}</h3>
                                <p>Price: ${room.roomPrice} / night</p>
                                <p>Description: {room.roomDescription}</p>
                            </div>

                            <div className='book-now-div'>
                                {isAdmin ? (
                                    <button
                                        className="edit-room-button"
                                        onClick={() => navigate(`/admin/edit-room/${room.id}`)}
                                    >
                                        Edit Room
                                    </button>
                                ) : (
                                    <button
                                        className="book-now-button"
                                        onClick={() => handleAuthentication(room.id)}
                                    >
                                        View/Book Now
                                    </button>
                                )}
                            </div>

                        </div>
                    ))}
                </div>
            )}
        </section>
    );
}

export default RoomResult;