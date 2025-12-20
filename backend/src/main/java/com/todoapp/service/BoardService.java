package com.todoapp.service;

import com.todoapp.dto.request.BoardRequest;
import com.todoapp.dto.response.BoardResponse;
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
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class BoardService {
    
    private final BoardRepository boardRepository;
    private final TaskListRepository taskListRepository;
    private final CardRepository cardRepository;
    
    public List<BoardResponse> getBoardsByOwner(String ownerId) {
        return boardRepository.findByOwnerId(ownerId).stream()
                .map(BoardResponse::fromEntity)
                .collect(Collectors.toList());
    }
    
    public BoardResponse getBoardById(String boardId, String userId) {
        Board board = boardRepository.findById(boardId)
                .orElseThrow(() -> new ResourceNotFoundException("Board", "id", boardId));
        
        if (!board.getOwnerId().equals(userId)) {
            throw new BadRequestException("You don't have permission to access this board");
        }
        
        List<TaskList> lists = taskListRepository.findByBoardId(boardId);
        List<Card> allCards = cardRepository.findByBoardId(boardId);
        
        Map<String, List<Card>> cardsByListId = allCards.stream()
                .collect(Collectors.groupingBy(Card::getListId));
        
        List<TaskListResponse> listResponses = lists.stream()
                .map(list -> {
                    List<Card> listCards = cardsByListId.getOrDefault(list.getId(), new ArrayList<>());
                    List<CardResponse> cardResponses = listCards.stream()
                            .map(CardResponse::fromEntity)
                            .collect(Collectors.toList());
                    return TaskListResponse.fromEntityWithCards(list, cardResponses);
                })
                .collect(Collectors.toList());
        
        return BoardResponse.fromEntityWithLists(board, listResponses);
    }
    
    public BoardResponse createBoard(BoardRequest request, String ownerId) {
        Board board = Board.builder()
                .title(request.getTitle())
                .description(request.getDescription())
                .background(request.getBackground())
                .ownerId(ownerId)
                .listOrderIds(new ArrayList<>())
                .build();
        
        board = boardRepository.save(board);
        return BoardResponse.fromEntity(board);
    }
    
    public BoardResponse updateBoard(String boardId, BoardRequest request, String userId) {
        Board board = boardRepository.findById(boardId)
                .orElseThrow(() -> new ResourceNotFoundException("Board", "id", boardId));
        
        if (!board.getOwnerId().equals(userId)) {
            throw new BadRequestException("You don't have permission to update this board");
        }
        
        if (request.getTitle() != null) {
            board.setTitle(request.getTitle());
        }
        if (request.getDescription() != null) {
            board.setDescription(request.getDescription());
        }
        if (request.getBackground() != null) {
            board.setBackground(request.getBackground());
        }
        
        board = boardRepository.save(board);
        return BoardResponse.fromEntity(board);
    }
    
    public BoardResponse toggleStar(String boardId, String userId) {
        Board board = boardRepository.findById(boardId)
                .orElseThrow(() -> new ResourceNotFoundException("Board", "id", boardId));
        
        if (!board.getOwnerId().equals(userId)) {
            throw new BadRequestException("You don't have permission to update this board");
        }
        
        board.setIsStarred(!board.getIsStarred());
        board = boardRepository.save(board);
        return BoardResponse.fromEntity(board);
    }
    
    @Transactional
    public void deleteBoard(String boardId, String userId) {
        Board board = boardRepository.findById(boardId)
                .orElseThrow(() -> new ResourceNotFoundException("Board", "id", boardId));
        
        if (!board.getOwnerId().equals(userId)) {
            throw new BadRequestException("You don't have permission to delete this board");
        }
        
        cardRepository.deleteByBoardId(boardId);
        taskListRepository.deleteByBoardId(boardId);
        boardRepository.delete(board);
    }
    
    public BoardResponse updateListOrder(String boardId, List<String> listOrderIds, String userId) {
        Board board = boardRepository.findById(boardId)
                .orElseThrow(() -> new ResourceNotFoundException("Board", "id", boardId));
        
        if (!board.getOwnerId().equals(userId)) {
            throw new BadRequestException("You don't have permission to update this board");
        }
        
        board.setListOrderIds(listOrderIds);
        board = boardRepository.save(board);
        return BoardResponse.fromEntity(board);
    }
}
