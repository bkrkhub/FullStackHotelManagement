import axios from "axios";

export default class ApiService {

    static BASE_URL = "http://localhost:4040"

    static getHeader() {
        
        const token = localStorage.getItem("token");
        return {
            Authorization: `Bearer ${token}`,
            "Content-type" : "application/json"
        };
    }

    /* AUTH ENDPOINT*/

    /* register a new user */
    static async registerUser(registration) {
        const response = await axios.post(`${this.BASE_URL}/auth/register`, registration);
        return response.data;
    }

    /* login a registered user */
    static async loginUser(loginDetails) {
        const response = await axios.post(`${this.BASE_URL}/auth/login`, loginDetails);
        return response.data;
    }

    /* USERS ENDPOINT */

    /* get all users */
    static async getAllUsers() {
        const response = await axios.get(`${this.BASE_URL}/users/all`, {headers: this.getHeader()});
        return response.data;
    }

    /* get user profile  */
    static async getUserProfile() {
        const response = await axios.get(`${this.BASE_URL}/users/get-logged-in-profile-info`, {headers : this.getHeader()}); 
         return response.data;
    }

    /* get user by id */
    static async getUserById(userId) {
        const response = await axios.get(`${this.BASE_URL}/users/get-by-id/${userId}`, {headers: this.getHeader()});
        return response.data;
    }

    /* get user booking history by id */
    static async getUserBookingHistory(userId) {
        const response = await axios.get(`${this.BASE_URL}/users/get-user-bookings/${userId}`, {headers: this.getHeader()});
        return response.data;
    }

    /* update user by id */
    
    static async updateUserProfile(userId, name, phoneNumber, password) {
        const requestBody = {};
    
        if (name) requestBody.name = name;
        if (phoneNumber) requestBody.phoneNumber = phoneNumber;
        if (password) requestBody.password = password;
    
        console.log("🚀 API'ye gönderilen veri:", requestBody);
    
        try {
            const response = await axios.put(`${this.BASE_URL}/users/update/${userId}`, requestBody, {
                headers: this.getHeader(),
            });
    
            console.log("✅ Backend API yanıtı:", response.data);
            return response.data;
        } catch (error) {
            console.error("❌ API Hatası:", error.response ? error.response.data : error);
            return null;
        }
    }
    
    /* delete user by id */
    static async deleteUserById(userId) {
        const response = await axios.delete(`${this.BASE_URL}/users/delete/${userId}`, {headers: this.getHeader()});
        return response.data;
    }

    /* ROOM ENDPOINT */

    /* add a new room to the db */
    static async addRoom(formData) {
        const token = localStorage.getItem("token");
    
        if (!token) {
            console.error("❌ Kullanıcı oturum açmamış!");
            throw new Error("Unauthorized: Please log in first.");
        }
    
        try {
            const result = await axios.post(`${this.BASE_URL}/rooms/add`, formData, {
                headers: {
                    "Authorization": `Bearer ${token}`,  // Token'ı header'a ekle
                    "Content-Type": "multipart/form-data"
                }
            });
    
            return result.data;
        } catch (error) {
            console.error("❌ API Hatası:", error.response ? error.response.data : error);
            throw error;
        }
    }
    

    /* get available rooms */
    static async getAvailableRooms() {
        const result = await axios.get(`${this.BASE_URL}/get-all-available-rooms`);
        return result.data;
    } 

    /* get available room by date and room type */
    static async getAvailableRoomsByDateAndType(checkInDate, checkOutDate, roomType) {
        const result = await axios.get(
            `${this.BASE_URL}/rooms/available-rooms-by-date-and-type?checkInDate=${checkInDate}&checkOutDate=${checkOutDate}&roomType=${roomType}`
        )
        return result.data;
    }

    /* get room types */
    static async getRoomTypes() {
        const response = await axios.get(`${this.BASE_URL}/rooms/types`);
        return response.data;
    }

    /* get all rooms */
    static async getAllRooms() {
        try {
            const result = await axios.get(`${this.BASE_URL}/rooms/all`);
            console.log("🛠 getAllRooms Yanıtı:", result); // Konsola yazdıralım
            return result.data; // API yanıtı data içindeyse bu satır doğru
        } catch (error) {
            console.error("❌ getAllRooms API Hatası:", error);
            return [];
        }
    }
    

    /* get room by id */
    static async getRoomById(roomId) {
        const result = await axios.get(`${this.BASE_URL}/rooms/room-by-id/${roomId}`, {headers: this.getHeader()});
        return result.data;
    }

    /* delete room by id */
    static async deleteRoomById(roomId) {
        const result = await axios.delete(`${this.BASE_URL}/rooms/delete/${roomId}`, {headers: this.getHeader()});
        return result.data;
    }

    /* update room by id and form-data */
    static async updateRoomById(roomId, formData) {
        const result = await axios.put(`${this.BASE_URL}/rooms/update/${roomId}`, formData, {
            headers: {
                ...this.getHeader(),
                'Content-Type' : 'multipart/form-data'
            }
        });
        
        return result.data;
    }


    /* BOOKING ENDPOINT */

    /* This saves a new booking */
    static async bookTheRoom(roomId, userId, bookingFormData) {
        console.log("USER ID IS: " + userId);
        console.log("Booking Request URL:", `${this.BASE_URL}/booking/book-room/${roomId}/${userId}`);
        console.log("Request Body:", bookingFormData);
        console.log("Headers:", this.getHeader());
        
        const response = await axios.post(`${this.BASE_URL}/booking/book-room/${roomId}/${userId}`,
             bookingFormData, {headers: this.getHeader()}); 
        
        
        
        return response.data;
    }

    /* get all bookings */
    static async getAllBookings() {
        const result = await axios.get(`${this.BASE_URL}/booking/all`, {headers: this.getHeader()});
        return result.data;
    }

    /* get booking by confirmation code */
    static async getBookingByConfirmationCode(bookingConfirmationCode) {
        const result = await axios.get(`${this.BASE_URL}/booking/get-by-confirmation-code/${bookingConfirmationCode}`);
        return result.data;
    }

    /* update booking by id */
    static async updateBookingById(bookingId, formData) {
        const result = await axios.put(`${this.BASE_URL}/booking/update-booking/${bookingId}`, formData, {
            headers: {
                ...this.getHeader(),
                'Content-Type' : 'application/json'
            }
        });
        return result.data;
    }

    /* cancel the booking by id*/
    static async cancelBooking(bookingId) {
        const result = await axios.delete(`${this.BASE_URL}/booking/cancel-booking/${bookingId}`, {headers: this.getHeader()});
        return result.data;
    }

    /* AUTHENTICATION CHECKER */

    static logout() {
        localStorage.removeItem('token');
        localStorage.removeItem('role');
    }

    static isAuthenticated() {
        const token = localStorage.getItem('token');
        return !!token;
    }

    static isAdmin() {
        const role = localStorage.getItem('role');
        return role === 'ADMIN';
    }

    static isUser() {
        const role = localStorage.getItem('role');
        return role === 'USER'; 
    }
}   