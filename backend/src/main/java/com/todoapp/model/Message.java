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
@Document(collection = "messages")
public class Message {
    
    @Id
    private String id;
    
    private String senderId;
    
    private String receiverId;
    
    private String content;
    
    @Builder.Default
    private MessageType type = MessageType.TEXT;
    
    private String cardId;
    
    @Builder.Default
    private Boolean isRead = false;
    
    @CreatedDate
    private LocalDateTime createdAt;
    
    @LastModifiedDate
    private LocalDateTime updatedAt;
    
    public enum MessageType {
        TEXT,    // Tin nhắn văn bản thường
        CARD     // Tin nhắn gửi kèm card/task
    }
}
