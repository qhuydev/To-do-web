package com.todoapp.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class FriendshipRequest {
    
    @NotBlank(message = "Friend ID is required")
    private String friendId;
}
