import React from "react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ApiService from "../../service/ApiService";
import "./AdminPage.css";
import adminImage from "../../assets/images/admin2.jpg";

const AdminPage = () => {
    const [adminName, setAdminName] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchAdminName = async () => {
            try {
                const response = await ApiService.getUserProfile();
                setAdminName(response.user.name);
            } catch (error) {
                console.error('Error fetching admin details:', error.message);
            }
        };

        fetchAdminName();
    }, []);

    return (
        <div className="admin-page">
            {/* Left Side - content*/}
            <div className="admin-content">
                <h1 className="welcome-message">Welcome, {adminName}</h1>
                <div className="admin-actions">
                    <button className="admin-button manage-rooms-button" onClick={() => navigate("/admin/manage-rooms")}>
                        Manage Rooms
                    </button>
                    <button className="admin-button manage-bookings-button" onClick={() => navigate("/admin/manage-bookings")}>
                        Manage Bookings
                    </button>
                </div>
            </div>

            {/* Right Side - Image */}
            <div className="admin-image">
                <img src={adminImage} alt="Admin Support" />
            </div>
        </div>
    );
};

export default AdminPage;
