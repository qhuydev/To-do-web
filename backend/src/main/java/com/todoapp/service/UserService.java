package com.todoapp.service;

import com.todoapp.dto.response.UserResponse;
import com.todoapp.exception.ResourceNotFoundException;
import com.todoapp.model.User;
import com.todoapp.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UserService {
    
    private final UserRepository userRepository;
    
    public List<UserResponse> searchUsers(String query, String currentUserId) {
        List<User> users = userRepository
                .findByEmailContainingIgnoreCaseOrDisplayNameContainingIgnoreCase(query, query);
        
        // Loại bỏ user hiện tại khỏi kết quả
        return users.stream()
                .filter(user -> !user.getId().equals(currentUserId))
                .filter(User::getIsActive)
                .map(UserResponse::fromEntity)
                .collect(Collectors.toList());
    }
    
    public UserResponse getUserById(String userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));
        return UserResponse.fromEntity(user);
    }
}
