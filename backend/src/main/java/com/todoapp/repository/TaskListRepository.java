package com.todoapp.repository;

import com.todoapp.model.TaskList;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TaskListRepository extends MongoRepository<TaskList, String> {
    
    List<TaskList> findByBoardId(String boardId);
    
    void deleteByBoardId(String boardId);
}
