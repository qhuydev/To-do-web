package com.todoapp.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "boards")
public class Board {
    
    @Id
    private String id;
    
    private String title;
    
    private String description;
    
    private String background;
    
    private String ownerId;
    
    @Builder.Default
    private Boolean isStarred = false;
    
    @Builder.Default
    private List<String> listOrderIds = new ArrayList<>();
    
    @CreatedDate
    private LocalDateTime createdAt;
    
    @LastModifiedDate
    private LocalDateTime updatedAt;
}
