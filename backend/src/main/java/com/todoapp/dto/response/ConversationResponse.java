package com.todoapp.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ConversationResponse {
    
    private UserResponse user;
    private MessageResponse lastMessage;
    private Long unreadCount;
    private LocalDateTime lastMessageTime;
}
