package com.todoapp.dto.response;

import com.todoapp.model.Friendship;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class FriendshipResponse {
    
    private String id;
    private String userId;
    private String friendId;
    private String status;
    private UserResponse user;
    private UserResponse friend;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    
    public static FriendshipResponse fromEntity(Friendship friendship) {
        return FriendshipResponse.builder()
                .id(friendship.getId())
                .userId(friendship.getUserId())
                .friendId(friendship.getFriendId())
                .status(friendship.getStatus().name())
                .createdAt(friendship.getCreatedAt())
                .updatedAt(friendship.getUpdatedAt())
                .build();
    }
}
