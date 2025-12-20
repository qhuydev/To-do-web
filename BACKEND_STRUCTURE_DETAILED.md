# 📁 CẤU TRÚC BACKEND - FOLDER & FILE

## 📊 STRUCTURE TỔNG QUÁT

```
backend/
├── src/main/java/com/todoapp/
│   ├── controller/          🎮 Xử lý HTTP requests
│   ├── service/             ⚙️ Business logic
│   ├── repository/          💾 Tương tác Database (MongoDB)
│   ├── model/               🗂️ Entity/Document
│   ├── dto/                 📦 Data Transfer Object
│   │   ├── request/         📥 Request DTOs
│   │   └── response/        📤 Response DTOs
│   ├── security/            🔐 JWT & Authentication
│   ├── config/              ⚙️ Configuration
│   ├── exception/           ⚠️ Exception handling
│   └── TodoApplication.java 🚀 Entry point
│
├── pom.xml                  📋 Maven dependencies
└── target/                  📦 Build output
```

---

## 🎯 TỪN TỪ CỦA MỖI FOLDER

### 1️⃣ **CONTROLLER** (🎮 HTTP Request Handler)

**Tác dụng:** Nhận HTTP request từ frontend, validate, gọi service, trả response

**Files:**
- `AuthController.java` - Login, Register, Refresh token
- `UserController.java` - CRUD user profile
- `BoardController.java` - CRUD boards
- `TaskListController.java` - CRUD lists (cột)
- `CardController.java` - CRUD cards (thẻ)
- `FriendshipController.java` - Friend requests, accept, reject
- `MessageController.java` - Send, get messages
- `IdeaController.java` - CRUD ideas

**Ví dụ:**
```java
@RestController
@RequestMapping("/api/auth")
public class AuthController {
    @PostMapping("/login")
    public ResponseEntity<ApiResponse<AuthResponse>> login(
        @Valid @RequestBody LoginRequest request) {
        AuthResponse response = authService.login(request);
        return ResponseEntity.ok(ApiResponse.success("Login successful", response));
    }
}
```

---

### 2️⃣ **SERVICE** (⚙️ Business Logic)

**Tác dụng:** Xử lý logic nghiệp vụ, validate dữ liệu, gọi repository

**Files:**
- `AuthService.java` - Login, register, token refresh
- `UserService.java` - Update profile, get user info
- `BoardService.java` - Create, update, delete boards
- `TaskListService.java` - Manage lists
- `CardService.java` - Manage cards, move cards
- `FriendshipService.java` - Friend management
- `MessageService.java` - Message handling
- `IdeaService.java` - Idea management

**Ví dụ:**
```java
@Service
@RequiredArgsConstructor
public class AuthService {
    private final UserRepository userRepository;
    private final JwtTokenProvider jwtTokenProvider;
    private final PasswordEncoder passwordEncoder;
    
    public AuthResponse login(LoginRequest request) {
        // 1. Find user by email
        User user = userRepository.findByEmail(request.getEmail())
            .orElseThrow(() -> new BadRequestException("Invalid credentials"));
        
        // 2. Check password
        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new BadRequestException("Invalid credentials");
        }
        
        // 3. Generate tokens
        String accessToken = jwtTokenProvider.generateToken(user.getId());
        String refreshToken = jwtTokenProvider.generateRefreshToken(user.getId());
        
        // 4. Return response
        return AuthResponse.builder()
            .user(UserResponse.from(user))  // ← isPremium trong user
            .accessToken(accessToken)
            .refreshToken(refreshToken)
            .build();
    }
}
```

---

### 3️⃣ **REPOSITORY** (💾 Database Access)

**Tác dụng:** Tương tác trực tiếp với MongoDB (CRUD operations)

**Files:**
- `UserRepository.java` - Query users (findByEmail, etc.)
- `BoardRepository.java` - Query boards
- `TaskListRepository.java` - Query lists
- `CardRepository.java` - Query cards
- `FriendshipRepository.java` - Query friendships
- `MessageRepository.java` - Query messages
- `IdeaRepository.java` - Query ideas

**Ví dụ:**
```java
public interface UserRepository extends MongoRepository<User, String> {
    Optional<User> findByEmail(String email);
    // Spring Data MongoDB tự implement các method này
}
```

---

### 4️⃣ **MODEL** (🗂️ Entity/Document)

**Tác dụng:** Định nghĩa cấu trúc data trong MongoDB

**Files:**
- `User.java` - User document
  ```java
  @Document(collection = "users")
  public class User {
      @Id private String id;
      @Indexed(unique = true) private String email;
      private String password;
      private String displayName;
      private String avatar;
      @Builder.Default private Boolean isPremium = false;  ⭐
      @Builder.Default private Boolean isActive = true;
      @CreatedDate private LocalDateTime createdAt;
      @LastModifiedDate private LocalDateTime updatedAt;
  }
  ```

- `Board.java` - Board document
- `TaskList.java` - List document
- `Card.java` - Card document
- `Friendship.java` - Friendship document
- `Message.java` - Message document
- `Idea.java` - Idea document

---

### 5️⃣ **DTO** (📦 Data Transfer Object)

**Tác dụng:** Transfer data giữa layers (validate input, expose data an toàn)

#### **Request DTOs** (📥 Frontend gửi đến Backend)
- `LoginRequest.java` - { email, password }
- `RegisterRequest.java` - { email, password, displayName }
- `BoardRequest.java` - { title, background }
- `CardRequest.java` - { title, description }
- `MessageRequest.java` - { receiverId, content }
- `TaskListRequest.java` - { title }
- `IdeaRequest.java` - { title, description }
- `FriendshipRequest.java` - { friendId }
- `MoveCardRequest.java` - { targetListId, newIndex }

#### **Response DTOs** (📤 Backend gửi đến Frontend)
- `AuthResponse.java` - { user, accessToken, refreshToken }
  ```java
  public class AuthResponse {
      private UserResponse user;  // ← Chứa isPremium
      private String accessToken;
      private String refreshToken;
  }
  ```
- `UserResponse.java` - { id, email, displayName, avatar, **isPremium** } ⭐
- `ApiResponse.java` - Generic response wrapper
- `BoardResponse.java` - Board data
- `CardResponse.java` - Card data
- `MessageResponse.java` - Message data
- `ConversationResponse.java` - Conversation data

**Ví dụ:**
```java
public class UserResponse {
    private String id;
    private String email;
    private String displayName;
    private String avatar;
    private Boolean isPremium;  ⭐
    
    public static UserResponse from(User user) {
        return UserResponse.builder()
            .id(user.getId())
            .email(user.getEmail())
            .displayName(user.getDisplayName())
            .avatar(user.getAvatar())
            .isPremium(user.getIsPremium())  ⭐
            .build();
    }
}
```

---

### 6️⃣ **SECURITY** (🔐 Authentication & JWT)

**Tác dụng:** Xác thực user, tạo/validate JWT token

**Files:**
- `JwtTokenProvider.java` - Generate/validate JWT tokens
  ```java
  public class JwtTokenProvider {
      public String generateToken(String userId) {
          // Tạo accessToken (15 minutes)
      }
      
      public String generateRefreshToken(String userId) {
          // Tạo refreshToken (7 days)
      }
      
      public String getUserIdFromToken(String token) {
          // Extract userId từ token
      }
      
      public boolean validateToken(String token) {
          // Check token valid/expired
      }
  }
  ```

- `JwtAuthenticationFilter.java` - Intercept request, check JWT
  ```java
  public class JwtAuthenticationFilter extends OncePerRequestFilter {
      @Override
      protected void doFilterInternal(HttpServletRequest request, 
                                     HttpServletResponse response,
                                     FilterChain filterChain) {
          // 1. Extract token từ header
          // 2. Validate token
          // 3. Load user từ database
          // 4. Set authentication context
          // 5. Pass request tiếp
      }
  }
  ```

- `UserPrincipal.java` - Security principal (user details)
- `CustomUserDetailsService.java` - Load user từ database

---

### 7️⃣ **CONFIG** (⚙️ Configuration)

**Tác dụng:** Cấu hình ứng dụng (CORS, MongoDB, Security)

**Files:**
- `SecurityConfig.java` - Spring Security configuration
  ```java
  @Configuration
  public class SecurityConfig {
      @Bean
      public SecurityFilterChain filterChain(HttpSecurity http) {
          // Disable CSRF
          // Add JWT filter
          // Authorize requests
          // Configure exception handling
      }
  }
  ```

- `MongoConfig.java` - MongoDB connection
- `CorsConfig.java` - CORS (Cross-Origin Resource Sharing)

---

### 8️⃣ **EXCEPTION** (⚠️ Error Handling)

**Tác dụng:** Handle lỗi toàn ứng dụng

**Files:**
- `BadRequestException.java` - 400 Bad Request
- `ResourceNotFoundException.java` - 404 Not Found
- `GlobalExceptionHandler.java` - Catch & handle tất cả exception
  ```java
  @RestControllerAdvice
  public class GlobalExceptionHandler {
      @ExceptionHandler(BadRequestException.class)
      public ResponseEntity<?> handleBadRequest(BadRequestException e) {
          return ResponseEntity.status(400).body(ApiResponse.error(e.getMessage()));
      }
  }
  ```

---

## 🔗 CÁCH CÁC FOLDER KẾT NỐI VỚI NHAU

```
┌─────────────────────────────────────────────────────────────────┐
│                           FRONTEND                              │
│                    (Gửi HTTP request)                           │
└──────────────────────┬──────────────────────────────────────────┘
                       │ HTTP Request
                       ↓
        ┌──────────────────────────────┐
        │      CONTROLLER 🎮           │  ← Nhận request
        │   (AuthController, etc.)     │
        └──────────────┬───────────────┘
                       │ Gọi service
                       ↓
        ┌──────────────────────────────┐
        │       SERVICE ⚙️             │  ← Business logic
        │   (AuthService, etc.)        │
        └──────────────┬───────────────┘
                       │ Gọi repository
                       ↓
        ┌──────────────────────────────┐
        │     REPOSITORY 💾            │  ← Database query
        │   (UserRepository, etc.)     │
        └──────────────┬───────────────┘
                       │ Query MongoDB
                       ↓
        ┌──────────────────────────────┐
        │      MONGODB 📊              │  ← Database
        │   (User, Board, Card, etc.)  │
        └──────────────┬───────────────┘
                       │ Return data
                       ↓
        ┌──────────────────────────────┐
        │       RESPONSE DTO 📤        │  ← Convert data
        │   (UserResponse, etc.)       │
        └──────────────┬───────────────┘
                       │ Convert to JSON
                       ↓
        ┌──────────────────────────────┐
        │     API RESPONSE 📦          │  ← Wrap response
        │   (ApiResponse<T>)           │
        └──────────────┬───────────────┘
                       │ HTTP Response
                       ↓
┌─────────────────────────────────────────────────────────────────┐
│                           FRONTEND                              │
│                    (Nhận HTTP response)                         │
└─────────────────────────────────────────────────────────────────┘
```

---

## 📋 FLOW CHI TIẾT: LOGIN

```
1. Frontend
   └─ POST /api/auth/login
      { email: "user@mail.com", password: "123456" }

2. AuthController
   ├─ @PostMapping("/login")
   ├─ @Valid LoginRequest request
   └─ authService.login(request)

3. AuthService
   ├─ userRepository.findByEmail(email)  ← Query MongoDB
   ├─ passwordEncoder.matches(...)       ← Verify password
   ├─ jwtTokenProvider.generateToken()   ← Generate tokens
   └─ UserResponse.from(user)            ← Convert User → UserResponse
                                           (include isPremium) ⭐

4. JwtTokenProvider
   ├─ Create accessToken (15 min)
   └─ Create refreshToken (7 days)

5. Response
   {
     user: {
       id: "...",
       email: "...",
       isPremium: false ⭐
     },
     accessToken: "eyJhbGc...",
     refreshToken: "eyJhbGc..."
   }

6. Frontend
   ├─ Save tokens to localStorage
   ├─ Save user to Zustand store
   └─ Add Authorization header to future requests
```

---

## 🔐 FLOW: PROTECTED REQUEST (Với JWT)

```
1. Frontend
   ├─ GET /api/boards
   ├─ Header: Authorization: Bearer eyJhbGc...
   └─ (Token từ localStorage)

2. JwtAuthenticationFilter
   ├─ Extract token từ header
   ├─ jwtTokenProvider.validateToken(token)
   ├─ Extract userId từ token
   ├─ userDetailsService.loadUserByUsername(userId)
   └─ Set SecurityContext

3. BoardController
   ├─ Được phép access
   ├─ userService.getCurrentUser()  ← Lấy user từ SecurityContext
   └─ boardService.getBoardsByUser()

4. BoardService & Repository
   ├─ Query MongoDB cho user's boards
   └─ Return boards

5. Response
   {
     boards: [...]
   }
```

---

## 🏗️ ARCHITECTURE LAYER

```
┌────────────────────────────────────────┐
│        PRESENTATION LAYER              │
│   (Controller + Request/Response DTOs) │
└────────────────────┬───────────────────┘
                     │ Converts DTO ↔ Entity
                     ↓
┌────────────────────────────────────────┐
│        BUSINESS LOGIC LAYER            │
│          (Service Classes)             │
│   - AuthService                        │
│   - BoardService                       │
│   - CardService                        │
│   - etc.                               │
└────────────────────┬───────────────────┘
                     │ Uses Repository
                     ↓
┌────────────────────────────────────────┐
│        DATA ACCESS LAYER               │
│   (Repository + MongoDB Queries)       │
│   - UserRepository                     │
│   - BoardRepository                    │
│   - CardRepository                     │
│   - etc.                               │
└────────────────────┬───────────────────┘
                     │ Query/Save
                     ↓
┌────────────────────────────────────────┐
│        PERSISTENCE LAYER               │
│   (MongoDB Documents/Collections)      │
│   - users                              │
│   - boards                             │
│   - cards                              │
│   - etc.                               │
└────────────────────────────────────────┘
```

---

## 📌 DEPENDENCIES GIỮA CÁC CLASS

```
Controller
    ↓
  Service ← AuthService, BoardService, etc.
    ↓
Repository ← UserRepository, BoardRepository, etc.
    ↓
Model ← User, Board, Card, etc.

Security
    ├─ JwtAuthenticationFilter
    ├─ JwtTokenProvider
    ├─ UserPrincipal
    └─ CustomUserDetailsService

Config
    ├─ SecurityConfig (Thêm JwtAuthenticationFilter)
    ├─ MongoConfig
    └─ CorsConfig

Exception
    └─ GlobalExceptionHandler (Catch lỗi từ toàn app)

DTO
    ├─ Request: LoginRequest, BoardRequest, etc.
    └─ Response: AuthResponse, UserResponse, etc.
```

---

## ✅ CHECKLIST KẾT NỐI

| Từ | Đến | Cách |
|----|----|------|
| Controller | Service | `@Autowired` hoặc constructor injection |
| Service | Repository | `@Autowired` hoặc constructor injection |
| Service | Model | Tạo/map entity |
| DTO | Model | `from()`, `toEntity()` methods |
| Security | Service | JwtAuthenticationFilter gọi UserDetailsService |
| Config | Security | SecurityFilterChain add JwtAuthenticationFilter |
| Exception | Controller | GlobalExceptionHandler catch exception |
| Frontend | Controller | HTTP request/response |

---

## 🎯 FLOW TỔNG QUÁT TẤT CẢ OPERATIONS

```
Frontend Request
    ↓
CORS Check (CorsConfig)
    ↓
Authentication Check (JwtAuthenticationFilter)
    ├─ Valid token → Continue
    └─ Invalid token → 401 Unauthorized

Controller (Request Validation)
    ↓
Service (Business Logic)
    ├─ Validation lại
    ├─ Process logic
    └─ Call Repository

Repository (Database Query)
    ↓
MongoDB (CRUD)
    ↓
Service (Convert to DTO)
    ├─ Model → Response DTO
    ├─ Add isPremium to UserResponse ⭐
    └─ Wrap in ApiResponse

Controller (Return Response)
    ↓
Exception Handler (Nếu có lỗi)
    ├─ BadRequestException
    ├─ ResourceNotFoundException
    └─ Other exceptions

Frontend Response
    ├─ Success: data + status
    └─ Error: error message + status
```

---

**Tạo: 2025-12-17**
**Dự án: ThucTap (ToDo + Board Management)**
