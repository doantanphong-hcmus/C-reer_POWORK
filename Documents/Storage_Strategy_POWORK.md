# TÀI LIỆU CHIẾN LƯỢC LƯU TRỮ (STORAGE STRATEGY)
**Dự án:** POWORK - Nền tảng tuyển dụng ẩn danh

**Người viết:** Phong

---

## 1. MỤC TIÊU CỦA TÀI LIỆU
Trong Module 2 (Khu vực cách ly danh tính), hệ thống sẽ phải tiếp nhận một lượng lớn file giải pháp (source code, pdf, hình ảnh) từ ứng viên. Bài toán đặt ra là phải chọn một kiến trúc lưu trữ vừa đảm bảo hiệu năng cao (không làm sập Backend), vừa tối ưu chi phí cho giai đoạn MVP, nhưng vẫn sẵn sàng mở rộng trong tương lai. 

Tài liệu này lý giải quyết định lựa chọn **MinIO kết hợp cơ chế Presigned URL** thay cho các giải pháp truyền thống.

---

## 2. PHÂN TÍCH SO SÁNH CÁC PHƯƠNG ÁN

### Phương án A: Lưu trữ cục bộ (Local Storage)
Backend nhận file từ Client qua request `multipart/form-data` và lưu trực tiếp vào ổ cứng của Server chạy Backend.
- **Ưu điểm:** Dễ code, không tốn thêm công setup dịch vụ mới.
- **Nhược điểm:** 
  - **Thắt cổ chai:** Backend phải gánh toàn bộ băng thông tải file. Nếu 100 người nộp file 10MB cùng lúc, RAM và Băng thông của Backend sẽ nghẽn, dẫn đến sập toàn bộ hệ thống API.
  - **Khó Scale:** Nếu chạy nhiều instance Backend để chịu tải, file sẽ nằm rải rác ở nhiều máy khác nhau, gây lỗi không tìm thấy file khi nhà tuyển dụng tải về.

### Phương án B: Sử dụng dịch vụ Đám mây (AWS S3)
Thuê kho lưu trữ S3 của Amazon Cloud.
- **Ưu điểm:** Chuẩn công nghiệp, không bao giờ sập, dung lượng vô hạn. Có hỗ trợ Presigned URL giúp Backend không phải ôm file.
- **Nhược điểm:** 
  - **Chi phí:** Tốn tiền lưu trữ và đặc biệt tốn tiền cước phí mạng khi các giám khảo liên tục tải bài làm về chấm điểm. Rất rủi ro về mặt chi phí đối với giai đoạn hiện tại. 

### Phương án C: MinIO Self-hosted (Quyết định được chọn)
Sử dụng công cụ mã nguồn mở MinIO cài đặt bằng Docker ngay trên máy chủ của team. 
- **Ưu điểm:**
  - **Mô phỏng 100% AWS S3:** Hoạt động dựa trên S3 API. Code gọi MinIO hoàn toàn y hệt code gọi AWS S3.
  - **Chi phí 0 đồng:** Không tốn tiền dịch vụ cho bên thứ 3. Tận dụng tối đa tài nguyên có sẵn của máy chủ nội bộ.
  - **Tối ưu Backend bằng Presigned URL:** Tránh được thắt cổ chai như Phương án A.
- **Nhược điểm:** Phải tốn công setup container MinIO (Cái này tôi tin ông làm được mà:D).

---

## 3. KIẾN TRÚC HOẠT ĐỘNG (PRESIGNED URL)

Hệ thống POWORK sẽ **không cho phép Client tải file trực tiếp xuyên qua Backend**. Quy trình nộp bài chuẩn như sau:

1. **Yêu cầu cấp quyền:** Ứng viên bấm nộp bài, Client gọi API Backend xin phép nộp file.
2. **Cấp vé (Presigned URL):** Backend mã hóa một đường link nội bộ bằng Secret Key cấp cho Client (Link có thời hạn 5 phút).
3. **Upload trực tiếp:** Client dùng link này đẩy file **chạy thẳng vào MinIO Server**. Backend hoàn toàn rảnh tay.
4. **Lưu vết:** Sau khi upload xong, Client báo lại URL cho Backend để lưu vào bảng `Submissions` kèm `Hash_ID`.

---

## 4. LỘ TRÌNH MỞ RỘNG
Khi dự án gọi vốn thành công và có nhu cầu chuyển lên nền tảng Cloud thật sự để đảm bảo độ bền vững dữ liệu, quá trình chuyển đổi diễn ra dễ dàng:
- Toàn bộ source code Backend giữ nguyên, không sửa 1 dòng logic nào.
- Chỉ việc thay đổi cấu hình Biến môi trường (`.env`): đổi endpoint từ URL của MinIO sang URL của AWS S3. Đổi Access Key và Secret Key.

**=> Kết luận:** MinIO là giải pháp hoàn hảo để giữ vững cấu trúc mã nguồn ở mức độ Enterprise nhưng vẫn giải quyết triệt để bài toán tài chính cho giai đoạn MVP.
