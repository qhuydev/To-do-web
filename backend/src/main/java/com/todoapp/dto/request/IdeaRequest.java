package com.todoapp.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class IdeaRequest {
    
    @NotBlank(message = "Title is required")
    private String title;
    
    private String description;
}
