import React from "react";
import { Navbar, Nav, Container, NavDropdown, Button } from "react-bootstrap";
import { NavLink, useNavigate } from "react-router-dom";
import ApiService from "../../service/ApiService";
import "./AppNavbar.css";
import logo from "../../assets/images/hotel.png"; 
import Swal from "sweetalert2";

function AppNavbar() {
    const isAuthenticated = ApiService.isAuthenticated();
    const isAdmin = ApiService.isAdmin();
    const isUser = ApiService.isUser();
    const navigate = useNavigate();

    const handleLogout = () => {
        Swal.fire({
            title: "Are You Sure?",
            text: "Do you want logout?",
            icon:"warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, Logout",
            cancelButtonText: "Cancel"
        }).then((result) => {
            if (result.isConfirmed) {
                ApiService.logout();
                navigate("/home");
                Swal.fire("Logged out !", "You have been logged out successfully.", "success");
            }
        });
    };

    return (
        <Navbar bg="dark" variant="dark" expand="lg">
            <Container>
                <Navbar.Brand as={NavLink} to="/home" className="navbar-brand">
                    <img
                        src={logo}
                        alt="Dream Hotel Logo"
                        style={{ height: "40px", width: "auto", marginRight: "10px" }} 
                    />
                    Dream Hotel
                </Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="me-auto">
                        <Nav.Link as={NavLink} to="/home">Home</Nav.Link>
                        <Nav.Link as={NavLink} to="/rooms">Rooms</Nav.Link>
                        <Nav.Link as={NavLink} to="/find-booking">Find My Bookings</Nav.Link>

                        {isUser && (
                            <Nav.Link as={NavLink} to="/profile">Profile</Nav.Link>
                        )}

                        {isAdmin && (
                            <Nav.Link as={NavLink} to="/admin">Admin</Nav.Link>
                        )}
                    </Nav>

                    <Nav>
                        {!isAuthenticated ? (
                            <>
                                <Nav.Link as={NavLink} to="/login">Login</Nav.Link>
                                <Nav.Link as={NavLink} to="/register">Register</Nav.Link>
                            </>
                        ) : (
                            <Button variant="outline-light" onClick={handleLogout}>
                                Logout
                            </Button>
                        )}
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
}

export default AppNavbar;
