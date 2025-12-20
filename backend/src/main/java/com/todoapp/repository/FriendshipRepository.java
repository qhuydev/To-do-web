package com.todoapp.repository;

import com.todoapp.model.Friendship;
import com.todoapp.model.Friendship.FriendshipStatus;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface FriendshipRepository extends MongoRepository<Friendship, String> {
    
    List<Friendship> findByUserIdAndStatus(String userId, FriendshipStatus status);
    
    List<Friendship> findByFriendIdAndStatus(String friendId, FriendshipStatus status);
    
    Optional<Friendship> findByUserIdAndFriendId(String userId, String friendId);
    
    List<Friendship> findByUserIdOrFriendId(String userId, String friendId);
    
    boolean existsByUserIdAndFriendIdAndStatus(String userId, String friendId, FriendshipStatus status);
}
