package com.todoapp.dto.response;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.todoapp.model.Message;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MessageResponse {
    
    private String id;
    private String senderId;
    private String receiverId;
    private String content;
    private String type;
    private String cardId;
    @JsonProperty("read")
    private Boolean isRead;
    private UserResponse sender;
    private UserResponse receiver;
    private CardResponse card;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    
    public static MessageResponse fromEntity(Message message) {
        return MessageResponse.builder()
                .id(message.getId())
                .senderId(message.getSenderId())
                .receiverId(message.getReceiverId())
                .content(message.getContent())
                .type(message.getType() != null ? message.getType().name() : "TEXT")
                .cardId(message.getCardId())
                .isRead(message.getIsRead())
                .createdAt(message.getCreatedAt())
                .updatedAt(message.getUpdatedAt())
                .build();
    }
}
