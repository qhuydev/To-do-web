package com.todoapp.dto.response;

import com.todoapp.model.User;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserResponse {
    
    private String id;
    private String email;
    private String displayName;
    private String avatar;
    private Boolean isPremium;
    private LocalDateTime createdAt;
    
    public static UserResponse fromEntity(User user) {
        return UserResponse.builder()
                .id(user.getId())
                .email(user.getEmail())
                .displayName(user.getDisplayName())
                .avatar(user.getAvatar())
                .isPremium(user.getIsPremium())
                .createdAt(user.getCreatedAt())
                .build();
    }
}
