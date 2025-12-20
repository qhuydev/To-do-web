package com.todoapp.service;

import com.todoapp.dto.request.IdeaRequest;
import com.todoapp.dto.response.IdeaResponse;
import com.todoapp.dto.response.UserResponse;
import com.todoapp.exception.BadRequestException;
import com.todoapp.exception.ResourceNotFoundException;
import com.todoapp.model.Idea;
import com.todoapp.model.User;
import com.todoapp.repository.IdeaRepository;
import com.todoapp.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class IdeaService {
    
    private final IdeaRepository ideaRepository;
    private final UserRepository userRepository;
    
    @Transactional
    public IdeaResponse createIdea(IdeaRequest request, String userId) {
        Idea idea = Idea.builder()
                .title(request.getTitle())
                .description(request.getDescription())
                .userId(userId)
                .isApproved(false)
                .build();
        
        idea = ideaRepository.save(idea);
        
        IdeaResponse response = IdeaResponse.fromEntity(idea);
        User user = userRepository.findById(userId).orElse(null);
        if (user != null) {
            response.setUser(UserResponse.fromEntity(user));
        }
        
        return response;
    }
    
    public IdeaResponse getIdeaById(String ideaId) {
        Idea idea = ideaRepository.findById(ideaId)
                .orElseThrow(() -> new ResourceNotFoundException("Idea", "id", ideaId));
        
        IdeaResponse response = IdeaResponse.fromEntity(idea);
        User user = userRepository.findById(idea.getUserId()).orElse(null);
        if (user != null) {
            response.setUser(UserResponse.fromEntity(user));
        }
        
        return response;
    }
    
    public List<IdeaResponse> getAllIdeas() {
        List<Idea> ideas = ideaRepository.findAll();
        return ideas.stream()
                .map(idea -> {
                    IdeaResponse response = IdeaResponse.fromEntity(idea);
                    User user = userRepository.findById(idea.getUserId()).orElse(null);
                    if (user != null) {
                        response.setUser(UserResponse.fromEntity(user));
                    }
                    return response;
                })
                .collect(Collectors.toList());
    }
    
    public List<IdeaResponse> getMyIdeas(String userId) {
        List<Idea> ideas = ideaRepository.findByUserId(userId);
        return ideas.stream()
                .map(IdeaResponse::fromEntity)
                .collect(Collectors.toList());
    }
    
    public List<IdeaResponse> getApprovedIdeas() {
        List<Idea> ideas = ideaRepository.findByIsApproved(true);
        return ideas.stream()
                .map(idea -> {
                    IdeaResponse response = IdeaResponse.fromEntity(idea);
                    User user = userRepository.findById(idea.getUserId()).orElse(null);
                    if (user != null) {
                        response.setUser(UserResponse.fromEntity(user));
                    }
                    return response;
                })
                .collect(Collectors.toList());
    }
    
    @Transactional
    public IdeaResponse updateIdea(String ideaId, IdeaRequest request, String userId) {
        Idea idea = ideaRepository.findById(ideaId)
                .orElseThrow(() -> new ResourceNotFoundException("Idea", "id", ideaId));
        
        if (!idea.getUserId().equals(userId)) {
            throw new BadRequestException("You don't have permission to update this idea");
        }
        
        if (request.getTitle() != null) {
            idea.setTitle(request.getTitle());
        }
        if (request.getDescription() != null) {
            idea.setDescription(request.getDescription());
        }
        
        idea = ideaRepository.save(idea);
        return IdeaResponse.fromEntity(idea);
    }
    
    @Transactional
    public IdeaResponse approveIdea(String ideaId, String userId) {
        Idea idea = ideaRepository.findById(ideaId)
                .orElseThrow(() -> new ResourceNotFoundException("Idea", "id", ideaId));
        
        idea.setIsApproved(true);
        idea = ideaRepository.save(idea);
        
        return IdeaResponse.fromEntity(idea);
    }
    
    @Transactional
    public void deleteIdea(String ideaId, String userId) {
        Idea idea = ideaRepository.findById(ideaId)
                .orElseThrow(() -> new ResourceNotFoundException("Idea", "id", ideaId));
        
        if (!idea.getUserId().equals(userId)) {
            throw new BadRequestException("You don't have permission to delete this idea");
        }
        
        ideaRepository.delete(idea);
    }
}
