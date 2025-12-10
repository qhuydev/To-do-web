package com.todoapp.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

@Data
public class CardRequest {
    
    @NotBlank(message = "Title is required")
    private String title;
    
    private String description;
    
    private String cover;
    
    private List<String> memberIds;
    
    private List<String> labels;
    
    private LocalDateTime dueDate;
    
    private Boolean isCompleted;
}
