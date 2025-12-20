package com.todoapp.controller;

import com.todoapp.dto.request.BoardRequest;
import com.todoapp.dto.response.ApiResponse;
import com.todoapp.dto.response.BoardResponse;
import com.todoapp.security.UserPrincipal;
import com.todoapp.service.BoardService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/boards")
@RequiredArgsConstructor
public class BoardController {
    
    private final BoardService boardService;
    
    @GetMapping
    public ResponseEntity<ApiResponse<List<BoardResponse>>> getMyBoards(
            @AuthenticationPrincipal UserPrincipal userPrincipal) {
        List<BoardResponse> boards = boardService.getBoardsByOwner(userPrincipal.getId());
        return ResponseEntity.ok(ApiResponse.success(boards));
    }
    
    @GetMapping("/{boardId}")
    public ResponseEntity<ApiResponse<BoardResponse>> getBoardById(
            @PathVariable String boardId,
            @AuthenticationPrincipal UserPrincipal userPrincipal) {
        BoardResponse board = boardService.getBoardById(boardId, userPrincipal.getId());
        return ResponseEntity.ok(ApiResponse.success(board));
    }
    
    @PostMapping
    public ResponseEntity<ApiResponse<BoardResponse>> createBoard(
            @Valid @RequestBody BoardRequest request,
            @AuthenticationPrincipal UserPrincipal userPrincipal) {
        BoardResponse board = boardService.createBoard(request, userPrincipal.getId());
        return ResponseEntity.ok(ApiResponse.success("Board created", board));
    }
    
    @PutMapping("/{boardId}")
    public ResponseEntity<ApiResponse<BoardResponse>> updateBoard(
            @PathVariable String boardId,
            @Valid @RequestBody BoardRequest request,
            @AuthenticationPrincipal UserPrincipal userPrincipal) {
        BoardResponse board = boardService.updateBoard(boardId, request, userPrincipal.getId());
        return ResponseEntity.ok(ApiResponse.success("Board updated", board));
    }
    
    @PutMapping("/{boardId}/star")
    public ResponseEntity<ApiResponse<BoardResponse>> toggleStar(
            @PathVariable String boardId,
            @AuthenticationPrincipal UserPrincipal userPrincipal) {
        BoardResponse board = boardService.toggleStar(boardId, userPrincipal.getId());
        return ResponseEntity.ok(ApiResponse.success(board));
    }
    
    @PutMapping("/{boardId}/list-order")
    public ResponseEntity<ApiResponse<BoardResponse>> updateListOrder(
            @PathVariable String boardId,
            @RequestBody List<String> listOrderIds,
            @AuthenticationPrincipal UserPrincipal userPrincipal) {
        BoardResponse board = boardService.updateListOrder(boardId, listOrderIds, userPrincipal.getId());
        return ResponseEntity.ok(ApiResponse.success(board));
    }
    
    @DeleteMapping("/{boardId}")
    public ResponseEntity<ApiResponse<Void>> deleteBoard(
            @PathVariable String boardId,
            @AuthenticationPrincipal UserPrincipal userPrincipal) {
        boardService.deleteBoard(boardId, userPrincipal.getId());
        return ResponseEntity.ok(ApiResponse.success("Board deleted", null));
    }
}
