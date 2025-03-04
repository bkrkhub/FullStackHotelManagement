import React from "react";
import { Button } from "react-bootstrap";
import svg from '../../404.svg';
import './NotFound.css';

const NotFound = () => {

    const backToHome = () => {
        // Redirect to homepage
        window.location.href = '/';
    }

    return (
        <div className="notFoundDiv">
            <img src={svg} alt = "404 Illustration" />
            <h1 style={{color : "#fff"}}>404 - Page Not Found</h1>
            <Button onClick={backToHome}>Back To Home</Button>
        </div>
    );
}

export default NotFound;