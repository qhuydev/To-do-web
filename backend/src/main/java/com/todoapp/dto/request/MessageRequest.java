package com.todoapp.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class MessageRequest {
    
    @NotBlank(message = "Receiver ID is required")
    private String receiverId;
    
    private String content;
    
    private String type;
    
    private String cardId;
}
