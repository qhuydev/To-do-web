package com.todoapp.dto.response;

import com.todoapp.model.TaskList;
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
public class TaskListResponse {
    
    private String id;
    private String title;
    private String boardId;
    private List<String> cardOrderIds;
    private List<CardResponse> cards;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    
    public static TaskListResponse fromEntity(TaskList taskList) {
        return TaskListResponse.builder()
                .id(taskList.getId())
                .title(taskList.getTitle())
                .boardId(taskList.getBoardId())
                .cardOrderIds(taskList.getCardOrderIds())
                .createdAt(taskList.getCreatedAt())
                .updatedAt(taskList.getUpdatedAt())
                .build();
    }
    
    public static TaskListResponse fromEntityWithCards(TaskList taskList, List<CardResponse> cards) {
        TaskListResponse response = fromEntity(taskList);
        response.setCards(cards);
        return response;
    }
}
