package com.todoapp.controller;

import com.todoapp.dto.request.CardRequest;
import com.todoapp.dto.request.MoveCardRequest;
import com.todoapp.dto.response.ApiResponse;
import com.todoapp.dto.response.CardResponse;
import com.todoapp.security.UserPrincipal;
import com.todoapp.service.CardService;
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

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class CardController {
    
    private final CardService cardService;
    
    @PostMapping("/cards")
    public ResponseEntity<ApiResponse<CardResponse>> createStandaloneCard(
            @Valid @RequestBody CardRequest request,
            @AuthenticationPrincipal UserPrincipal userPrincipal) {
        CardResponse card = cardService.createStandaloneCard(request, userPrincipal.getId());
        return ResponseEntity.ok(ApiResponse.success("Standalone card created", card));
    }
    
    @PostMapping("/lists/{listId}/cards")
    public ResponseEntity<ApiResponse<CardResponse>> createCard(
            @PathVariable String listId,
            @Valid @RequestBody CardRequest request,
            @AuthenticationPrincipal UserPrincipal userPrincipal) {
        CardResponse card = cardService.createCard(listId, request, userPrincipal.getId());
        return ResponseEntity.ok(ApiResponse.success("Card created", card));
    }
    
    @GetMapping("/cards/{cardId}")
    public ResponseEntity<ApiResponse<CardResponse>> getCardById(
            @PathVariable String cardId,
            @AuthenticationPrincipal UserPrincipal userPrincipal) {
        CardResponse card = cardService.getCardById(cardId, userPrincipal.getId());
        return ResponseEntity.ok(ApiResponse.success(card));
    }
    
    @PutMapping("/cards/{cardId}")
    public ResponseEntity<ApiResponse<CardResponse>> updateCard(
            @PathVariable String cardId,
            @Valid @RequestBody CardRequest request,
            @AuthenticationPrincipal UserPrincipal userPrincipal) {
        CardResponse card = cardService.updateCard(cardId, request, userPrincipal.getId());
        return ResponseEntity.ok(ApiResponse.success("Card updated", card));
    }
    
    @PutMapping("/cards/{cardId}/move")
    public ResponseEntity<ApiResponse<CardResponse>> moveCard(
            @PathVariable String cardId,
            @Valid @RequestBody MoveCardRequest request,
            @AuthenticationPrincipal UserPrincipal userPrincipal) {
        CardResponse card = cardService.moveCard(cardId, request, userPrincipal.getId());
        return ResponseEntity.ok(ApiResponse.success("Card moved", card));
    }
    
    @DeleteMapping("/cards/{cardId}")
    public ResponseEntity<ApiResponse<Void>> deleteCard(
            @PathVariable String cardId,
            @AuthenticationPrincipal UserPrincipal userPrincipal) {
        cardService.deleteCard(cardId, userPrincipal.getId());
        return ResponseEntity.ok(ApiResponse.success("Card deleted", null));
    }
}
