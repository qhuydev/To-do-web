package com.todoapp.service;

import com.todoapp.dto.request.FriendshipRequest;
import com.todoapp.dto.response.FriendshipResponse;
import com.todoapp.dto.response.UserResponse;
import com.todoapp.exception.BadRequestException;
import com.todoapp.exception.ResourceNotFoundException;
import com.todoapp.model.Friendship;
import com.todoapp.model.Friendship.FriendshipStatus;
import com.todoapp.model.User;
import com.todoapp.repository.FriendshipRepository;
import com.todoapp.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class FriendshipService {
    
    private final FriendshipRepository friendshipRepository;
    private final UserRepository userRepository;
    
    @Transactional
    public FriendshipResponse sendFriendRequest(String userId, FriendshipRequest request) {
        String friendId = request.getFriendId();
        
        if (userId.equals(friendId)) {
            throw new BadRequestException("Cannot send friend request to yourself");
        }
        
        User friend = userRepository.findById(friendId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", friendId));
        
        // Kiểm tra đã có yêu cầu kết bạn chưa
        if (friendshipRepository.findByUserIdAndFriendId(userId, friendId).isPresent() ||
            friendshipRepository.findByUserIdAndFriendId(friendId, userId).isPresent()) {
            throw new BadRequestException("Friend request already exists");
        }
        
        Friendship friendship = Friendship.builder()
                .userId(userId)
                .friendId(friendId)
                .status(FriendshipStatus.PENDING)
                .build();
        
        friendship = friendshipRepository.save(friendship);
        return FriendshipResponse.fromEntity(friendship);
    }
    
    @Transactional
    public FriendshipResponse acceptFriendRequest(String friendshipId, String userId) {
        Friendship friendship = friendshipRepository.findById(friendshipId)
                .orElseThrow(() -> new ResourceNotFoundException("Friendship", "id", friendshipId));
        
        // Chỉ người nhận mới có thể chấp nhận
        if (!friendship.getFriendId().equals(userId)) {
            throw new BadRequestException("You don't have permission to accept this request");
        }
        
        if (friendship.getStatus() != FriendshipStatus.PENDING) {
            throw new BadRequestException("This request is not pending");
        }
        
        friendship.setStatus(FriendshipStatus.ACCEPTED);
        friendship = friendshipRepository.save(friendship);
        
        return FriendshipResponse.fromEntity(friendship);
    }
    
    @Transactional
    public FriendshipResponse rejectFriendRequest(String friendshipId, String userId) {
        Friendship friendship = friendshipRepository.findById(friendshipId)
                .orElseThrow(() -> new ResourceNotFoundException("Friendship", "id", friendshipId));
        
        // Chỉ người nhận mới có thể từ chối
        if (!friendship.getFriendId().equals(userId)) {
            throw new BadRequestException("You don't have permission to reject this request");
        }
        
        if (friendship.getStatus() != FriendshipStatus.PENDING) {
            throw new BadRequestException("This request is not pending");
        }
        
        friendship.setStatus(FriendshipStatus.REJECTED);
        friendship = friendshipRepository.save(friendship);
        
        return FriendshipResponse.fromEntity(friendship);
    }
    
    @Transactional
    public void removeFriend(String friendshipId, String userId) {
        Friendship friendship = friendshipRepository.findById(friendshipId)
                .orElseThrow(() -> new ResourceNotFoundException("Friendship", "id", friendshipId));
        
        // Cả 2 người đều có thể xóa
        if (!friendship.getUserId().equals(userId) && !friendship.getFriendId().equals(userId)) {
            throw new BadRequestException("You don't have permission to remove this friendship");
        }
        
        friendshipRepository.delete(friendship);
    }
    
    public List<FriendshipResponse> getFriends(String userId) {
        List<Friendship> sentRequests = friendshipRepository.findByUserIdAndStatus(userId, FriendshipStatus.ACCEPTED);
        List<Friendship> receivedRequests = friendshipRepository.findByFriendIdAndStatus(userId, FriendshipStatus.ACCEPTED);
        
        List<FriendshipResponse> responses = new ArrayList<>();
        
        for (Friendship friendship : sentRequests) {
            FriendshipResponse response = FriendshipResponse.fromEntity(friendship);
            User friend = userRepository.findById(friendship.getFriendId()).orElse(null);
            if (friend != null) {
                response.setFriend(UserResponse.fromEntity(friend));
            }
            responses.add(response);
        }
        
        for (Friendship friendship : receivedRequests) {
            FriendshipResponse response = FriendshipResponse.fromEntity(friendship);
            User friend = userRepository.findById(friendship.getUserId()).orElse(null);
            if (friend != null) {
                response.setFriend(UserResponse.fromEntity(friend));
            }
            responses.add(response);
        }
        
        return responses;
    }
    
    public List<FriendshipResponse> getPendingRequests(String userId) {
        List<Friendship> requests = friendshipRepository.findByFriendIdAndStatus(userId, FriendshipStatus.PENDING);
        
        return requests.stream()
                .map(friendship -> {
                    FriendshipResponse response = FriendshipResponse.fromEntity(friendship);
                    User requester = userRepository.findById(friendship.getUserId()).orElse(null);
                    if (requester != null) {
                        response.setUser(UserResponse.fromEntity(requester));
                    }
                    return response;
                })
                .collect(Collectors.toList());
    }
    
    public List<FriendshipResponse> getSentRequests(String userId) {
        List<Friendship> requests = friendshipRepository.findByUserIdAndStatus(userId, FriendshipStatus.PENDING);
        
        return requests.stream()
                .map(friendship -> {
                    FriendshipResponse response = FriendshipResponse.fromEntity(friendship);
                    User friend = userRepository.findById(friendship.getFriendId()).orElse(null);
                    if (friend != null) {
                        response.setFriend(UserResponse.fromEntity(friend));
                    }
                    return response;
                })
                .collect(Collectors.toList());
    }
}
