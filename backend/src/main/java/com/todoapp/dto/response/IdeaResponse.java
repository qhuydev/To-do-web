package com.todoapp.dto.response;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.todoapp.model.Idea;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class IdeaResponse {
    
    private String id;
    private String title;
    private String description;
    private String userId;
    @JsonProperty("approved")
    private Boolean isApproved;
    private UserResponse user;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    
    public static IdeaResponse fromEntity(Idea idea) {
        return IdeaResponse.builder()
                .id(idea.getId())
                .title(idea.getTitle())
                .description(idea.getDescription())
                .userId(idea.getUserId())
                .isApproved(idea.getIsApproved())
                .createdAt(idea.getCreatedAt())
                .updatedAt(idea.getUpdatedAt())
                .build();
    }
}
