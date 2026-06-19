# KỊCH BẢN KIỂM THỬ (TEST CASES) - LUỒNG TẠO CHALLENGE

Tài liệu này định nghĩa các kịch bản bắt buộc phải vượt qua đối với API `[POST] /api/v1/challenges`. BE (Quang) sử dụng tài liệu này làm cơ sở để lập trình hàm Validation. FE (Thịnh/Nhân/Khoa) dùng làm cơ sở xử lý báo lỗi UI.

## Endpoint Cần Test
`[POST] /api/v1/challenges`

## 1. Các Test Case Hợp Lệ (Happy Path)

| Mã TC | Kịch bản (Scenario) | Dữ liệu đầu vào (Input) | Kết quả mong đợi (Expected Output) |
| :--- | :--- | :--- | :--- |
| **TC_CHAL_001** | Tạo Challenge thành công với đầy đủ dữ liệu hợp lệ | - Token Employer hợp lệ.<br>- `title`, `description`, `industry`, `deadline` đầy đủ.<br>- `rubrics` có 3 tiêu chí, tổng `weight` = 40 + 30 + 30 = 100. | - HTTP Status: `201 Created`<br>- Response trả về `status: "success"` và kèm `challenge_id`, `criteria_id` mới tạo. |

---

## 2. Các Test Case Bắt Lỗi (Negative Path)

| Mã TC | Kịch bản (Scenario) | Lỗi cần bắt | Kết quả mong đợi (Expected Output) |
| :--- | :--- | :--- | :--- |
| **TC_CHAL_002** | Lỗi phân quyền: Candidate cố tình tạo Challenge | Header `Authorization` chứa Token của user có role là `Candidate`. | - HTTP Status: `403 Forbidden`<br>- Message: "Bạn không có quyền thực hiện chức năng này." |
| **TC_CHAL_003** | Thiếu Token hoặc Token hết hạn | Không truyền Header `Authorization` hoặc truyền Token hỏng. | - HTTP Status: `401 Unauthorized`<br>- Message: "Vui lòng đăng nhập." |
| **TC_CHAL_004** | Tổng trọng số Rubric NHỎ HƠN 100% | Mảng `rubrics` có 2 tiêu chí, `weight` = 40 và 50 (Tổng = 90). | - HTTP Status: `400 Bad Request`<br>- Message: "Tổng trọng số (weight) của bộ tiêu chí phải bằng 100." |
| **TC_CHAL_005** | Tổng trọng số Rubric LỚN HƠN 100% | Mảng `rubrics` có 3 tiêu chí, `weight` = 40, 40, 30 (Tổng = 110). | - HTTP Status: `400 Bad Request`<br>- Message: "Tổng trọng số (weight) của bộ tiêu chí phải bằng 100." |
| **TC_CHAL_006** | Thiếu mảng Rubric | Body Request không truyền mảng `rubrics` hoặc mảng rỗng `[]`. | - HTTP Status: `400 Bad Request`<br>- Message: "Bắt buộc phải có ít nhất một tiêu chí chấm điểm." |
| **TC_CHAL_007** | Nhập thiếu trường thông tin bắt buộc | Body Request thiếu `title` hoặc `deadline`. | - HTTP Status: `400 Bad Request`<br>- Message: "Tên thử thách và Hạn nộp bài là bắt buộc." |
| **TC_CHAL_008** | Lỗi định dạng thời gian (Deadline) | Truyền `deadline` ở quá khứ (Ví dụ: `2020-01-01`) hoặc chuỗi không phải Datetime. | - HTTP Status: `400 Bad Request`<br>- Message: "Hạn chót không hợp lệ hoặc đã qua thời hạn." |
| **TC_CHAL_009** | Tiêu chí Rubric bị trùng lặp | Mảng `rubrics` có 2 phần tử chứa `criteria_name` giống hệt nhau. | - HTTP Status: `400 Bad Request`<br>- Message: "Tên tiêu chí không được phép trùng lặp." |
| **TC_CHAL_010** | Trọng số hoặc điểm số âm | Mảng `rubrics` chứa `weight` hoặc `max_score` có giá trị <= 0. | - HTTP Status: `400 Bad Request`<br>- Message: "Trọng số và điểm tối đa phải lớn hơn 0." |
