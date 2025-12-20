package com.todoapp.controller;

import com.todoapp.dto.response.ApiResponse;
import com.todoapp.dto.response.UserResponse;
import com.todoapp.security.UserPrincipal;
import com.todoapp.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {
    
    private final UserService userService;
    
    @GetMapping("/search")
    public ResponseEntity<ApiResponse<List<UserResponse>>> searchUsers(
            @RequestParam String query,
            @AuthenticationPrincipal UserPrincipal userPrincipal) {
        List<UserResponse> users = userService.searchUsers(query, userPrincipal.getId());
        return ResponseEntity.ok(new ApiResponse<>(true, "Users found", users));
    }
    
    @GetMapping("/{userId}")
    public ResponseEntity<ApiResponse<UserResponse>> getUserById(
            @PathVariable String userId) {
        UserResponse user = userService.getUserById(userId);
        return ResponseEntity.ok(new ApiResponse<>(true, "User found", user));
    }
    
    @GetMapping("/me")
    public ResponseEntity<ApiResponse<UserResponse>> getCurrentUser(
            @AuthenticationPrincipal UserPrincipal userPrincipal) {
        UserResponse user = userService.getUserById(userPrincipal.getId());
        return ResponseEntity.ok(new ApiResponse<>(true, "Current user", user));
    }
}
