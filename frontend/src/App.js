import './App.css';
import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import AppNavbar from './component/common/AppNavbar';
import AppFooter from './component/common/AppFooter';
import HomePage from './component/home/HomePage';
import 'bootstrap/dist/css/bootstrap.min.css';
import RoomsPage from './component/bookingRooms/RoomsPage';
import './index.css';
import FindMyBooking from './component/bookingRooms/FindMyBooking';
import RoomDetails from './component/bookingRooms/RoomDetails';
import LoginPage from './component/auth/LoginPage';
import RegisterPage from './component/auth/RegisterPage';
import NotFound from './component/404NotFound/NotFound';
import ProfilePage from './component/profile/ProfilePage';
import EditProfilePage from './component/profile/EditProfilePage';
import { ProtectedRoute, AdminRoute } from './service/Guard';
import AdminPage from './component/admin/AdminPage';
import ManageRoomsPage from './component/admin/ManageRoomsPage';
import ManageBookingsPage from './component/admin/ManageBookingsPage';
import AddRoomPage from './component/admin/AddRoomPage';
import EditRoomPage from './component/admin/EditRoomPage';
import EditBookingPage from './component/admin/EditBookingPage';

function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <AppNavbar/>
          <div className='content'>
            <Routes>
              {/* PUBLIC ROUTES */}
              <Route exact path='/' element={<Navigate to="/home" />} />
              <Route exact path='/home' element={<HomePage/>}/>
              <Route exact path='/rooms' element={<RoomsPage/>}/>
              <Route exact path='/find-booking' element={<FindMyBooking/>} />
              <Route exact path="/login" element={<LoginPage />} />
              <Route exact path="/register" element={<RegisterPage />} />
              <Route path="*" element={<NotFound />} />

              {/* AUTHENTICATED USER ROUTES */}
              <Route exact path='/room-details-book/:roomId' element={<ProtectedRoute element={<RoomDetails/>} />} />
              <Route exact path="/profile" element={ <ProtectedRoute element={<ProfilePage />} />} />
              <Route exact path="/edit-profile" element={ <ProtectedRoute element={<EditProfilePage />} />} />

              { /* ADMIN ROUTES */}
              <Route path='/admin' element={<AdminRoute element={<AdminPage />} />} />
              <Route path='/admin/manage-rooms' element={<AdminRoute element={<ManageRoomsPage />} />} />
              <Route path='/admin/manage-bookings' element={<AdminRoute element={<ManageBookingsPage />} />} />
              <Route path='/admin/add-room' element={<AdminRoute element={<AddRoomPage />} />} />
              <Route path='/admin/edit-room/:roomId' element={<AdminRoute element={<EditRoomPage />} />} />
              <Route path="/admin/edit-booking/:bookingCode" element={<AdminRoute element={<EditBookingPage />} />}/>
            </Routes>
          </div>
        <AppFooter/>
      </div>
    </BrowserRouter>
  );
}

export default App;
