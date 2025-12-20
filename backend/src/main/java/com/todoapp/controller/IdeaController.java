package com.todoapp.controller;

import com.todoapp.dto.request.IdeaRequest;
import com.todoapp.dto.response.ApiResponse;
import com.todoapp.dto.response.IdeaResponse;
import com.todoapp.security.UserPrincipal;
import com.todoapp.service.IdeaService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/ideas")
@RequiredArgsConstructor
public class IdeaController {
    
    private final IdeaService ideaService;
    
    @PostMapping
    public ResponseEntity<ApiResponse<IdeaResponse>> createIdea(
            @Valid @RequestBody IdeaRequest request,
            @AuthenticationPrincipal UserPrincipal userPrincipal) {
        IdeaResponse response = ideaService.createIdea(request, userPrincipal.getId());
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(new ApiResponse<>(true, "Idea created successfully", response));
    }
    
    @GetMapping("/{ideaId}")
    public ResponseEntity<ApiResponse<IdeaResponse>> getIdeaById(
            @PathVariable String ideaId) {
        IdeaResponse response = ideaService.getIdeaById(ideaId);
        return ResponseEntity.ok(new ApiResponse<>(true, "Idea retrieved successfully", response));
    }
    
    @GetMapping
    public ResponseEntity<ApiResponse<List<IdeaResponse>>> getAllIdeas() {
        List<IdeaResponse> ideas = ideaService.getAllIdeas();
        return ResponseEntity.ok(new ApiResponse<>(true, "Ideas retrieved successfully", ideas));
    }
    
    @GetMapping("/my")
    public ResponseEntity<ApiResponse<List<IdeaResponse>>> getMyIdeas(
            @AuthenticationPrincipal UserPrincipal userPrincipal) {
        List<IdeaResponse> ideas = ideaService.getMyIdeas(userPrincipal.getId());
        return ResponseEntity.ok(new ApiResponse<>(true, "Your ideas retrieved successfully", ideas));
    }
    
    @GetMapping("/approved")
    public ResponseEntity<ApiResponse<List<IdeaResponse>>> getApprovedIdeas() {
        List<IdeaResponse> ideas = ideaService.getApprovedIdeas();
        return ResponseEntity.ok(new ApiResponse<>(true, "Approved ideas retrieved successfully", ideas));
    }
    
    @PutMapping("/{ideaId}")
    public ResponseEntity<ApiResponse<IdeaResponse>> updateIdea(
            @PathVariable String ideaId,
            @Valid @RequestBody IdeaRequest request,
            @AuthenticationPrincipal UserPrincipal userPrincipal) {
        IdeaResponse response = ideaService.updateIdea(ideaId, request, userPrincipal.getId());
        return ResponseEntity.ok(new ApiResponse<>(true, "Idea updated successfully", response));
    }
    
    @PutMapping("/{ideaId}/approve")
    public ResponseEntity<ApiResponse<IdeaResponse>> approveIdea(
            @PathVariable String ideaId,
            @AuthenticationPrincipal UserPrincipal userPrincipal) {
        IdeaResponse response = ideaService.approveIdea(ideaId, userPrincipal.getId());
        return ResponseEntity.ok(new ApiResponse<>(true, "Idea approved successfully", response));
    }
    
    @DeleteMapping("/{ideaId}")
    public ResponseEntity<ApiResponse<Void>> deleteIdea(
            @PathVariable String ideaId,
            @AuthenticationPrincipal UserPrincipal userPrincipal) {
        ideaService.deleteIdea(ideaId, userPrincipal.getId());
        return ResponseEntity.ok(new ApiResponse<>(true, "Idea deleted successfully", null));
    }
}
