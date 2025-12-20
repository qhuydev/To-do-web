package com.todoapp.repository;

import com.todoapp.model.Idea;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface IdeaRepository extends MongoRepository<Idea, String> {
    
    List<Idea> findByUserId(String userId);
    
    List<Idea> findByIsApproved(Boolean isApproved);
    
    List<Idea> findByUserIdAndIsApproved(String userId, Boolean isApproved);
}
