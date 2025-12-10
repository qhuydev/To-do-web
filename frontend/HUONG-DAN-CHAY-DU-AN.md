# Hướng Dẫn Chạy Dự Án ToDoList

## Giới Thiệu

ToDoList là ứng dụng quản lý công việc theo phong cách Kanban, tương tự Trello. Dự án bao gồm:

- **Frontend**: React 19 + Vite + Material UI
- **Backend**: Java Spring Boot + MongoDB
- **Authentication**: JWT (JSON Web Token)

---

## Yêu Cầu Hệ Thống

### Phần mềm cần cài đặt:

| Phần mềm | Phiên bản | Link tải |
|----------|-----------|----------|
| Node.js | >= 18.x | https://nodejs.org/ |
| Java JDK | 17 | https://www.oracle.com/java/technologies/downloads/#java17 |
| Maven | >= 3.9 | https://maven.apache.org/download.cgi |
| MongoDB | Atlas hoặc Local | https://www.mongodb.com/atlas |

### Kiểm tra cài đặt:

```bash
# Kiểm tra Node.js
node -v

# Kiểm tra npm
npm -v

# Kiểm tra Java
java -version

# Kiểm tra Maven
mvn -version
```

---

## Cấu Trúc Dự Án

```
To-do-web-main/
├── backend/                    # Spring Boot Backend
│   ├── src/
│   │   └── main/
│   │       ├── java/com/todoapp/
│   │       │   ├── config/     # Security, CORS config
│   │       │   ├── controller/ # REST API endpoints
│   │       │   ├── dto/        # Data Transfer Objects
│   │       │   ├── model/      # MongoDB entities
│   │       │   ├── repository/ # MongoDB repositories
│   │       │   ├── security/   # JWT authentication
│   │       │   └── service/    # Business logic
│   │       └── resources/
│   │           └── application.yml
│   └── pom.xml
│
├── src/                        # React Frontend
│   ├── api/                    # API clients (axios)
│   ├── components/             # Reusable components
│   ├── pages/                  # Page components
│   ├── stores/                 # Zustand state management
│   └── theme.js                # MUI theme config
│
├── package.json
└── vite.config.js
```

---

## Hướng Dẫn Cài Đặt

### Bước 1: Clone dự án

```bash
git clone <repository-url>
cd To-do-web-main
```

### Bước 2: Cấu hình Backend

#### 2.1. Cấu hình MongoDB

Mở file `backend/src/main/resources/application.yml` và cập nhật connection string:

```yaml
spring:
  data:
    mongodb:
      uri: mongodb+srv://<username>:<password>@<cluster>.mongodb.net/<database>
      database: todoapp
```

**Lưu ý**: Thay thế `<username>`, `<password>`, `<cluster>`, `<database>` bằng thông tin MongoDB của bạn.

#### 2.2. Cấu hình JWT Secret

Trong file `application.yml`, đảm bảo có JWT secret (base64 encoded, ít nhất 32 ký tự):

```yaml
jwt:
  secret: <your-base64-encoded-secret>
  expiration: 86400000        # 24 giờ
  refresh-expiration: 604800000  # 7 ngày
```

**Tạo secret key**:
```bash
# Linux/Mac
echo -n "your-secret-key-at-least-32-characters" | base64

# Windows PowerShell
[Convert]::ToBase64String([Text.Encoding]::UTF8.GetBytes("your-secret-key-at-least-32-characters"))
```

### Bước 3: Cài đặt Dependencies

#### Frontend:
```bash
# Từ thư mục gốc
npm install
```

#### Backend:
```bash
# Từ thư mục backend
cd backend
mvn clean install -DskipTests
```

---

## Chạy Dự Án

### Cách 1: Chạy riêng từng phần

#### Terminal 1 - Backend:
```bash
cd backend
mvn spring-boot:run
```
Backend sẽ chạy tại: `http://localhost:8017`

#### Terminal 2 - Frontend:
```bash
# Từ thư mục gốc
npm run dev
```
Frontend sẽ chạy tại: `http://localhost:5173`

### Cách 2: Sử dụng script (Windows)

Tạo file `start.bat`:
```batch
@echo off
start cmd /k "cd backend && mvn spring-boot:run"
timeout /t 10
start cmd /k "npm run dev"
```

---

## Sử Dụng Ứng Dụng

### 1. Đăng ký tài khoản

1. Mở trình duyệt: `http://localhost:5173`
2. Click "Don't have an account? Register"
3. Điền thông tin:
   - Display Name: Tên hiển thị
   - Email: Email của bạn
   - Password: Mật khẩu (ít nhất 6 ký tự)
4. Click "Register"

### 2. Đăng nhập

1. Nhập Email và Password
2. Click "Sign In"

### 3. Tạo Board mới

1. Tại trang chủ, click "Create new board"
2. Nhập tên board
3. Chọn màu nền
4. Click "Create"

### 4. Quản lý Lists và Cards

- **Thêm List**: Click "Add another list" ở cuối board
- **Thêm Card**: Click "Add a card" trong list
- **Kéo thả Card**: Giữ và kéo card đến vị trí mới
- **Kéo thả List**: Giữ icon drag và kéo list đến vị trí mới
- **Xóa List/Card**: Click menu (...) và chọn Delete

---

## API Endpoints

### Authentication

| Method | Endpoint | Mô tả |
|--------|----------|-------|
| POST | `/api/auth/register` | Đăng ký |
| POST | `/api/auth/login` | Đăng nhập |
| POST | `/api/auth/refresh` | Refresh token |

### Boards

| Method | Endpoint | Mô tả |
|--------|----------|-------|
| GET | `/api/boards` | Lấy tất cả boards |
| GET | `/api/boards/{id}` | Lấy board theo ID |
| POST | `/api/boards` | Tạo board mới |
| PUT | `/api/boards/{id}` | Cập nhật board |
| DELETE | `/api/boards/{id}` | Xóa board |

### Lists

| Method | Endpoint | Mô tả |
|--------|----------|-------|
| POST | `/api/lists` | Tạo list mới |
| PUT | `/api/lists/{id}` | Cập nhật list |
| DELETE | `/api/lists/{id}` | Xóa list |

### Cards

| Method | Endpoint | Mô tả |
|--------|----------|-------|
| POST | `/api/cards` | Tạo card mới |
| PUT | `/api/cards/{id}` | Cập nhật card |
| DELETE | `/api/cards/{id}` | Xóa card |
| PUT | `/api/cards/{id}/move` | Di chuyển card |

---

## Xử Lý Lỗi Thường Gặp

### 1. Port đã được sử dụng

**Lỗi**: `Port 8017 is already in use`

**Giải pháp**:
```bash
# Windows - Tìm process đang dùng port
netstat -ano | findstr :8017

# Kill process
taskkill /PID <PID> /F
```

### 2. MongoDB connection failed

**Lỗi**: `MongoTimeoutException`

**Giải pháp**:
- Kiểm tra connection string trong `application.yml`
- Đảm bảo IP của bạn được whitelist trong MongoDB Atlas
- Kiểm tra username/password

### 3. CORS Error

**Lỗi**: `Access-Control-Allow-Origin`

**Giải pháp**: Đảm bảo `SecurityConfig.java` có cấu hình CORS cho `http://localhost:5173`

### 4. JWT Token Invalid

**Lỗi**: `401 Unauthorized`

**Giải pháp**:
- Xóa localStorage trong browser
- Đăng nhập lại
- Kiểm tra JWT secret trong `application.yml`

---

## Build Production

### Frontend:
```bash
npm run build
```
Output: thư mục `dist/`

### Backend:
```bash
cd backend
mvn clean package -DskipTests
```
Output: `backend/target/todoapp-0.0.1-SNAPSHOT.jar`

### Chạy JAR file:
```bash
java -jar backend/target/todoapp-0.0.1-SNAPSHOT.jar
```

---

## Công Nghệ Sử Dụng

### Frontend
- **React 19** - UI Library
- **Vite** - Build tool
- **Material UI** - Component library
- **Zustand** - State management
- **Axios** - HTTP client
- **@dnd-kit** - Drag and drop
- **React Router** - Routing

### Backend
- **Spring Boot 3.2** - Framework
- **Spring Security** - Authentication
- **Spring Data MongoDB** - Database
- **JWT** - Token authentication
- **Lombok** - Code generation

---

## Liên Hệ & Hỗ Trợ

Nếu gặp vấn đề, vui lòng:
1. Kiểm tra phần "Xử Lý Lỗi Thường Gặp"
2. Tạo issue trên GitHub repository
3. Liên hệ team phát triển

---

**Happy Coding! 🚀**
