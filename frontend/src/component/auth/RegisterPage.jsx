import React, { useState } from "react";
import ApiService from "../../service/ApiService";
import { useNavigate } from "react-router-dom";
import "./RegisterPage.css";

function RegisterPage() {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        phoneNumber: ''
    });

    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const validateForm = () => {
        const { name, email, password, phoneNumber } = formData;
        return name && email && password && phoneNumber;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) {
            setErrorMessage('Please fill all the fields.');
            setTimeout(() => setErrorMessage(''), 5000);
            return;
        }
        try {
            const response = await ApiService.registerUser(formData);
            if (response.statusCode === 200) {
                setFormData({ name: '', email: '', password: '', phoneNumber: '' });
                setSuccessMessage('User registered successfully');
                setTimeout(() => {
                    setSuccessMessage('');
                    navigate('/login');
                }, 3000);
            }
        } catch (error) {
            setErrorMessage(error.response?.data?.message || error.message);
            setTimeout(() => setErrorMessage(''), 5000);
        }
    };

    return (
        <div className="register-page">
            <div className="register-box">
                <h2>Sign Up</h2>
                {errorMessage && <p className="error-message">{errorMessage}</p>}
                {successMessage && <p className="success-message">{successMessage}</p>}
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Name:</label>
                        <input type="text" name="name" value={formData.name} onChange={handleInputChange} required />
                    </div>
                    <div className="form-group">
                        <label>Email:</label>
                        <input type="email" name="email" value={formData.email} onChange={handleInputChange} required />
                    </div>
                    <div className="form-group">
                        <label>Phone Number:</label>
                        <input type="text" name="phoneNumber" value={formData.phoneNumber} onChange={handleInputChange} required />
                    </div>
                    <div className="form-group">
                        <label>Password:</label>
                        <input type="password" name="password" value={formData.password} onChange={handleInputChange} required />
                    </div>
                    <button type="submit">Register</button>
                </form>
                <p className="register-link">
                    Already have an account? <a href="/login">Login</a>
                </p>
            </div>
        </div>
    );
}

export default RegisterPage;
