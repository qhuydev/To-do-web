package com.todoapp.dto.response;

import com.todoapp.model.Board;
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
public class BoardResponse {
    
    private String id;
    private String title;
    private String description;
    private String background;
    private String ownerId;
    private Boolean isStarred;
    private List<String> listOrderIds;
    private List<TaskListResponse> lists;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    
    public static BoardResponse fromEntity(Board board) {
        return BoardResponse.builder()
                .id(board.getId())
                .title(board.getTitle())
                .description(board.getDescription())
                .background(board.getBackground())
                .ownerId(board.getOwnerId())
                .isStarred(board.getIsStarred())
                .listOrderIds(board.getListOrderIds())
                .createdAt(board.getCreatedAt())
                .updatedAt(board.getUpdatedAt())
                .build();
    }
    
    public static BoardResponse fromEntityWithLists(Board board, List<TaskListResponse> lists) {
        BoardResponse response = fromEntity(board);
        response.setLists(lists);
        return response;
    }
}
