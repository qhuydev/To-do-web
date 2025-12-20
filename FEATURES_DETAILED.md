# 🎯 TOÀN BỘ CHỨC NĂNG DỰ ÁN THUCTAP

## 📑 MỤC LỤC

1. [CRUD Boards (Quản lý bảng)](#1-crud-boards)
2. [CRUD Lists (Quản lý cột)](#2-crud-lists)
3. [CRUD Cards (Quản lý thẻ)](#3-crud-cards)
4. [Chat Box (Nhắn tin)](#4-chat-box)
5. [Friend System (Kết bạn)](#5-friend-system)
6. [Task Assignment (Giao việc)](#6-task-assignment)
7. [Tính năng khác](#7-tính-năng-khác)

---

## 1️⃣ CRUD BOARDS (Quản lý bảng)

### **A. CREATE BOARD (Tạo bảng)**

#### **Frontend (React)**
```javascript
// BoardBar.jsx hoặc Modal
const handleCreateBoard = async (data) => {
  const result = await boardApi.create({
    title: "My Board",
    background: "#3742fa"
  })
  // Data trả về: { id, title, background, owner, createdAt, lists: [] }
  navigate(`/board/${result.id}`)
}
```

#### **API Flow**
```
POST /api/boards
Body: { title: "My Board", background: "#3742fa" }
Authorization: Bearer {accessToken}
```

#### **Backend**
```java
// BoardController.java
@PostMapping
public ResponseEntity<ApiResponse<BoardResponse>> createBoard(
    @Valid @RequestBody BoardRequest request,
    @AuthenticationPrincipal UserPrincipal userPrincipal) {
  // userPrincipal.getId() = current user
  BoardResponse board = boardService.createBoard(request, userPrincipal.getId());
  return ResponseEntity.ok(ApiResponse.success("Board created", board));
}

// BoardService.java
public BoardResponse createBoard(BoardRequest request, String userId) {
  // 1. Tạo Board object
  Board board = Board.builder()
      .title(request.getTitle())
      .background(request.getBackground())
      .ownerId(userId)  // ← Người tạo là owner
      .lists(new ArrayList<>())
      .listOrderIds(new ArrayList<>())
      .build();
  
  // 2. Lưu vào MongoDB
  Board savedBoard = boardRepository.save(board);
  
  // 3. Convert sang Response DTO
  return BoardResponse.from(savedBoard);
}

// MongoDB
// Collection: boards
{
  "_id": ObjectId("..."),
  "title": "My Board",
  "background": "#3742fa",
  "ownerId": "userId123",
  "lists": [],
  "listOrderIds": [],
  "createdAt": ISODate("2025-12-17T..."),
  "updatedAt": ISODate("2025-12-17T...")
}
```

#### **Response**
```json
{
  "success": true,
  "message": "Board created",
  "data": {
    "id": "507f1f77bcf86cd799439011",
    "title": "My Board",
    "background": "#3742fa",
    "ownerId": "userId123",
    "lists": [],
    "listOrderIds": [],
    "createdAt": "2025-12-17T10:00:00Z",
    "updatedAt": "2025-12-17T10:00:00Z"
  }
}
```

---

### **B. READ BOARD (Xem bảng)**

#### **Frontend**
```javascript
// BoardList.jsx
useEffect(() => {
  const boards = await boardApi.getAll()
  // Return: [{ id, title, background, owner }, ...]
}, [])

// Board.jsx (chi tiết 1 board)
useEffect(() => {
  const board = await boardApi.getById(boardId)
  // Return: { id, title, lists: [{id, title, cards: [...]}, ...] }
}, [boardId])
```

#### **API**
```
GET /api/boards                    ← Lấy danh sách
GET /api/boards/{boardId}          ← Lấy chi tiết 1 board
Authorization: Bearer {accessToken}
```

#### **Backend**
```java
// BoardController.java
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

// BoardService.java
public List<BoardResponse> getBoardsByOwner(String userId) {
  // Query: SELECT * FROM boards WHERE ownerId = userId
  List<Board> boards = boardRepository.findByOwnerId(userId);
  return boards.stream()
      .map(BoardResponse::from)
      .collect(Collectors.toList());
}

public BoardResponse getBoardById(String boardId, String userId) {
  // Query: SELECT * FROM boards WHERE id = boardId AND ownerId = userId
  Board board = boardRepository.findByIdAndOwnerId(boardId, userId)
      .orElseThrow(() -> new ResourceNotFoundException("Board not found"));
  return BoardResponse.from(board);
}
```

---

### **C. UPDATE BOARD (Cập nhật bảng)**

#### **Frontend**
```javascript
// BoardBar.jsx
const handleUpdateBoard = async (boardId, data) => {
  const result = await boardApi.update(boardId, {
    title: "New Title",
    background: "#ff6b6b"
  })
}

// Star/Unstar board
const handleToggleStar = async (boardId) => {
  await boardApi.toggleStar(boardId)
}
```

#### **API**
```
PUT /api/boards/{boardId}
Body: { title: "New Title", background: "#ff6b6b" }

PUT /api/boards/{boardId}/star
(Toggle star status)
```

#### **Backend**
```java
// BoardController.java
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

// BoardService.java
public BoardResponse updateBoard(String boardId, BoardRequest request, String userId) {
  Board board = boardRepository.findByIdAndOwnerId(boardId, userId)
      .orElseThrow(() -> new ResourceNotFoundException("Board not found"));
  
  board.setTitle(request.getTitle());
  board.setBackground(request.getBackground());
  
  Board updatedBoard = boardRepository.save(board);
  return BoardResponse.from(updatedBoard);
}
```

---

### **D. DELETE BOARD (Xóa bảng)**

#### **Frontend**
```javascript
// BoardBar.jsx
const handleDeleteBoard = async (boardId) => {
  if (window.confirm("Delete this board?")) {
    await boardApi.delete(boardId)
    navigate('/') // Về trang chủ
  }
}
```

#### **API**
```
DELETE /api/boards/{boardId}
Authorization: Bearer {accessToken}
```

#### **Backend**
```java
// BoardController.java
@DeleteMapping("/{boardId}")
public ResponseEntity<ApiResponse<Void>> deleteBoard(
    @PathVariable String boardId,
    @AuthenticationPrincipal UserPrincipal userPrincipal) {
  boardService.deleteBoard(boardId, userPrincipal.getId());
  return ResponseEntity.ok(ApiResponse.success("Board deleted", null));
}

// BoardService.java
public void deleteBoard(String boardId, String userId) {
  Board board = boardRepository.findByIdAndOwnerId(boardId, userId)
      .orElseThrow(() -> new ResourceNotFoundException("Board not found"));
  
  // Xóa tất cả lists của board này
  board.getListOrderIds().forEach(listId -> {
    taskListRepository.deleteById(listId);
  });
  
  // Xóa board
  boardRepository.deleteById(boardId);
}
```

---

## 2️⃣ CRUD LISTS (Quản lý cột)

### **A. CREATE LIST (Tạo cột)**

#### **Frontend**
```javascript
// ListColumns.jsx
const handleCreateList = async (boardId) => {
  const result = await listApi.create(boardId, {
    title: "To Do"
  })
  // Response: { id, title, boardId, cards: [], cardOrderIds: [] }
}
```

#### **API**
```
POST /api/boards/{boardId}/lists
Body: { title: "To Do" }
Authorization: Bearer {accessToken}
```

#### **Backend**
```java
// TaskListController.java
@PostMapping("/boards/{boardId}/lists")
public ResponseEntity<ApiResponse<TaskListResponse>> createList(
    @PathVariable String boardId,
    @Valid @RequestBody TaskListRequest request,
    @AuthenticationPrincipal UserPrincipal userPrincipal) {
  TaskListResponse list = taskListService.createList(boardId, request, userPrincipal.getId());
  return ResponseEntity.ok(ApiResponse.success("List created", list));
}

// TaskListService.java
public TaskListResponse createList(String boardId, TaskListRequest request, String userId) {
  // 1. Check user có quyền access board này
  Board board = boardRepository.findByIdAndOwnerId(boardId, userId)
      .orElseThrow(() -> new ResourceNotFoundException("Board not found"));
  
  // 2. Tạo list
  TaskList taskList = TaskList.builder()
      .title(request.getTitle())
      .boardId(boardId)
      .cards(new ArrayList<>())
      .cardOrderIds(new ArrayList<>())
      .build();
  
  TaskList savedList = taskListRepository.save(taskList);
  
  // 3. Add list vào board's listOrderIds
  board.getListOrderIds().add(savedList.getId());
  boardRepository.save(board);
  
  return TaskListResponse.from(savedList);
}

// MongoDB
// Collection: tasklists
{
  "_id": ObjectId("..."),
  "title": "To Do",
  "boardId": "boardId123",
  "cards": [],
  "cardOrderIds": []
}
```

---

### **B. READ LIST (Xem cột)**

#### **Frontend**
```javascript
// Board.jsx
const lists = board?.lists || []
// Render từng list với cards
```

#### **Backend**
```java
// TaskListService.java
public TaskListResponse getListWithCards(String listId, String userId) {
  // Lấy list cùng tất cả cards
  TaskList list = taskListRepository.findById(listId)
      .orElseThrow(() -> new ResourceNotFoundException("List not found"));
  
  // Verify user có quyền
  Board board = boardRepository.findById(list.getBoardId())
      .orElseThrow(() -> new ResourceNotFoundException("Board not found"));
  
  return TaskListResponse.from(list);
}
```

---

### **C. UPDATE LIST (Cập nhật cột)**

#### **Frontend**
```javascript
// ListColumns.jsx
const handleUpdateList = async (listId, newTitle) => {
  await listApi.update(listId, { title: newTitle })
}
```

#### **API**
```
PUT /api/lists/{listId}
Body: { title: "New Title" }
```

#### **Backend**
```java
// TaskListService.java
public TaskListResponse updateList(String listId, TaskListRequest request, String userId) {
  TaskList taskList = taskListRepository.findById(listId)
      .orElseThrow(() -> new ResourceNotFoundException("List not found"));
  
  taskList.setTitle(request.getTitle());
  TaskList updatedList = taskListRepository.save(taskList);
  
  return TaskListResponse.from(updatedList);
}
```

---

### **D. DELETE LIST (Xóa cột)**

#### **Frontend**
```javascript
// ListColumns.jsx
const handleDeleteList = async (listId, boardId) => {
  if (window.confirm("Delete this list?")) {
    await listApi.delete(listId)
  }
}
```

#### **Backend**
```java
// TaskListService.java
public void deleteList(String listId, String userId) {
  TaskList taskList = taskListRepository.findById(listId)
      .orElseThrow(() -> new ResourceNotFoundException("List not found"));
  
  // Xóa tất cả cards của list này
  taskList.getCardOrderIds().forEach(cardId -> {
    cardRepository.deleteById(cardId);
  });
  
  // Xóa list khỏi board
  Board board = boardRepository.findById(taskList.getBoardId()).get();
  board.getListOrderIds().remove(listId);
  boardRepository.save(board);
  
  // Xóa list
  taskListRepository.deleteById(listId);
}
```

---

## 3️⃣ CRUD CARDS (Quản lý thẻ)

### **A. CREATE CARD (Tạo thẻ)**

#### **Frontend (BoardContent.jsx)**
```javascript
// Từ drag-drop hoặc modal
const handleCreateCard = async (listId, cardData) => {
  const result = await cardApi.create(listId, {
    title: "Task title",
    description: "Description"
  })
}

// Giao việc cho bạn bè (từ Chat)
const handleAssignTask = async (receiverId, cardData) => {
  const result = await cardApi.create(null, {
    title: cardData.title,
    description: cardData.description,
    receiverId: receiverId  // ← Giao cho ai
  })
  // Card được tạo & đưa vào chat message
}
```

#### **API**
```
POST /api/lists/{listId}/cards              ← Tạo card trong list
Body: { title: "Task", description: "..." }

POST /api/cards                             ← Tạo standalone card (giao việc)
Body: { title: "Task", receiverId: "..." }
```

#### **Backend**
```java
// CardController.java
@PostMapping("/lists/{listId}/cards")
public ResponseEntity<ApiResponse<CardResponse>> createCard(
    @PathVariable String listId,
    @Valid @RequestBody CardRequest request,
    @AuthenticationPrincipal UserPrincipal userPrincipal) {
  CardResponse card = cardService.createCard(listId, request, userPrincipal.getId());
  return ResponseEntity.ok(ApiResponse.success("Card created", card));
}

@PostMapping("/cards")  // ← Standalone card (giao việc)
public ResponseEntity<ApiResponse<CardResponse>> createStandaloneCard(
    @Valid @RequestBody CardRequest request,
    @AuthenticationPrincipal UserPrincipal userPrincipal) {
  CardResponse card = cardService.createStandaloneCard(request, userPrincipal.getId());
  return ResponseEntity.ok(ApiResponse.success("Card created", card));
}

// CardService.java
public CardResponse createCard(String listId, CardRequest request, String userId) {
  TaskList taskList = taskListRepository.findById(listId)
      .orElseThrow(() -> new ResourceNotFoundException("List not found"));
  
  // Tạo card
  Card card = Card.builder()
      .title(request.getTitle())
      .description(request.getDescription())
      .listId(listId)
      .createdBy(userId)
      .build();
  
  Card savedCard = cardRepository.save(card);
  
  // Add vào list
  taskList.getCardOrderIds().add(savedCard.getId());
  taskListRepository.save(taskList);
  
  return CardResponse.from(savedCard);
}

public CardResponse createStandaloneCard(CardRequest request, String userId) {
  // Card không thuộc list nào (dùng để giao việc)
  Card card = Card.builder()
      .title(request.getTitle())
      .description(request.getDescription())
      .receiverId(request.getReceiverId())  // ← Người nhận
      .createdBy(userId)  // ← Người giao
      .build();
  
  Card savedCard = cardRepository.save(card);
  
  // Tạo message gắn card này
  Message message = Message.builder()
      .senderId(userId)
      .receiverId(request.getReceiverId())
      .type("CARD")
      .card(savedCard)
      .build();
  
  messageRepository.save(message);
  
  return CardResponse.from(savedCard);
}

// MongoDB
// Collection: cards
{
  "_id": ObjectId("..."),
  "title": "Fix bugs",
  "description": "...",
  "listId": "listId123",  // null nếu standalone
  "receiverId": "userId456",  // Nếu giao việc
  "createdBy": "userId123",
  "createdAt": ISODate("...")
}
```

---

### **B. READ CARD (Xem thẻ)**

#### **Frontend**
```javascript
// BoardContent.jsx render cards từ lists
cards.map(card => <Card key={card.id} card={card} />)

// EditCardModal.jsx
const handleOpenCard = async (cardId) => {
  const card = await cardApi.getById(cardId)
  // Show modal chi tiết
}
```

#### **Backend**
```java
// CardService.java
public CardResponse getCardById(String cardId, String userId) {
  Card card = cardRepository.findById(cardId)
      .orElseThrow(() -> new ResourceNotFoundException("Card not found"));
  
  return CardResponse.from(card);
}
```

---

### **C. UPDATE CARD (Cập nhật thẻ)**

#### **Frontend**
```javascript
// EditCardModal.jsx
const handleSaveCard = async (cardId, updates) => {
  await cardApi.update(cardId, {
    title: "New title",
    description: "New description",
    status: "In Progress"
  })
}
```

#### **API**
```
PUT /api/cards/{cardId}
Body: { title, description, status, ... }
```

#### **Backend**
```java
// CardService.java
public CardResponse updateCard(String cardId, CardRequest request, String userId) {
  Card card = cardRepository.findById(cardId)
      .orElseThrow(() -> new ResourceNotFoundException("Card not found"));
  
  card.setTitle(request.getTitle());
  card.setDescription(request.getDescription());
  card.setStatus(request.getStatus());
  
  Card updatedCard = cardRepository.save(card);
  return CardResponse.from(updatedCard);
}
```

---

### **D. DELETE CARD (Xóa thẻ)**

#### **Frontend**
```javascript
// Card action menu
const handleDeleteCard = async (cardId, listId) => {
  await cardApi.delete(cardId)
  // Xóa khỏi list
}
```

#### **Backend**
```java
// CardService.java
public void deleteCard(String cardId, String userId) {
  Card card = cardRepository.findById(cardId)
      .orElseThrow(() -> new ResourceNotFoundException("Card not found"));
  
  // Nếu card thuộc list, xóa khỏi list
  if (card.getListId() != null) {
    TaskList taskList = taskListRepository.findById(card.getListId()).get();
    taskList.getCardOrderIds().remove(cardId);
    taskListRepository.save(taskList);
  }
  
  // Xóa card
  cardRepository.deleteById(cardId);
}
```

---

### **E. MOVE CARD (Di chuyển thẻ - Drag-Drop)**

#### **Frontend (ListColumns.jsx)**
```javascript
// Dùng DndKit thư viện
const handleDragCard = async (cardId, sourceListId, targetListId, newIndex) => {
  // Optimistic update (cập nhật UI trước)
  setCards(prev => {
    // Move card in state
  })
  
  // Gọi API
  await boardApi.moveCard({
    cardId,
    sourceListId,
    targetListId,
    newIndex
  })
}
```

#### **API**
```
PUT /api/cards/{cardId}/move
Body: { targetListId: "...", newIndex: 0 }
```

#### **Backend**
```java
// CardController.java
@PutMapping("/{cardId}/move")
public ResponseEntity<ApiResponse<CardResponse>> moveCard(
    @PathVariable String cardId,
    @Valid @RequestBody MoveCardRequest request,
    @AuthenticationPrincipal UserPrincipal userPrincipal) {
  CardResponse card = cardService.moveCard(cardId, request, userPrincipal.getId());
  return ResponseEntity.ok(ApiResponse.success("Card moved", card));
}

// CardService.java
public CardResponse moveCard(String cardId, MoveCardRequest request, String userId) {
  Card card = cardRepository.findById(cardId).get();
  String sourceListId = card.getListId();
  String targetListId = request.getTargetListId();
  
  // Xóa khỏi source list
  if (sourceListId != null) {
    TaskList sourceList = taskListRepository.findById(sourceListId).get();
    sourceList.getCardOrderIds().remove(cardId);
    taskListRepository.save(sourceList);
  }
  
  // Thêm vào target list
  TaskList targetList = taskListRepository.findById(targetListId).get();
  int newIndex = request.getNewIndex();
  targetList.getCardOrderIds().add(newIndex, cardId);
  card.setListId(targetListId);
  
  Card movedCard = cardRepository.save(card);
  taskListRepository.save(targetList);
  
  return CardResponse.from(movedCard);
}
```

---

## 4️⃣ CHAT BOX (Nhắn tin)

### **FLOW: MỞ CHAT & GỬI TINMẮN**

#### **Frontend (FriendsModal.jsx + ChatWidget.jsx)**

**1. Click "Nhắn tin"**
```javascript
const handleOpenChat = (friend) => {
  // Thêm vào activeChats
  setActiveChats(prev => [...prev, { friend, isMinimized: false }])
  // ChatWidget tự động render
}
```

**2. ChatWidget mount → Load conversation**
```javascript
useEffect(() => {
  if (friend?.id) {
    loadConversation()  // GET /api/messages/conversation/{friendId}
  }
}, [friend?.id])

const loadConversation = async () => {
  const messages = await messageApi.getConversationWithUser(friend.id)
  // messages = [{ id, content, senderId, type: 'TEXT'/'CARD', ... }]
  setMessages(messages)
}
```

**3. Gửi tin nhắn**
```javascript
const handleSendMessage = async () => {
  const res = await messageApi.sendMessage({
    receiverId: friend.id,
    content: "Hello",
    messageType: "TEXT"
  })
  // Response: { id, content, senderId, receiverId, createdAt, ... }
  setMessages(prev => [...prev, newMessage])
}
```

#### **API**
```
POST /api/messages/send
Body: {
  receiverId: "userId456",
  content: "Hello",
  messageType: "TEXT"  // hoặc "CARD"
}

GET /api/messages/conversation/{otherUserId}
(Lấy toàn bộ tin nhắn giữa 2 user)

PUT /api/messages/conversation/{otherUserId}/read
(Đánh dấu đã đọc)

DELETE /api/messages/{messageId}
(Xóa tin nhắn)
```

#### **Backend**
```java
// MessageController.java
@PostMapping("/send")
public ResponseEntity<ApiResponse<MessageResponse>> sendMessage(
    @Valid @RequestBody MessageRequest request,
    @AuthenticationPrincipal UserPrincipal userPrincipal) {
  MessageResponse response = messageService.sendMessage(userPrincipal.getId(), request);
  return ResponseEntity.status(HttpStatus.CREATED)
      .body(new ApiResponse<>(true, "Message sent successfully", response));
}

@GetMapping("/conversation/{otherUserId}")
public ResponseEntity<ApiResponse<List<MessageResponse>>> getConversation(
    @PathVariable String otherUserId,
    @AuthenticationPrincipal UserPrincipal userPrincipal) {
  List<MessageResponse> messages = messageService.getConversation(userPrincipal.getId(), otherUserId);
  return ResponseEntity.ok(new ApiResponse<>(true, "Conversation retrieved", messages));
}

// MessageService.java
public MessageResponse sendMessage(String senderId, MessageRequest request) {
  Message message = Message.builder()
      .senderId(senderId)
      .receiverId(request.getReceiverId())
      .content(request.getContent())
      .type(request.getMessageType())  // TEXT hoặc CARD
      .card(request.getCard())  // Nếu type = CARD
      .isRead(false)
      .build();
  
  Message savedMessage = messageRepository.save(message);
  return MessageResponse.from(savedMessage);
}

public List<MessageResponse> getConversation(String userId1, String userId2) {
  // Query: messages WHERE (senderId=userId1 AND receiverId=userId2) 
  //         OR (senderId=userId2 AND receiverId=userId1)
  List<Message> messages = messageRepository.findConversation(userId1, userId2);
  
  return messages.stream()
      .map(MessageResponse::from)
      .collect(Collectors.toList());
}

// MongoDB
// Collection: messages
{
  "_id": ObjectId("..."),
  "senderId": "userId123",
  "receiverId": "userId456",
  "content": "Hello",
  "type": "TEXT",  // hoặc "CARD"
  "card": null,     // Nếu type = CARD, chứa card object
  "isRead": false,
  "createdAt": ISODate("..."),
  "updatedAt": ISODate("...")
}
```

---

## 5️⃣ FRIEND SYSTEM (Kết bạn)

### **A. SEND FRIEND REQUEST (Gửi lời mời)**

#### **Frontend (FriendsModal.jsx)**
```javascript
// Tab "Search"
const handleSearchFriend = async () => {
  const users = await friendApi.searchUserByEmail(email)
  // Hiện danh sách user, check xem đã bạn hay chưa
}

// Click "Kết bạn"
const handleSendFriendRequest = async (userId) => {
  await friendApi.sendFriendRequest(userId)
  // Cập nhật button thành "Đã gửi"
}
```

#### **API**
```
POST /api/friendships/send
Body: { friendId: "userId456" }
```

#### **Backend**
```java
// FriendshipController.java
@PostMapping("/send")
public ResponseEntity<ApiResponse<FriendshipResponse>> sendFriendRequest(
    @Valid @RequestBody FriendshipRequest request,
    @AuthenticationPrincipal UserPrincipal userPrincipal) {
  FriendshipResponse response = friendshipService.sendFriendRequest(
      userPrincipal.getId(), 
      request
  );
  return ResponseEntity.status(HttpStatus.CREATED)
      .body(new ApiResponse<>(true, "Friend request sent", response));
}

// FriendshipService.java
public FriendshipResponse sendFriendRequest(String userId, FriendshipRequest request) {
  String friendId = request.getFriendId();
  
  // Check xem request đã tồn tại chưa
  Optional<Friendship> existing = friendshipRepository.findRequest(userId, friendId);
  if (existing.isPresent()) {
    throw new BadRequestException("Friend request already sent");
  }
  
  // Tạo friendship
  Friendship friendship = Friendship.builder()
      .userId(userId)  // Người gửi
      .friendId(friendId)  // Người nhận
      .status("PENDING")  // Chờ chấp nhận
      .build();
  
  Friendship saved = friendshipRepository.save(friendship);
  return FriendshipResponse.from(saved);
}

// MongoDB
// Collection: friendships
{
  "_id": ObjectId("..."),
  "userId": "userA",       // Người gửi request
  "friendId": "userB",     // Người nhận request
  "status": "PENDING",     // PENDING, ACCEPTED, REJECTED
  "createdAt": ISODate("...")
}
```

---

### **B. ACCEPT FRIEND REQUEST (Chấp nhận lời mời)**

#### **Frontend (FriendsModal.jsx - Tab "Lời mời")**
```javascript
// Click "Chấp nhận"
const handleAccept = async (friendshipId) => {
  await friendApi.acceptFriendRequest(friendshipId)
  // Cập nhật: xóa khỏi lời mời, thêm vào danh sách bạn
}
```

#### **API**
```
PUT /api/friendships/{friendshipId}/accept
```

#### **Backend**
```java
// FriendshipController.java
@PutMapping("/{friendshipId}/accept")
public ResponseEntity<ApiResponse<FriendshipResponse>> acceptFriendRequest(
    @PathVariable String friendshipId,
    @AuthenticationPrincipal UserPrincipal userPrincipal) {
  FriendshipResponse response = friendshipService.acceptFriendRequest(
      friendshipId, 
      userPrincipal.getId()
  );
  return ResponseEntity.ok(new ApiResponse<>(true, "Friend request accepted", response));
}

// FriendshipService.java
public FriendshipResponse acceptFriendRequest(String friendshipId, String userId) {
  Friendship friendship = friendshipRepository.findById(friendshipId)
      .orElseThrow(() -> new ResourceNotFoundException("Request not found"));
  
  // Check user là người nhận request
  if (!friendship.getFriendId().equals(userId)) {
    throw new BadRequestException("Unauthorized");
  }
  
  // Cập nhật status
  friendship.setStatus("ACCEPTED");
  Friendship saved = friendshipRepository.save(friendship);
  
  return FriendshipResponse.from(saved);
}
```

---

### **C. REJECT FRIEND REQUEST (Từ chối)**

```java
@PutMapping("/{friendshipId}/reject")
public ResponseEntity<ApiResponse<FriendshipResponse>> rejectFriendRequest(
    @PathVariable String friendshipId,
    @AuthenticationPrincipal UserPrincipal userPrincipal) {
  FriendshipResponse response = friendshipService.rejectFriendRequest(friendshipId, userPrincipal.getId());
  return ResponseEntity.ok(new ApiResponse<>(true, "Friend request rejected", response));
}
```

---

### **D. GET FRIENDS (Lấy danh sách bạn bè)**

#### **Frontend**
```javascript
// FriendsModal.jsx - Tab "Bạn bè"
useEffect(() => {
  const friends = await friendApi.getFriends()
  // friends = [{ id, userId, friendId, status: "ACCEPTED", friend: {...} }]
}, [])
```

#### **Backend**
```java
// FriendshipService.java
public List<FriendshipResponse> getFriends(String userId) {
  // Query: WHERE (userId = userId OR friendId = userId) AND status = "ACCEPTED"
  List<Friendship> friendships = friendshipRepository.findFriends(userId);
  
  return friendships.stream()
      .map(FriendshipResponse::from)
      .collect(Collectors.toList());
}
```

---

### **E. REMOVE FRIEND (Xóa bạn bè)**

```java
@DeleteMapping("/{friendshipId}")
public ResponseEntity<ApiResponse<Void>> removeFriend(
    @PathVariable String friendshipId,
    @AuthenticationPrincipal UserPrincipal userPrincipal) {
  friendshipService.removeFriend(friendshipId, userPrincipal.getId());
  return ResponseEntity.ok(new ApiResponse<>(true, "Friend removed", null));
}
```

---

## 6️⃣ TASK ASSIGNMENT (Giao việc)

### **FLOW: Giao việc cho bạn bè**

#### **Frontend (ChatWidget.jsx)**

**1. Click nút "+" trong chat**
```javascript
<IconButton onClick={(e) => setAnchorEl(e.currentTarget)}>
  <AddIcon />
</IconButton>

// Menu
<MenuItem onClick={() => setIsCardDialogOpen(true)}>
  <AssignmentIcon /> Giao việc
</MenuItem>
```

**2. Mở modal "Giao việc"**
```javascript
<EditCardModal
  open={isCardDialogOpen}
  mode="assign"
  receiverId={friend?.id}  // ← Người nhận
  onSave={loadConversation}
/>
```

**3. Điền thông tin task & click "Giao"**
```javascript
// EditCardModal.jsx
const handleSaveAssignment = async (cardData) => {
  const card = await cardApi.create(null, {
    title: cardData.title,
    description: cardData.description,
    receiverId: receiverId  // ← Người được giao việc
  })
  
  // Card được tạo + message gắn card được tạo
  // Chat tự động reload → hiện card trong chat
}
```

#### **API**
```
POST /api/cards
Body: {
  title: "Fix login bug",
  description: "...",
  receiverId: "userId456"  // ← Người nhận
}
```

#### **Backend**
```java
// CardService.java
public CardResponse createStandaloneCard(CardRequest request, String userId) {
  // 1. Tạo card standalone
  Card card = Card.builder()
      .title(request.getTitle())
      .description(request.getDescription())
      .receiverId(request.getReceiverId())  // ← Người được giao
      .createdBy(userId)  // ← Người giao
      .status("PENDING")  // Chờ chấp nhận
      .build();
  
  Card savedCard = cardRepository.save(card);
  
  // 2. Tạo message gắn card này
  Message message = Message.builder()
      .senderId(userId)  // Người giao
      .receiverId(request.getReceiverId())  // Người nhận
      .type("CARD")  // ← Type là CARD
      .card(savedCard)  // ← Gắn card object
      .isRead(false)
      .build();
  
  messageRepository.save(message);
  
  return CardResponse.from(savedCard);
}

// MongoDB
// Collection: messages (Type = CARD)
{
  "_id": ObjectId("..."),
  "senderId": "userA",
  "receiverId": "userB",
  "type": "CARD",
  "card": {
    "_id": ObjectId("..."),
    "title": "Fix login bug",
    "description": "...",
    "status": "PENDING",
    "createdBy": "userA",
    "receiverId": "userB"
  },
  "isRead": false,
  "createdAt": ISODate("...")
}
```

#### **Frontend Display (ChatWidget.jsx)**
```javascript
{messages.map(msg => (
  msg.type === 'CARD' 
    ? <CardItem card={msg.card} onDelete={handleCardDelete} />
    : <Paper>{msg.text}</Paper>
))}
```

---

## 7️⃣ TÍNH NĂNG KHÁC

### **A. STAR BOARD (Đánh dấu sao)**

```javascript
// BoardBar.jsx
const handleToggleStar = async () => {
  await boardApi.toggleStar(boardId)
  setIsStarred(!isStarred)
}

// Backend
PUT /api/boards/{boardId}/star
(Toggle isStarred field)
```

---

### **B. DRAG-DROP ORDER (Sắp xếp kéo thả)**

#### **Lists reorder**
```javascript
// ListColumns.jsx (DndKit)
const handleDragEnd = async (event) => {
  const { active, over } = event
  
  if (active.id !== over.id) {
    // Cập nhật listOrderIds
    const newOrder = listOrderIds.toSpliced(
      listOrderIds.indexOf(over.id),
      0,
      listOrderIds.splice(listOrderIds.indexOf(active.id), 1)[0]
    )
    
    await boardApi.updateListOrder(boardId, newOrder)
  }
}

// Backend
PUT /api/boards/{boardId}/list-order
Body: ["listId1", "listId2", "listId3", ...]
(Update listOrderIds)
```

#### **Cards reorder**
```javascript
// Tương tự, update cardOrderIds trong list
PUT /api/lists/{listId}/card-order
Body: ["cardId1", "cardId2", ...]
```

---

### **C. PREMIUM FEATURES (Tính năng cao cấp)**

```javascript
// BoardBar.jsx
const isPremium = user?.isPremium || false

// Disable nút nếu không premium
<Button 
  disabled={!isPremium}
  onClick={() => isPremium && handleOpenChat(friends)}
>
  {!isPremium && <LockIcon />}
  Open Chat
</Button>

// BottomNav.jsx
const isLocked = item.isPremium && !isPremium

// Features yêu cầu premium:
// - MyTask
// - Inbox
// - Chat
```

---

### **D. SCHEDULE VIEW (Xem lịch)**

```javascript
// MyTask.jsx hoặc Boards/BoardContent/ScheduleView
// Calendar view để quản lý tasks theo ngày
// Dùng react-big-calendar hoặc tương tự
```

---

### **E. IDEAS PAGE (Trang ý tưởng)**

```javascript
// Pages/navitems/IdeasPage.jsx
// CRUD ideas: create, read, update, delete
// Giống như cards nhưng không thuộc board
```

---

## 📊 ARCHITECTURE TÓMO TẮT

```
FRONTEND
├─ React + Material-UI
├─ Zustand (State management)
├─ React Router (Navigation)
├─ DndKit (Drag-drop)
├─ Axios (API calls)
└─ Features:
   ├─ Login/Register
   ├─ Board Management (CRUD)
   ├─ List Management (CRUD)
   ├─ Card Management (CRUD + Drag-drop)
   ├─ Friend System (Send/Accept/Reject)
   ├─ Chat Widget (Send messages + Assign tasks)
   ├─ Premium Features (Lock-gate)
   └─ Schedule View

BACKEND (Spring Boot)
├─ REST API
├─ MongoDB (NoSQL)
├─ JWT Authentication
├─ Business Logic (Service layer)
└─ Features:
   ├─ Auth (Login/Register/Refresh)
   ├─ Board CRUD
   ├─ List CRUD
   ├─ Card CRUD + Move
   ├─ Friendship (Request/Accept/Reject)
   ├─ Message (Send/Get/Mark read)
   ├─ Task Assignment (Create standalone cards)
   └─ isPremium flag
```

---

**Tạo: 2025-12-17**
**Dự án: ThucTap**
