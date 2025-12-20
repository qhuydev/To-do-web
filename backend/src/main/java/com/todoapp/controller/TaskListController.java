package com.todoapp.controller;

import com.todoapp.dto.request.TaskListRequest;
import com.todoapp.dto.response.ApiResponse;
import com.todoapp.dto.response.TaskListResponse;
import com.todoapp.security.UserPrincipal;
import com.todoapp.service.TaskListService;
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
@RequestMapping("/api")
@RequiredArgsConstructor
public class TaskListController {
    
    private final TaskListService taskListService;
    
    @PostMapping("/boards/{boardId}/lists")
    public ResponseEntity<ApiResponse<TaskListResponse>> createList(
            @PathVariable String boardId,
            @Valid @RequestBody TaskListRequest request,
            @AuthenticationPrincipal UserPrincipal userPrincipal) {
        TaskListResponse list = taskListService.createList(boardId, request, userPrincipal.getId());
        return ResponseEntity.ok(ApiResponse.success("List created", list));
    }
    
    @GetMapping("/lists/{listId}")
    public ResponseEntity<ApiResponse<TaskListResponse>> getListWithCards(
            @PathVariable String listId,
            @AuthenticationPrincipal UserPrincipal userPrincipal) {
        TaskListResponse list = taskListService.getListWithCards(listId, userPrincipal.getId());
        return ResponseEntity.ok(ApiResponse.success(list));
    }
    
    @PutMapping("/lists/{listId}")
    public ResponseEntity<ApiResponse<TaskListResponse>> updateList(
            @PathVariable String listId,
            @Valid @RequestBody TaskListRequest request,
            @AuthenticationPrincipal UserPrincipal userPrincipal) {
        TaskListResponse list = taskListService.updateList(listId, request, userPrincipal.getId());
        return ResponseEntity.ok(ApiResponse.success("List updated", list));
    }
    
    @PutMapping("/lists/{listId}/card-order")
    public ResponseEntity<ApiResponse<TaskListResponse>> updateCardOrder(
            @PathVariable String listId,
            @RequestBody List<String> cardOrderIds,
            @AuthenticationPrincipal UserPrincipal userPrincipal) {
        TaskListResponse list = taskListService.updateCardOrder(listId, cardOrderIds, userPrincipal.getId());
        return ResponseEntity.ok(ApiResponse.success(list));
    }
    
    @DeleteMapping("/lists/{listId}")
    public ResponseEntity<ApiResponse<Void>> deleteList(
            @PathVariable String listId,
            @AuthenticationPrincipal UserPrincipal userPrincipal) {
        taskListService.deleteList(listId, userPrincipal.getId());
        return ResponseEntity.ok(ApiResponse.success("List deleted", null));
    }
}
