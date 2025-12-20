package com.todoapp.service;

import com.todoapp.dto.request.MessageRequest;
import com.todoapp.dto.response.CardResponse;
import com.todoapp.dto.response.ConversationResponse;
import com.todoapp.dto.response.MessageResponse;
import com.todoapp.dto.response.UserResponse;
import com.todoapp.exception.BadRequestException;
import com.todoapp.exception.ResourceNotFoundException;
import com.todoapp.model.Card;
import com.todoapp.model.Message;
import com.todoapp.model.User;
import com.todoapp.repository.CardRepository;
import com.todoapp.repository.MessageRepository;
import com.todoapp.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class MessageService {
    
    private final MessageRepository messageRepository;
    private final UserRepository userRepository;
    private final CardRepository cardRepository;
    
    @Transactional
    public MessageResponse sendMessage(String senderId, MessageRequest request) {
        String receiverId = request.getReceiverId();
        
        if (senderId.equals(receiverId)) {
            throw new BadRequestException("Cannot send message to yourself");
        }
        
        User receiver = userRepository.findById(receiverId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", receiverId));
        
        Message.MessageType messageType = Message.MessageType.TEXT;
        Card card = null;
        
        // Xử lý nếu là tin nhắn có card
        if ("CARD".equalsIgnoreCase(request.getType()) && request.getCardId() != null) {
            card = cardRepository.findById(request.getCardId())
                    .orElseThrow(() -> new ResourceNotFoundException("Card", "id", request.getCardId()));
            messageType = Message.MessageType.CARD;
            
            // Thêm receiver vào danh sách member của card
            if (!card.getMemberIds().contains(receiverId)) {
                card.getMemberIds().add(receiverId);
                cardRepository.save(card);
            }
        }
        
        Message message = Message.builder()
                .senderId(senderId)
                .receiverId(receiverId)
                .content(request.getContent())
                .type(messageType)
                .cardId(request.getCardId())
                .isRead(false)
                .build();
        
        message = messageRepository.save(message);
        
        MessageResponse response = MessageResponse.fromEntity(message);
        response.setReceiver(UserResponse.fromEntity(receiver));
        
        User sender = userRepository.findById(senderId).orElse(null);
        if (sender != null) {
            response.setSender(UserResponse.fromEntity(sender));
        }
        
        if (card != null) {
            response.setCard(CardResponse.fromEntity(card));
        }
        
        return response;
    }
    
    public List<MessageResponse> getConversation(String userId, String otherUserId) {
        userRepository.findById(otherUserId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", otherUserId));
        
        List<Message> messages = messageRepository.findConversationBetweenUsers(userId, otherUserId);
        
        // Sắp xếp theo thời gian tăng dần
        messages.sort(Comparator.comparing(Message::getCreatedAt));
        
        return messages.stream()
                .map(message -> {
                    MessageResponse response = MessageResponse.fromEntity(message);
                    User sender = userRepository.findById(message.getSenderId()).orElse(null);
                    User receiver = userRepository.findById(message.getReceiverId()).orElse(null);
                    if (sender != null) {
                        response.setSender(UserResponse.fromEntity(sender));
                    }
                    if (receiver != null) {
                        response.setReceiver(UserResponse.fromEntity(receiver));
                    }
                    // Thêm thông tin card nếu có
                    if (message.getCardId() != null) {
                        Card card = cardRepository.findById(message.getCardId()).orElse(null);
                        if (card != null) {
                            response.setCard(CardResponse.fromEntity(card));
                        }
                    }
                    return response;
                })
                .collect(Collectors.toList());
    }
    
    @Transactional
    public void markAsRead(String messageId, String userId) {
        Message message = messageRepository.findById(messageId)
                .orElseThrow(() -> new ResourceNotFoundException("Message", "id", messageId));
        
        if (!message.getReceiverId().equals(userId)) {
            throw new BadRequestException("You can only mark your own messages as read");
        }
        
        message.setIsRead(true);
        messageRepository.save(message);
    }
    
    @Transactional
    public void markConversationAsRead(String userId, String otherUserId) {
        List<Message> messages = messageRepository.findConversationBetweenUsers(userId, otherUserId);
        
        messages.stream()
                .filter(msg -> msg.getReceiverId().equals(userId) && !msg.getIsRead())
                .forEach(msg -> {
                    msg.setIsRead(true);
                    messageRepository.save(msg);
                });
    }
    
    public List<ConversationResponse> getConversations(String userId) {
        List<Message> allMessages = messageRepository.findAllByUserId(userId);
        
        // Nhóm tin nhắn theo người chat
        Map<String, List<Message>> conversationMap = new HashMap<>();
        
        for (Message message : allMessages) {
            String otherUserId = message.getSenderId().equals(userId) 
                ? message.getReceiverId() 
                : message.getSenderId();
            
            conversationMap.computeIfAbsent(otherUserId, k -> new ArrayList<>()).add(message);
        }
        
        // Tạo conversation response
        List<ConversationResponse> conversations = new ArrayList<>();
        
        for (Map.Entry<String, List<Message>> entry : conversationMap.entrySet()) {
            String otherUserId = entry.getKey();
            List<Message> messages = entry.getValue();
            
            User otherUser = userRepository.findById(otherUserId).orElse(null);
            if (otherUser == null) continue;
            
            // Lấy tin nhắn cuối cùng
            Message lastMessage = messages.stream()
                    .max(Comparator.comparing(Message::getCreatedAt))
                    .orElse(null);
            
            // Đếm tin nhắn chưa đọc
            long unreadCount = messages.stream()
                    .filter(msg -> msg.getReceiverId().equals(userId) && !msg.getIsRead())
                    .count();
            
            ConversationResponse conversation = ConversationResponse.builder()
                    .user(UserResponse.fromEntity(otherUser))
                    .lastMessage(lastMessage != null ? MessageResponse.fromEntity(lastMessage) : null)
                    .unreadCount(unreadCount)
                    .lastMessageTime(lastMessage != null ? lastMessage.getCreatedAt() : null)
                    .build();
            
            conversations.add(conversation);
        }
        
        // Sắp xếp theo thời gian tin nhắn cuối cùng
        conversations.sort((c1, c2) -> {
            if (c1.getLastMessageTime() == null) return 1;
            if (c2.getLastMessageTime() == null) return -1;
            return c2.getLastMessageTime().compareTo(c1.getLastMessageTime());
        });
        
        return conversations;
    }
    
    public Long getUnreadCount(String userId) {
        return messageRepository.countByReceiverIdAndIsReadFalse(userId);
    }
    
    @Transactional
    public void deleteMessage(String messageId, String userId) {
        Message message = messageRepository.findById(messageId)
                .orElseThrow(() -> new ResourceNotFoundException("Message", "id", messageId));
        
        // Chỉ người gửi mới có quyền xóa tin nhắn
        if (!message.getSenderId().equals(userId)) {
            throw new BadRequestException("You can only delete your own messages");
        }
        
        messageRepository.delete(message);
    }
}
