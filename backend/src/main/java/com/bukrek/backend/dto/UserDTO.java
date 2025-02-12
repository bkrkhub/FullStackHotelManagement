package com.bukrek.backend.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Data;

import java.util.ArrayList;
import java.util.List;

@Data
@JsonInclude(JsonInclude.Include.NON_NULL)
public class UserDTO {
    /*
    @JsonInclude(JsonInclude.Include.NON_NULL)
    This annotation is used to not show null fields in the JSON response.
    If some fields in the DTO are null, they are not shown at all in the JSON response.
    It improves performance because we are not sending unnecessary data to the client.
    Makes JSON cleaner on the client side
    */
    private Long id;
    private String email;
    private String name;
    private String phoneNumber;
    private String role;
    private List<BookingDTO> bookings = new ArrayList<>();
}
