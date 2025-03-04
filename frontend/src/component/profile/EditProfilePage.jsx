import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ApiService from "../../service/ApiService";
import Swal from "sweetalert2";
import './EditProfilePage.css';

const EditProfilePage = () => {
    const [user, setUser] = useState(null);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const getUserProfile = async () => {
            try {
                const response = await ApiService.getUserProfile();
                setUser(response.user);
            } catch (error) {
                setError(error.message);
            }
        };
        getUserProfile(); 
    }, []);

    const handleUpdateProfile = async () => {
        const { value: formValues } = await Swal.fire({
            title: "Update Profile",
            html: `
            <style>
                .swal2-popup {
                    border-radius: 10px;
                    box-shadow: 0px 4px 15px rgba(0, 0, 0, 0.9);
                    font-style: italic;
                }
                .swal2-input {
                    width: 90%;
                    padding: 10px;
                    margin: 5px 0;
                    border-radius: 6px;
                    border: 1px solid #ddd;
                    font-size: 16px;
                    font-style: italic;
                }
                .swal2-title {
                    color: green;
                    font-weight: bold;
                }
                .swal2-confirm {
                    background-color: #4CAF50 !important;
                    color: white !important;
                    font-size: 16px !important;
                }
                .swal2-cancel {
                    background-color: #757575 !important;
                    color: white !important;
                    font-size: 16px !important;
                }
            </style>
            <label>Name:</label>
            <input id="swal-input-name" class="swal2-input" value="${user.name || ''}">

            <label>Phone Number:</label>
            <input id="swal-input-phone" class="swal2-input" value="${user.phoneNumber || ''}">
        `,
            showCancelButton: true,
            confirmButtonText: "Update Profile",
            cancelButtonText: "Cancel",
            focusConfirm: false,
            preConfirm: () => {
                return {
                    name: document.getElementById("swal-input-name").value.trim(),
                    phoneNumber: document.getElementById("swal-input-phone").value.trim()
                };
            },
        });
    
        if (!formValues) return;
    
        try {
            console.log("🚀 Profil Güncelleme API'ye gönderilen veri:", formValues);
    
            await ApiService.updateUserProfile(user.id, formValues.name, formValues.phoneNumber, null);
    
            Swal.fire("Success!", "Profile updated successfully!", "success");
    
            const updatedUser = await ApiService.getUserProfile();
            setUser(updatedUser.user);
            console.log("🔄 Güncellenmiş Kullanıcı:", updatedUser.user);
            localStorage.setItem("user", JSON.stringify(updatedUser.user));
    
        } catch (error) {
            Swal.fire("Error!", "Failed to update profile", "error");
        }
    };

    const handleChangePassword = async () => {
        const { value: formValues } = await Swal.fire({
            title: "Change Password",
            html: `
            <style>
                .swal2-popup {
                    border-radius: 10px;
                    box-shadow: 0px 4px 15px rgba(0, 0, 0, 0.9);
                    font-style: italic;
                }
                .swal2-input {
                    width: 90%;
                    padding: 10px;
                    margin: 5px 0;
                    border-radius: 6px;
                    border: 1px solid #ddd;
                    font-size: 16px;
                    font-style: italic;
                }
                .swal2-title {
                    color: blue;
                    font-weight: bold;
                }
                .swal2-confirm {
                    background-color: #1f99e0 !important;
                    color: white !important;
                    font-size: 16px !important;
                }
                .swal2-cancel {
                    background-color: #757575 !important;
                    color: white !important;
                    font-size: 16px !important;
                }
            </style>
            <label>New Password:</label>
            <input id="swal-input-password" type="password" class="swal2-input" placeholder="Enter new password">

            <label>Confirm Password:</label>
            <input id="swal-input-confirm-password" type="password" class="swal2-input" placeholder="Confirm new password">
        `,
            showCancelButton: true,
            confirmButtonText: "Change Password",
            cancelButtonText: "Cancel",
            focusConfirm: false,
            preConfirm: () => {
                const password = document.getElementById("swal-input-password").value.trim();
                const confirmPassword = document.getElementById("swal-input-confirm-password").value.trim();
    
                if (password !== confirmPassword) {
                    Swal.showValidationMessage("Passwords do not match!");
                    return false;
                }
    
                return {
                    password: password.length > 0 ? password : null
                };
            },
        });
    
        if (!formValues) return;
    
        try {
            console.log("🚀 Şifre Güncelleme API'ye gönderilen veri:", formValues);
    
            await ApiService.updateUserProfile(user.id, null, null, formValues.password);
    
            Swal.fire("Success!", "Password changed successfully!", "success");
    
            console.log("🔄 Kullanıcı şifresi güncellendi.");
        } catch (error) {
            Swal.fire("Error!", "Failed to change password", "error");
        }
    };

    const deleteAccount = async () => {
        Swal.fire({
            title: "Are you sure ?",
            text: "Do you want to delete your account ?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#DC3545",
            cancelButtonColor: "#05f571",
            confirmButtonText: "Yes, DELETE!",
            cancelButtonText: "Cancel"
        }).then((result) => {
            if(result.isConfirmed) {
                ApiService.deleteUserById(user.id);
                navigate('/register');
                Swal.fire(
                    "Deleted",
                    "You have deleted your account successfully.",
                    "success"
                );
            }
        });
    };

    return (
        <div className="edit-profile-page">
            <h2>Edit Profile</h2>
            {error && <p className="error-message">{error}</p>}
            {user && (
                <div className="profile-details">
                    <p><strong>Name:</strong> {user.name}</p>
                    <p><strong>Email:</strong> {user.email}</p>
                    <p><strong>Password:</strong> ************</p>
                    <p><strong>Phone Number:</strong> {user.phoneNumber}</p>
                    <div className="profile-actions">
                        <button className="update-profile-button" onClick={handleUpdateProfile}>Update Profile</button>
                        <button className="change-password-button" onClick={handleChangePassword}>Change Password</button>
                        <button className="delete-profile-button" onClick={deleteAccount}>Delete Profile</button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default EditProfilePage;