package com.todoapp.service;

import com.todoapp.dto.request.TaskListRequest;
import com.todoapp.dto.response.CardResponse;
import com.todoapp.dto.response.TaskListResponse;
import com.todoapp.exception.BadRequestException;
import com.todoapp.exception.ResourceNotFoundException;
import com.todoapp.model.Board;
import com.todoapp.model.Card;
import com.todoapp.model.TaskList;
import com.todoapp.repository.BoardRepository;
import com.todoapp.repository.CardRepository;
import com.todoapp.repository.TaskListRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class TaskListService {
    
    private final TaskListRepository taskListRepository;
    private final BoardRepository boardRepository;
    private final CardRepository cardRepository;
    
    public TaskListResponse createList(String boardId, TaskListRequest request, String userId) {
        Board board = boardRepository.findById(boardId)
                .orElseThrow(() -> new ResourceNotFoundException("Board", "id", boardId));
        
        if (!board.getOwnerId().equals(userId)) {
            throw new BadRequestException("You don't have permission to add list to this board");
        }
        
        TaskList taskList = TaskList.builder()
                .title(request.getTitle())
                .boardId(boardId)
                .cardOrderIds(new ArrayList<>())
                .build();
        
        taskList = taskListRepository.save(taskList);
        
        board.getListOrderIds().add(taskList.getId());
        boardRepository.save(board);
        
        return TaskListResponse.fromEntity(taskList);
    }
    
    public TaskListResponse updateList(String listId, TaskListRequest request, String userId) {
        TaskList taskList = taskListRepository.findById(listId)
                .orElseThrow(() -> new ResourceNotFoundException("List", "id", listId));
        
        Board board = boardRepository.findById(taskList.getBoardId())
                .orElseThrow(() -> new ResourceNotFoundException("Board", "id", taskList.getBoardId()));
        
        if (!board.getOwnerId().equals(userId)) {
            throw new BadRequestException("You don't have permission to update this list");
        }
        
        taskList.setTitle(request.getTitle());
        TaskList savedList = taskListRepository.save(taskList);
        
        return TaskListResponse.fromEntity(savedList);
    }
    
    @Transactional
    public void deleteList(String listId, String userId) {
        TaskList taskList = taskListRepository.findById(listId)
                .orElseThrow(() -> new ResourceNotFoundException("List", "id", listId));
        
        Board board = boardRepository.findById(taskList.getBoardId())
                .orElseThrow(() -> new ResourceNotFoundException("Board", "id", taskList.getBoardId()));
        
        if (!board.getOwnerId().equals(userId)) {
            throw new BadRequestException("You don't have permission to delete this list");
        }
        
        cardRepository.deleteByListId(listId);
        
        board.getListOrderIds().remove(listId);
        boardRepository.save(board);
        
        taskListRepository.delete(taskList);
    }
    
    public TaskListResponse updateCardOrder(String listId, List<String> cardOrderIds, String userId) {
        TaskList taskList = taskListRepository.findById(listId)
                .orElseThrow(() -> new ResourceNotFoundException("List", "id", listId));
        
        Board board = boardRepository.findById(taskList.getBoardId())
                .orElseThrow(() -> new ResourceNotFoundException("Board", "id", taskList.getBoardId()));
        
        if (!board.getOwnerId().equals(userId)) {
            throw new BadRequestException("You don't have permission to update this list");
        }
        
        taskList.setCardOrderIds(cardOrderIds);
        TaskList savedList = taskListRepository.save(taskList);
        
        return TaskListResponse.fromEntity(savedList);
    }
    
    public TaskListResponse getListWithCards(String listId, String userId) {
        TaskList taskList = taskListRepository.findById(listId)
                .orElseThrow(() -> new ResourceNotFoundException("List", "id", listId));
        
        Board board = boardRepository.findById(taskList.getBoardId())
                .orElseThrow(() -> new ResourceNotFoundException("Board", "id", taskList.getBoardId()));
        
        if (!board.getOwnerId().equals(userId)) {
            throw new BadRequestException("You don't have permission to access this list");
        }
        
        List<Card> cards = cardRepository.findByListId(listId);
        List<CardResponse> cardResponses = cards.stream()
                .map(CardResponse::fromEntity)
                .collect(Collectors.toList());
        
        return TaskListResponse.fromEntityWithCards(taskList, cardResponses);
    }
}
