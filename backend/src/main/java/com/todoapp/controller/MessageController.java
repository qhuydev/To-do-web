package com.todoapp.controller;

import com.todoapp.dto.request.MessageRequest;
import com.todoapp.dto.response.ApiResponse;
import com.todoapp.dto.response.ConversationResponse;
import com.todoapp.dto.response.MessageResponse;
import com.todoapp.security.UserPrincipal;
import com.todoapp.service.MessageService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/messages")
@RequiredArgsConstructor
public class MessageController {
    
    private final MessageService messageService;
    
    @PostMapping("/send")
    public ResponseEntity<ApiResponse<MessageResponse>> sendMessage(
            @Valid @RequestBody MessageRequest request,
            @AuthenticationPrincipal UserPrincipal userPrincipal) {
        MessageResponse response = messageService.sendMessage(userPrincipal.getId(), request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(new ApiResponse<>(true, "Message sent successfully", response));
    }
    
    @GetMapping("/conversation/{otherUserId}")
    public ResponseEntity<ApiResponse<List<MessageResponse>>> getConversation(
            @PathVariable String otherUserId,
            @AuthenticationPrincipal UserPrincipal userPrincipal) {
        List<MessageResponse> messages = messageService.getConversation(userPrincipal.getId(), otherUserId);
        return ResponseEntity.ok(new ApiResponse<>(true, "Conversation retrieved successfully", messages));
    }
    
    @PutMapping("/{messageId}/read")
    public ResponseEntity<ApiResponse<Void>> markAsRead(
            @PathVariable String messageId,
            @AuthenticationPrincipal UserPrincipal userPrincipal) {
        messageService.markAsRead(messageId, userPrincipal.getId());
        return ResponseEntity.ok(new ApiResponse<>(true, "Message marked as read", null));
    }
    
    @PutMapping("/conversation/{otherUserId}/read")
    public ResponseEntity<ApiResponse<Void>> markConversationAsRead(
            @PathVariable String otherUserId,
            @AuthenticationPrincipal UserPrincipal userPrincipal) {
        messageService.markConversationAsRead(userPrincipal.getId(), otherUserId);
        return ResponseEntity.ok(new ApiResponse<>(true, "Conversation marked as read", null));
    }
    
    @GetMapping("/conversations")
    public ResponseEntity<ApiResponse<List<ConversationResponse>>> getConversations(
            @AuthenticationPrincipal UserPrincipal userPrincipal) {
        List<ConversationResponse> conversations = messageService.getConversations(userPrincipal.getId());
        return ResponseEntity.ok(new ApiResponse<>(true, "Conversations retrieved successfully", conversations));
    }
    
    @GetMapping("/unread-count")
    public ResponseEntity<ApiResponse<Long>> getUnreadCount(
            @AuthenticationPrincipal UserPrincipal userPrincipal) {
        Long count = messageService.getUnreadCount(userPrincipal.getId());
        return ResponseEntity.ok(new ApiResponse<>(true, "Unread count retrieved", count));
    }
    
    @DeleteMapping("/{messageId}")
    public ResponseEntity<ApiResponse<Void>> deleteMessage(
            @PathVariable String messageId,
            @AuthenticationPrincipal UserPrincipal userPrincipal) {
        messageService.deleteMessage(messageId, userPrincipal.getId());
        return ResponseEntity.ok(new ApiResponse<>(true, "Message deleted successfully", null));
    }
}
