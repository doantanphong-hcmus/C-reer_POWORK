# TÀI LIỆU QUY CHUẨN MÃ NGUỒN (CODING CONVENTION)

Tài liệu này định nghĩa các tiêu chuẩn phát triển phần mềm cho đội ngũ dự án POWORK (5 thành viên). Mục tiêu tối thượng: **"Code của 5 người phải giống như code của 1 người"**.

---

## 1. QUY CHUẨN KIẾN TRÚC THƯ MỤC (MODULAR MONOLITH)
Dự án được cấu trúc theo Domain-Driven Design (DDD). Tuyệt đối KHÔNG chia thư mục theo loại file kỹ thuật (ví dụ không dồn tất cả controllers vào 1 thư mục).
*   Mỗi miền nghiệp vụ (Domain) phải nằm trong một thư mục riêng lẻ: `iam/`, `challenge/`, `assessment/`, `profile/`.
*   Bên trong mỗi Domain mới được chia thành các tầng logic: `controllers/`, `services/`, `repositories/`, `models/`.
*   **Thư mục Shared/Common**: Chỉ chứa mã nguồn dùng chung (như hàm xử lý ngày tháng, middleware check JWT).
*   **Ranh Giới Bất Khả Xâm Phạm**: Module này KHÔNG ĐƯỢC PHÉP query trực tiếp vào Database hoặc Repository của module khác.

## 2. QUY CHUẨN ĐẶT TÊN (NAMING CONVENTION)
Sự nhất quán trong việc đặt tên giúp giảm thiểu thời gian đọc code và tăng tính chuyên nghiệp.
*   **API Endpoints**: Sử dụng chữ thường, phân cách bằng dấu gạch ngang và là **danh từ số nhiều**.
    *   *Đúng:* `/api/v1/user-profiles`
    *   *Sai:* `/api/v1/getUserProfile`, `/api/v1/UserProfile`
*   **Database & API JSON Payload**: Bắt buộc sử dụng `snake_case`.
    *   *Ví dụ:* `user_id`, `created_at`, `total_score`.
*   **Tên Biến và Hàm**: Sử dụng `camelCase`.
    *   *Ví dụ:* `calculateTotalScore()`, `submissionList`.
*   **Tên Lớp (Classes), Giao diện (Interfaces), Structs**: Sử dụng `PascalCase`.
    *   *Ví dụ:* `ChallengeService`, `UserRepository`.

## 3. QUY CHUẨN GIAO TIẾP CHÉO
Để giữ vững kiến trúc ẩn danh và tách biệt dữ liệu:
*   **Tuyệt đối Cấm**: Sử dụng câu lệnh JOIN chéo giữa bảng `Users` và bảng `Submissions` ở cấp độ Database.
*   **Cách thức giao tiếp hợp lệ**:
    1.  **Giao tiếp đồng bộ**: Thông qua **Internal Service / Interface** (Module A gọi hàm của Module B qua một Interface đã được define sẵn).
    2.  **Giao tiếp bất đồng bộ**: Bắn sự kiện **Event-Driven** (Ví dụ: `Assessment Module` bắn event `Submission_Unlocked`, `Profile Module` lắng nghe và tự xử lý).

## 4. QUY CHUẨN TRẢ VỀ API & XỬ LÝ LỖI
100% các API phải trả về định dạng chuẩn mực, giúp Frontend dễ xử lý.

**Thành công (Success)**:
```json
{
  "status": "success",
  "data": { ... }
}
```

**Thất bại (Error)**:
```json
{
  "status": "error",
  "error_code": "AUTH_001",
  "message": "Mô tả lỗi dễ hiểu cho User..."
}
```

**HTTP Status Code Bắt Buộc**:
*   `200 OK`: Truy vấn thành công hoặc Cập nhật thành công.
*   `201 Created`: Tạo mới dữ liệu thành công (Tạo Challenge, Nộp bài).
*   `400 Bad Request`: Lỗi validate dữ liệu đầu vào.
*   `401 Unauthorized`: Lỗi sai token hoặc chưa đăng nhập.
*   `403 Forbidden`: Có token nhưng không đủ quyền (VD: Candidate cố tình gọi API của Employer).
*   `404 Not Found`: Không tìm thấy dữ liệu.
*   `500 Internal Server Error`: Lỗi hệ thống Backend.

## 5. QUY CHUẨN GIT WORKFLOW & COMMIT
Repository phải sạch sẽ và dễ trace lịch sử.
*   **Nhánh chính**: `main` (chỉ chứa code Production), `develop` (chứa code đang dev).
*   **Nhánh tính năng**: Phải tuân thủ format: `loại/mô-tả-ngắn`. Các loại hợp lệ: `feat` (tính năng mới), `fix` (sửa lỗi), `refactor` (tối ưu code), `docs` (viết tài liệu).
    *   *Ví dụ:* `feat/blind-audition`, `fix/login-crash`.
*   **Commit Message (Conventional Commits)**:
    *   *Cú pháp:* `type: Mô tả ngắn gọn bằng tiếng Việt/Anh`.
    *   *Ví dụ:* `feat: Thêm luồng tạo Challenge cho doanh nghiệp`, `fix: Sửa lỗi hiển thị sai điểm số trên Profile`.
*   **Pull Request (PR)**: Mọi dòng code merge vào `develop` đều phải tạo PR và có ít nhất 1 thành viên review (Approve). KHÔNG ĐƯỢC PHÉP push thẳng code lên nhánh `develop` hay `main`.

## 6. QUY CHUẨN FORMAT MÃ NGUỒN TỰ ĐỘNG
*   Mọi thành viên bắt buộc phải cài đặt công cụ Linter/Formatter tương ứng với ngôn ngữ lập trình được chọn (VD: Prettier, ESLint, Black, gofmt).
*   Khuyến khích cấu hình **Format On Save** trên IDE để máy tính tự dọn dẹp khoảng trắng, dấu phẩy, dấu ngoặc... thay vì con người phải tranh cãi về thụt lề (indentation).
