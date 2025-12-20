package com.todoapp.repository;

import com.todoapp.model.Message;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MessageRepository extends MongoRepository<Message, String> {
    
    @Query("{ $or: [ { $and: [ { 'senderId': ?0 }, { 'receiverId': ?1 } ] }, { $and: [ { 'senderId': ?1 }, { 'receiverId': ?0 } ] } ] }")
    List<Message> findConversationBetweenUsers(String userId1, String userId2);
    
    List<Message> findByReceiverIdAndIsReadFalse(String receiverId);
    
    @Query("{ $or: [ { 'senderId': ?0 }, { 'receiverId': ?0 } ] }")
    List<Message> findAllByUserId(String userId);
    
    long countByReceiverIdAndIsReadFalse(String receiverId);
}
