package com.todoapp.dto.response;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.todoapp.model.Card;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CardResponse {
    
    private String id;
    private String title;
    private String description;
    private String cover;
    private String boardId;
    private String listId;
    private List<String> memberIds;
    private List<String> labels;
    private LocalDateTime startDate;
    private LocalDateTime dueDate;
    @JsonProperty("completed")
    private Boolean isCompleted;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    
    public static CardResponse fromEntity(Card card) {
        return CardResponse.builder()
                .id(card.getId())
                .title(card.getTitle())
                .description(card.getDescription())
                .cover(card.getCover())
                .boardId(card.getBoardId())
                .listId(card.getListId())
                .memberIds(card.getMemberIds())
                .labels(card.getLabels())
                .startDate(card.getStartDate())
                .dueDate(card.getDueDate())
                .isCompleted(card.getIsCompleted())
                .createdAt(card.getCreatedAt())
                .updatedAt(card.getUpdatedAt())
                .build();
    }
}
