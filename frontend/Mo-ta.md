🚀 TẤT TẦN TẬT VỀ TRANG WEB TRONG FILE

(Ứng dụng: Xây dựng ứng dụng Web To-Do List)


N16_ThucTap_K1-2526

1️⃣ Mục đích của trang web

Trang web này là một nền tảng quản lý công việc cá nhân và nhóm, hỗ trợ:

Ghi chú – sắp xếp – theo dõi tiến độ công việc

Kéo thả thẻ (cards) để tổ chức workflow

Tạo bảng công việc như Trello

Chia sẻ bảng cho thành viên khác

Đồng bộ lịch làm việc với Google Calendar

Quản lý thẻ, danh sách, bảng cực chi tiết

Mọi thứ đều được triển khai theo chuẩn một hệ thống web hoàn chỉnh: frontend – backend – database.

2️⃣ Công nghệ sử dụng

N16_ThucTap_K1-2526

Frontend: ReactJS + Material UI

Backend: Java

Database: MySQL / MongoDB

Prototype UI: Figma

Tích hợp: Google Calendar API

3️⃣ Các nhóm người dùng (Actor)

(Trang 9) 

N16_ThucTap_K1-2526

Actor	Vai trò
User	Dùng hệ thống và toàn bộ chức năng chính
Member (thành viên)	Được mời vào bảng và có quyền thao tác
Viewer (quan sát viên)	Chỉ xem, không thao tác
Admin	Quản trị hệ thống, dữ liệu, người dùng
4️⃣ Hệ thống có những chức năng gì? (FULL)
4.1. Chức năng chính (functional)

(Trang 7–8) 

N16_ThucTap_K1-2526

🔐 1. Đăng ký – Đăng nhập – Quên mật khẩu

Email + mật khẩu

Xác thực email

Khóa tạm nếu sai nhiều lần

👤 2. Quản lý hồ sơ

Đổi tên

Đổi avatar

🏢 3. Workspace (không gian làm việc)

Mỗi user có 1 workspace

Đổi tên

Tạo bảng trong workspace

Chia sẻ workspace

🧩 4. Board (bảng công việc)

Tạo / đổi tên / xóa

Đổi background

Đánh dấu sao

Chia sẻ bảng qua email hoặc link

Xem mục lưu trữ

📚 5. List (danh sách)

Thêm / xóa / chỉnh sửa

Di chuyển (drag & drop)

Thu gọn – mở rộng

Lưu trữ toàn bộ cards trong list

🗂️ 6. Card (thẻ công việc)

Thêm / xóa / sửa

Mô tả

Deadline

Assign người thực hiện

Checklist

Nhãn màu

Bình luận

Kéo thả giữa các list

🎠 7. Drag & Drop nâng cao

Kéo trong danh sách

Kéo giữa các danh sách

Kéo từ Inbox ra List

Trả về vị trí cũ nếu không hợp lệ

💬 8. Bình luận & thảo luận

Thêm – sửa – xóa bình luận

Thả icon

Trả lời bình luận

👥 9. Mời thành viên

Mời qua email

Tham gia qua link

Phân quyền Member / Viewer

🗓️ 10. Đồng bộ lịch (Google Calendar)

Lập thời gian tập trung (focus time)

Kéo thẻ vào lịch để tạo sự kiện

Thay đổi giờ bắt đầu – kết thúc

Không ảnh hưởng đến thành viên khác

Đồng bộ với Google Calendar

👑 11. Admin

Quản lý người dùng

Khóa / mở khóa

Xóa tài khoản

Giám sát hệ thống

Dọn rác, backup data

5️⃣ Yêu cầu phi chức năng

(Trang 7–8) 

N16_ThucTap_K1-2526

UI dễ dùng, mượt, nhất quán

Bảo mật: mã hóa dữ liệu, auto logout

Hiệu năng: mỗi thao tác < 5s

Tin cậy: sao lưu dữ liệu định kỳ

Mở rộng: thêm tính năng, tăng số lượng danh sách/thẻ

6️⃣ Sơ đồ hệ thống (Use Case, Functional Decomposition, Activity Diagram)

PDF chứa rất nhiều sơ đồ:

Sơ đồ phân rã chức năng (page 8)

Use Case tổng quát (page 11)

Use Case chi tiết cho 11 chức năng (page 15–26)

Activity Diagram cho Đăng ký, Đăng nhập, Quản lý hồ sơ, Workspace, Board, List (page 27–32)

ERD + DB Design (Chương 3, page 33)

→ Tài liệu này chính xác là đồ án phân tích & thiết kế hệ thống hoàn chỉnh.

7️⃣ Thiết kế Database

(chương 3 – page 33) 

N16_ThucTap_K1-2526

Dù trang cuối không hiện rõ chi tiết bảng, nhưng theo nội dung chức năng có thể khẳng định hệ thống có các bảng:

users

workspaces

boards

lists

cards

comments

labels

checklists

calendar_events

board_members

attachments (nếu có)

audit_logs (cho Admin)

8️⃣ Luồng hoạt động (workflow)
Hệ thống hoạt động theo các bước chuẩn Trello-like:

Ví dụ:

1. Đăng ký → xác thực email → đăng nhập

→ vào workspace

2. Trong workspace → tạo board

→ tạo list
→ thêm card
→ kéo thả card
→ giao việc
→ đặt deadline
→ bình luận
→ lưu trữ / khôi phục

3. Mời thành viên

→ Phân quyền Member / Viewer
→ Tương tác group

4. Mở lịch → tạo sự kiện → đồng bộ Google Calendar

→ kéo card vào lịch

9️⃣ Trang web này phù hợp cho ai?

(Trang 5) 

N16_ThucTap_K1-2526

Sinh viên quản lý bài tập / thời khóa biểu

Nhân viên văn phòng theo dõi công việc

Cá nhân muốn tăng hiệu suất

Nhóm nhỏ muốn chia sẻ bảng chung

🔟 Kết luận — Web này thực chất là gì?

➡️ Đây là một ứng dụng quản lý công việc dạng Kanban, gần giống Trello, có đầy đủ:

Board – List – Card

Drag & Drop

Quản lý người dùng

Lịch tích hợp

Chia sẻ & phân quyền

Bình luận

Database hoàn chỉnh

Backend Java + Frontend ReactJS

Nó được xây dựng với mục đích:

👉 Làm đồ án thực tập + học cách xây dựng 1 hệ thống web hoàn chỉnh từ phân tích — thiết kế — triển khai.


ndtoan6424 | 6Ly1kN44UEDJIS2E
Java 17 và Maven 3.9.11
