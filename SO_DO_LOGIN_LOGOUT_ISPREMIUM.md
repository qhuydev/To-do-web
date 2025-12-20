# 📊 SƠ ĐỒ HOẠT ĐỘNG LOGIN, LOGOUT & isPREMIUM

## 🔐 1. FLOW LOGIN

```
┌─────────────────────────────────────────────────────────────────┐
│                        FRONTEND                                 │
├─────────────────────────────────────────────────────────────────┤
│
│  Login.jsx
│  ├─ Input: email, password
│  ├─ Validate form
│  └─ handleSubmit()
│       │
│       ↓
│  useAuthStore (authStore.js)
│  └─ login(credentials)
│       │
│       ↓
│  authApi.js
│  └─ authApi.login(data)
│  │   POST /auth/login
│  │
│  ├──────────────────────────────────────────────────────┐
│                                                          │
│                                                          ↓
├─────────────────────────────────────────────────────────────────┤
│                        BACKEND                                  │
├─────────────────────────────────────────────────────────────────┤
│
│  AuthController.java
│  └─ @PostMapping("/login")
│       │
│       ↓
│  AuthService.login(LoginRequest)
│  ├─ Find user by email
│  ├─ Check password (encode)
│  ├─ Generate JWT tokens:
│  │   ├─ accessToken (15 min)
│  │   └─ refreshToken (7 days)
│  └─ Return AuthResponse { user, accessToken, refreshToken }
│       │
│       ↓
│  User.java (MongoDB)
│  ├─ id
│  ├─ email
│  ├─ password (encoded)
│  ├─ displayName
│  ├─ avatar
│  └─ isPremium (true/false) ⭐
│       │
│  Response:
│  {
│    user: {
│      id: "...",
│      email: "...",
│      displayName: "...",
│      isPremium: false ⭐
│    },
│    accessToken: "eyJhbG...",
│    refreshToken: "eyJhbG..."
│  }
│
│                                                          ↓
│  ┌──────────────────────────────────────────────────────┘
│  │
│  ↓
├─────────────────────────────────────────────────────────────────┤
│                        FRONTEND                                 │
├─────────────────────────────────────────────────────────────────┤
│
│  authStore.js - setAuth()
│  ├─ localStorage.setItem('accessToken', token)
│  ├─ localStorage.setItem('refreshToken', token)
│  └─ set({ user, accessToken, refreshToken, isAuthenticated: true })
│       │
│       ↓
│  axiosClient.js (interceptor)
│  └─ Tất cả request sau này sẽ có:
│     Authorization: Bearer eyJhbG...
│       │
│       ↓
│  navigate('/') ✅ Vào trang chủ
│
└─────────────────────────────────────────────────────────────────┘
```

---

## 🚪 2. FLOW LOGOUT

```
┌─────────────────────────────────────────────────────────────────┐
│                        FRONTEND                                 │
├─────────────────────────────────────────────────────────────────┤
│
│  Profiles.jsx (AppBar Menu)
│  └─ Click "Logout" button
│       │
│       ↓
│  handleLogout()
│  └─ useAuthStore.logout()
│       │
│       ↓
│  authStore.js
│  └─ logout()
│       ├─ localStorage.removeItem('accessToken')
│       ├─ localStorage.removeItem('refreshToken')
│       └─ set({ user: null, isAuthenticated: false })
│            │
│            ↓
│  axiosClient.js (interceptor)
│  └─ ❌ Xóa Authorization header
│       │
│       ↓
│  navigate('/login') ✅ Về trang login
│
│  ⚠️ KHÔNG CẦN GỌI BACKEND
│     (Logout ở frontend là đủ, backend không cần biết)
│
└─────────────────────────────────────────────────────────────────┘
```

**Lưu ý:** Logout không gọi backend vì JWT token không có state (stateless authentication). Backend không cần biết.

---

## ⭐ 3. FLOW isPREMIUM

```
┌─────────────────────────────────────────────────────────────────┐
│                        BACKEND                                  │
├─────────────────────────────────────────────────────────────────┤
│
│  User.java (MongoDB Model)
│  ├─ @Id id
│  ├─ email
│  ├─ password
│  ├─ displayName
│  └─ @Builder.Default
│     private Boolean isPremium = false ⭐
│
│  (Khi tạo user mới, isPremium = false)
│
│                                    ↓
│  UserResponse.java (DTO)
│  ├─ id
│  ├─ email
│  ├─ displayName
│  └─ isPremium ← Map từ User.isPremium ⭐
│
│                                    ↓
│  AuthResponse.java
│  └─ user: UserResponse ⭐
│     (Trả về isPremium khi login)
│
│                                    ↓
│  AuthController.login()
│  └─ Return AuthResponse { user { isPremium }, ... }
│
└─────────────────────────────────────────────────────────────────┘
                            ↓
                  [Response từ Backend]
                   { isPremium: false }
                            ↓
┌─────────────────────────────────────────────────────────────────┐
│                        FRONTEND                                 │
├─────────────────────────────────────────────────────────────────┤
│
│  authStore.js - setAuth()
│  ├─ set({ user: data.user, ... })
│  │           └─ user.isPremium ⭐
│  └─ Lưu vào Zustand store
│
│                    ↓
│  BoardBar.jsx (Dùng isPremium)
│  ├─ const isPremium = user?.isPremium || false
│  └─ <Button disabled={!isPremium}>
│        {!isPremium && <LockIcon />}
│     </Button>
│
│                    ↓
│  BottomNav.jsx (Check tính năng premium)
│  ├─ const isLocked = item.isPremium && !isPremium
│  └─ Disable button nếu:
│     - item.isPremium === true (tính năng cần premium)
│     - user.isPremium === false (user không premium)
│
│                    ↓
│  MyTask.jsx, Inbox.jsx (Premium features)
│  └─ Chỉ hiển thị nếu isPremium === true
│
└─────────────────────────────────────────────────────────────────┘
```

---

## 📁 TÓMO TRỊ FILE LIÊN QUAN

### **Backend**

| File | Chức năng | isPremium |
|------|----------|----------|
| `AuthController.java` | API endpoints: /login, /register, /refresh | ✓ |
| `AuthService.java` | Business logic: generate JWT, verify password | ✓ |
| `User.java` | Model MongoDB: lưu user data + isPremium | ✓⭐ |
| `UserResponse.java` | DTO trả về isPremium | ✓⭐ |
| `AuthResponse.java` | Response object: user + tokens | ✓ |
| `LoginRequest.java` | DTO request: email, password | ✗ |
| `JwtTokenProvider.java` | Generate/validate JWT tokens | ✓ |

### **Frontend**

| File | Chức năng | isPremium |
|------|----------|----------|
| `Login.jsx` | Giao diện login | ✓ |
| `Register.jsx` | Giao diện register | ✓ |
| `authStore.js` | Zustand store: login(), logout(), setAuth() | ✓⭐ |
| `authApi.js` | API calls: login(), register(), refresh() | ✓ |
| `axiosClient.js` | Axios instance + interceptors + auto refresh | ✓ |
| `Profiles.jsx` | Menu logout | ✓ |
| `BoardBar.jsx` | Disable nút nếu !isPremium | ✓⭐ |
| `BottomNav.jsx` | Disable tính năng premium | ✓⭐ |
| `MyTask.jsx` | Tính năng premium | ✓⭐ |
| `Inbox.jsx` | Tính năng premium | ✓⭐ |

---

## 🔄 GỌI API SEQUENCE DIAGRAM

### **1. LOGIN**
```
User                Login.jsx          authStore          authApi          Backend
  │                    │                   │                  │              │
  ├─ Input email/pwd──▶│                   │                  │              │
  │                    ├─ validate────────▶│                  │              │
  │                    ├─ login()──────────▶│                  │              │
  │                    │                   ├─ login()────────▶│              │
  │                    │                   │                  ├─ verify─────▶│
  │                    │                   │                  │◀─ response ──┤
  │                    │◀─ response────────┤◀─ response ──────┤              │
  │                    ├─ setAuth()────────▶│                  │              │
  │                    │  (save localStorage)                 │              │
  │◀─ Redirect /────────┤                   │                  │              │
```

### **2. LOGOUT**
```
User           Profiles.jsx       authStore         localStorage
  │                  │                │                  │
  ├─ Click Logout───▶│                │                  │
  │                  ├─ logout()──────▶│                  │
  │                  │                 ├─ remove token───▶│
  │                  │                 ├─ set({user:null})│
  │◀─ Redirect /login─┤                 │                  │
```

### **3. CHECK isPREMIUM**
```
User           Component          authStore        Backend
  │                │                   │             (login time)
  │                │                   │             
  │─ Login────────▶│                   │
  │                │─ login()──────────▶│──────────▶ Backend
  │                │                   │◀─ { user: { isPremium: false }}
  │                │                   │
  │                ├─ isPremium ──────▶│ ← Lấy từ user state
  │                ├─ Disable button
  │                ├─ Hide feature
  │                ├─ Show Lock icon
  │                │
  │◀─ UI thay đổi ──┤
```

---

## 💾 DATA FLOW

### **Login Response từ Backend**
```json
{
  "status": "success",
  "message": "Login successful",
  "data": {
    "user": {
      "id": "507f1f77bcf86cd799439011",
      "email": "user@example.com",
      "displayName": "John Doe",
      "avatar": "https://...",
      "isPremium": false
    },
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

### **Lưu trong authStore (Zustand)**
```javascript
{
  user: {
    id: "...",
    email: "...",
    displayName: "...",
    avatar: "...",
    isPremium: false  ⭐
  },
  accessToken: "eyJhbGc...",
  refreshToken: "eyJhbGc...",
  isAuthenticated: true,
  isLoading: false,
  error: null
}
```

### **Dùng isPremium ở Frontend**
```javascript
// 1. Lấy giá trị
const { user } = useAuthStore()
const isPremium = user?.isPremium || false

// 2. Kiểm tra & render
{isPremium ? <PremiumFeature /> : <LockedFeature />}

// 3. Disable button
<Button disabled={!isPremium}>
  {!isPremium && <LockIcon />}
</Button>
```

---

## 🔑 CÁC KEY POINTS

| Điểm | Chi tiết |
|------|---------|
| **Login** | Frontend gửi email/password → Backend xác thực → Trả về user + tokens |
| **Logout** | Frontend xóa localStorage + state → Không gọi backend |
| **Token** | accessToken (15 min) + refreshToken (7 days) → Auto refresh |
| **isPremium** | Backend trả về khi login → Frontend lưu trong store → Dùng để disable/enable features |
| **Authorization** | axiosClient tự động thêm Bearer token vào header |
| **404 Login** | Không có logout API, logout chỉ là xóa local data |

---

## 🎯 FLOW TỔNG QUÁT

```
┌─── LOGIN ───┐
│             │
User Input    │
  │           │
  ↓           │
Validate      │
  │           │
  ↓           │
Frontend API  │
  │           │
  ↓           │
Backend Auth  │
  │           │
  ↓           │
Generate JWT  │
+ isPremium   │
  │           │
  ↓           │
Response ────▶│
              │
         ┌────┴─────┐
         │           │
         ↓           ↓
   Save Token   Save User
   (localStorage) (Zustand)
         │           │
         └────┬──────┘
              │
              ↓
         Feature Control
         ├─ Disable buttons
         ├─ Hide premium pages
         └─ Show lock icons
              │
              ↓
         ┌─── LOGOUT ───┐
         │              │
         │ Remove Token │
         │ Remove User  │
         │              │
         └──▶ /login
```

---

**Tạo: 2025-12-17**
**Dự án: ThucTap (ToDo + Board Management)**
