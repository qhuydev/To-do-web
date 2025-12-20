package com.todoapp.controller;

import com.todoapp.dto.request.FriendshipRequest;
import com.todoapp.dto.response.ApiResponse;
import com.todoapp.dto.response.FriendshipResponse;
import com.todoapp.security.UserPrincipal;
import com.todoapp.service.FriendshipService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/friendships")
@RequiredArgsConstructor
public class FriendshipController {
    
    private final FriendshipService friendshipService;
    
    @PostMapping("/send")
    public ResponseEntity<ApiResponse<FriendshipResponse>> sendFriendRequest(
            @Valid @RequestBody FriendshipRequest request,
            @AuthenticationPrincipal UserPrincipal userPrincipal) {
        FriendshipResponse response = friendshipService.sendFriendRequest(userPrincipal.getId(), request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(new ApiResponse<>(true, "Friend request sent successfully", response));
    }
    
    @PutMapping("/{friendshipId}/accept")
    public ResponseEntity<ApiResponse<FriendshipResponse>> acceptFriendRequest(
            @PathVariable String friendshipId,
            @AuthenticationPrincipal UserPrincipal userPrincipal) {
        FriendshipResponse response = friendshipService.acceptFriendRequest(friendshipId, userPrincipal.getId());
        return ResponseEntity.ok(new ApiResponse<>(true, "Friend request accepted", response));
    }
    
    @PutMapping("/{friendshipId}/reject")
    public ResponseEntity<ApiResponse<FriendshipResponse>> rejectFriendRequest(
            @PathVariable String friendshipId,
            @AuthenticationPrincipal UserPrincipal userPrincipal) {
        FriendshipResponse response = friendshipService.rejectFriendRequest(friendshipId, userPrincipal.getId());
        return ResponseEntity.ok(new ApiResponse<>(true, "Friend request rejected", response));
    }
    
    @DeleteMapping("/{friendshipId}")
    public ResponseEntity<ApiResponse<Void>> removeFriend(
            @PathVariable String friendshipId,
            @AuthenticationPrincipal UserPrincipal userPrincipal) {
        friendshipService.removeFriend(friendshipId, userPrincipal.getId());
        return ResponseEntity.ok(new ApiResponse<>(true, "Friend removed successfully", null));
    }
    
    @GetMapping("/friends")
    public ResponseEntity<ApiResponse<List<FriendshipResponse>>> getFriends(
            @AuthenticationPrincipal UserPrincipal userPrincipal) {
        List<FriendshipResponse> friends = friendshipService.getFriends(userPrincipal.getId());
        return ResponseEntity.ok(new ApiResponse<>(true, "Friends retrieved successfully", friends));
    }
    
    @GetMapping("/pending")
    public ResponseEntity<ApiResponse<List<FriendshipResponse>>> getPendingRequests(
            @AuthenticationPrincipal UserPrincipal userPrincipal) {
        List<FriendshipResponse> requests = friendshipService.getPendingRequests(userPrincipal.getId());
        return ResponseEntity.ok(new ApiResponse<>(true, "Pending requests retrieved successfully", requests));
    }
    
    @GetMapping("/sent")
    public ResponseEntity<ApiResponse<List<FriendshipResponse>>> getSentRequests(
            @AuthenticationPrincipal UserPrincipal userPrincipal) {
        List<FriendshipResponse> requests = friendshipService.getSentRequests(userPrincipal.getId());
        return ResponseEntity.ok(new ApiResponse<>(true, "Sent requests retrieved successfully", requests));
    }
}
