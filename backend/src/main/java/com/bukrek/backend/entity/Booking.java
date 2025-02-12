package com.bukrek.backend.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.Future;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.LocalDate;

@Data
@Entity
@Table(name = "bookings")
public class Booking {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull(message = "check in date is required")
    private LocalDate checkInDate;

    // The @Future annotation is used to require a date (Date, LocalDate, LocalDateTime, etc.)
        // field to be some time in the future.
    @Future(message = "check out must be in the future")
    private LocalDate checkOutDate;

    @Min(value = 1, message = "Number of adults mustn't be less than 1")
    private int numOfAdults;

    @Min(value = 0, message = "Number of children mustn't be less than 0")
    private int numOfChildren;

    private int totalNumOfGuests;

    private String bookingConfirmationCode;

    // EAGER --> Immediately loads the associated object.
    // EAGER --> All data is retrieved in one query.
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "user_id")
    private User user;

    // LAZY --> Loads the associated object only when needed.
    // LAZY --> Less data is loaded, improving performance.
    // In @OneToMany relationships FetchType.LAZY already comes by default.
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "room_id")
    private Room room;

    private void calculateAllGuest() {
        this.totalNumOfGuests = this.numOfAdults + this.numOfChildren;
    }

    public void setNumOfAdults(int numOfAdults) {
        this.numOfAdults = numOfAdults;
        calculateAllGuest();
    }

    public void setNumOfChildren(int numOfChildren) {
        this.numOfChildren = numOfChildren;
        calculateAllGuest();
    }

    @Override
    public String toString() {
        return "Booking{" +
                ", id=" + id +
                ", checkInDate=" + checkInDate +
                ", checkOutDate=" + checkOutDate +
                ", numOfAdults=" + numOfAdults +
                ", numOfChildren=" + numOfChildren +
                ", totalNumOfGuests=" + totalNumOfGuests +
                "bookingConfirmationCode='" + bookingConfirmationCode + '\'' +
                '}';
    }
}
