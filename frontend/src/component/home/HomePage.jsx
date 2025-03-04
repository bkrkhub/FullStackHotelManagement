import React, { useState } from "react";
import "./HomePage.css";
import SearchRooms from "../common/SearchRooms";
import RoomResult from "../common/RoomResult";

const HomePage = () => {
    const [roomSearchResults, setRoomSearchResults] = useState([]);

    const handleSearchResult = (results) => {
        setRoomSearchResults(results);
    }

    return(
        <div className="home">
            <section>
                <div className="home-hero-section">
                    <div className="home-hero-overlay"></div>
                    <div className="home-hero-content">
                        <h1>Welcome to your <span className="home-hotel-color">Dream Hotel</span></h1>
                        <h3>Step into a dream of comfort and care</h3>
                        <a className="home-view-rooms-home" href="/rooms">All Rooms</a>
                    </div>
                </div>
            </section>

            {/* SEARCH / FIND AVAILABLE ROOM */}
            <SearchRooms handleSearchResult={handleSearchResult} className="home-search-container" />

            <RoomResult roomSearchResults={roomSearchResults} />
            <h2 className="home-services">Services at <span className="home-hotel-color">Dream Hotel</span></h2>

            {/* SERVICES */}
            <section className="service-section">
                <div className="service-card">
                    <img src="./assets/images/gym.png" alt="Air Conditioning" />
                    <div className="service-details">
                        <h3 className="service-title"> GYM </h3>
                        <p className="service-description">You can use the professional equipment in our gym so that you do not interrupt your daily exercises and you can continue your exercises with our personal trainers.</p>
                    </div>
                </div>
                <div className="service-card">
                    <img src="./assets/images/buffet-table.png" alt="Buffet Table" />
                    <div className="service-details">
                        <h3 className="service-title">Gourmet Buffet Selections</h3>
                        <p className="service-description">Indulge in a delightful array of gourmet flavors with our exquisite buffet selections.</p>
                    </div>
                </div>
                <div className="service-card">
                    <img src="./assets/images/shuttle-service.png" alt="Shuttle Service" />
                    <div className="service-details">
                        <h3 className="service-title">Shuttle Service</h3>
                        <p className="service-description">Airport - Hotel, Hotel - Airport or for your appointments, our fully equipped vehicles and experienced drivers transport our valued guests safely.</p>
                    </div>
                </div>
                <div className="service-card">
                    <img src="./assets/images/private-beach.png" alt="Private Beach Access" />
                    <div className="service-details">
                        <h3 className="service-title">Private Beach Access</h3>
                        <p className="service-description">Enjoy exclusive access to our private beach with comfortable sunbeds, refreshing drinks, and water sports.</p>
                    </div>
                </div>
            </section>
        </div>
    );
}

export default HomePage;
