package com.todoapp.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "friendships")
public class Friendship {
    
    @Id
    private String id;
    
    private String userId;
    
    private String friendId;
    
    @Builder.Default
    private FriendshipStatus status = FriendshipStatus.PENDING;
    
    @CreatedDate
    private LocalDateTime createdAt;
    
    @LastModifiedDate
    private LocalDateTime updatedAt;
    
    public enum FriendshipStatus {
        PENDING,    // Đang chờ chấp nhận
        ACCEPTED,   // Đã chấp nhận
        REJECTED,   // Đã từ chối
        BLOCKED     // Đã chặn
    }
}
