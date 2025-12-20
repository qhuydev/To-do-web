package com.todoapp.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class MoveCardRequest {
    
    @NotBlank(message = "Target list ID is required")
    private String targetListId;
    
    @NotNull(message = "New index is required")
    private Integer newIndex;
}
