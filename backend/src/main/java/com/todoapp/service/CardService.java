package com.todoapp.service;

import com.todoapp.dto.request.CardRequest;
import com.todoapp.dto.request.MoveCardRequest;
import com.todoapp.dto.response.CardResponse;
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

@Service
@RequiredArgsConstructor
public class CardService {
    
    private final CardRepository cardRepository;
    private final TaskListRepository taskListRepository;
    private final BoardRepository boardRepository;
    
    public CardResponse createCard(String listId, CardRequest request, String userId) {
        TaskList taskList = taskListRepository.findById(listId)
                .orElseThrow(() -> new ResourceNotFoundException("List", "id", listId));
        
        Board board = boardRepository.findById(taskList.getBoardId())
                .orElseThrow(() -> new ResourceNotFoundException("Board", "id", taskList.getBoardId()));
        
        if (!board.getOwnerId().equals(userId)) {
            throw new BadRequestException("You don't have permission to add card to this list");
        }
        
        Card card = Card.builder()
                .title(request.getTitle())
                .description(request.getDescription())
                .cover(request.getCover())
                .boardId(taskList.getBoardId())
                .listId(listId)
                .memberIds(request.getMemberIds() != null ? request.getMemberIds() : new ArrayList<>())
                .labels(request.getLabels() != null ? request.getLabels() : new ArrayList<>())
                .startDate(request.getStartDate())
                .dueDate(request.getDueDate())
                .isCompleted(false)
                .build();
        
        card = cardRepository.save(card);
        
        taskList.getCardOrderIds().add(card.getId());
        taskListRepository.save(taskList);
        
        return CardResponse.fromEntity(card);
    }
    
    public CardResponse createStandaloneCard(CardRequest request, String userId) {
        Card card = Card.builder()
                .title(request.getTitle())
                .description(request.getDescription())
                .cover(request.getCover())
                .boardId(null)
                .listId(null)
                .memberIds(request.getMemberIds() != null ? request.getMemberIds() : new ArrayList<>())
                .labels(request.getLabels() != null ? request.getLabels() : new ArrayList<>())
                .startDate(request.getStartDate())
                .dueDate(request.getDueDate())
                .isCompleted(false)
                .build();
        
        // Thêm người tạo vào danh sách member
        if (!card.getMemberIds().contains(userId)) {
            card.getMemberIds().add(userId);
        }
        
        card = cardRepository.save(card);
        
        return CardResponse.fromEntity(card);
    }
    
    public CardResponse getCardById(String cardId, String userId) {
        Card card = cardRepository.findById(cardId)
                .orElseThrow(() -> new ResourceNotFoundException("Card", "id", cardId));
        
        Board board = boardRepository.findById(card.getBoardId())
                .orElseThrow(() -> new ResourceNotFoundException("Board", "id", card.getBoardId()));
        
        if (!board.getOwnerId().equals(userId)) {
            throw new BadRequestException("You don't have permission to access this card");
        }
        
        return CardResponse.fromEntity(card);
    }
    
    public CardResponse updateCard(String cardId, CardRequest request, String userId) {
        Card card = cardRepository.findById(cardId)
                .orElseThrow(() -> new ResourceNotFoundException("Card", "id", cardId));
        
        Board board = boardRepository.findById(card.getBoardId())
                .orElseThrow(() -> new ResourceNotFoundException("Board", "id", card.getBoardId()));
        
        if (!board.getOwnerId().equals(userId)) {
            throw new BadRequestException("You don't have permission to update this card");
        }
        
        if (request.getTitle() != null) {
            card.setTitle(request.getTitle());
        }
        if (request.getDescription() != null) {
            card.setDescription(request.getDescription());
        }
        if (request.getCover() != null) {
            card.setCover(request.getCover());
        }
        if (request.getMemberIds() != null) {
            card.setMemberIds(request.getMemberIds());
        }
        if (request.getLabels() != null) {
            card.setLabels(request.getLabels());
        }
        if (request.getStartDate() != null) {
            card.setStartDate(request.getStartDate());
        }
        if (request.getDueDate() != null) {
            card.setDueDate(request.getDueDate());
        }
        if (request.getIsCompleted() != null) {
            card.setIsCompleted(request.getIsCompleted());
        }
        
        Card savedCard = cardRepository.save(card);
        return CardResponse.fromEntity(savedCard);
    }
    
    @Transactional
    public void deleteCard(String cardId, String userId) {
        Card card = cardRepository.findById(cardId)
                .orElseThrow(() -> new ResourceNotFoundException("Card", "id", cardId));
        
        // Nếu card không thuộc board nào (standalone card)
        if (card.getBoardId() == null) {
            // Kiểm tra user có phải là member của card không
            if (!card.getMemberIds().contains(userId)) {
                throw new BadRequestException("You don't have permission to delete this card");
            }
            cardRepository.delete(card);
            return;
        }
        
        // Xử lý card trong board
        Board board = boardRepository.findById(card.getBoardId())
                .orElseThrow(() -> new ResourceNotFoundException("Board", "id", card.getBoardId()));
        
        if (!board.getOwnerId().equals(userId)) {
            throw new BadRequestException("You don't have permission to delete this card");
        }
        
        // Nếu card có listId thì xóa khỏi list
        if (card.getListId() != null) {
            TaskList taskList = taskListRepository.findById(card.getListId())
                    .orElseThrow(() -> new ResourceNotFoundException("List", "id", card.getListId()));
            
            taskList.getCardOrderIds().remove(cardId);
            taskListRepository.save(taskList);
        }
        
        cardRepository.delete(card);
    }
    
    @Transactional
    public CardResponse moveCard(String cardId, MoveCardRequest request, String userId) {
        Card card = cardRepository.findById(cardId)
                .orElseThrow(() -> new ResourceNotFoundException("Card", "id", cardId));
        
        Board board = boardRepository.findById(card.getBoardId())
                .orElseThrow(() -> new ResourceNotFoundException("Board", "id", card.getBoardId()));
        
        if (!board.getOwnerId().equals(userId)) {
            throw new BadRequestException("You don't have permission to move this card");
        }
        
        TaskList sourceList = taskListRepository.findById(card.getListId())
                .orElseThrow(() -> new ResourceNotFoundException("List", "id", card.getListId()));
        
        TaskList targetList = taskListRepository.findById(request.getTargetListId())
                .orElseThrow(() -> new ResourceNotFoundException("List", "id", request.getTargetListId()));
        
        if (!targetList.getBoardId().equals(card.getBoardId())) {
            throw new BadRequestException("Cannot move card to a list in different board");
        }
        
        sourceList.getCardOrderIds().remove(cardId);
        taskListRepository.save(sourceList);
        
        List<String> targetCardOrderIds = targetList.getCardOrderIds();
        int newIndex = Math.min(request.getNewIndex(), targetCardOrderIds.size());
        targetCardOrderIds.add(newIndex, cardId);
        taskListRepository.save(targetList);
        
        card.setListId(request.getTargetListId());
        Card savedCard = cardRepository.save(card);
        
        return CardResponse.fromEntity(savedCard);
    }
}
