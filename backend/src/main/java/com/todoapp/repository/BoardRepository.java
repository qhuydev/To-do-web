package com.todoapp.repository;

import com.todoapp.model.Board;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BoardRepository extends MongoRepository<Board, String> {
    
    List<Board> findByOwnerId(String ownerId);
    
    List<Board> findByOwnerIdAndIsStarred(String ownerId, Boolean isStarred);
}
