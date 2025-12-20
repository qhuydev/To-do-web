package com.todoapp.repository;

import com.todoapp.model.Card;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CardRepository extends MongoRepository<Card, String> {
    
    List<Card> findByListId(String listId);
    
    List<Card> findByBoardId(String boardId);
    
    void deleteByListId(String listId);
    
    void deleteByBoardId(String boardId);
}
