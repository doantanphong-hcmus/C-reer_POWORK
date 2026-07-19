# TÀI LIỆU TỔNG QUAN PHÂN HỆ 3: CHẤM ĐIỂM ẨN DANH VÀ MỞ KHÓA THÔNG TIN

---

## 1. Thành quả dự án đến hiện tại
Trải qua hai module đầu tiên, chúng ta đã xây dựng thành công bộ khung xương sống vững chắc cho toàn bộ hệ thống. 

Cơ sở dữ liệu đã được kết nối thông suốt và kiến trúc ẩn danh được thiết lập ngay từ tầng sâu nhất. Hệ thống hiện tại đã đủ sức mạnh để tiếp nhận hồ sơ từ ứng viên, xác thực tệp tin một cách chính xác, lưu trữ an toàn trên đám mây nội bộ và tự động vận hành quy trình quét mã độc ngầm. Trải nghiệm của người dùng cũng được chăm chút khi ứng viên nhận được thư điện tử xác nhận nộp bài thành công ngay lập tức. 

Đáng tự hào nhất là nguyên tắc cốt lõi của dự án đã được bảo vệ tuyệt đối: Danh tính của ứng viên bị tách rời hoàn toàn khỏi nội dung bài làm. Đây chính là bệ phóng hoàn hảo để chúng ta bước vào giai đoạn quan trọng nhất của dự án.

## 2. Tiêu điểm Module 3
Module 3 chính là phần quan trọng của toàn bộ dự án, nơi chúng ta hiện thực hóa khái niệm chấm điểm mù.

Nhà tuyển dụng sẽ đóng vai trò như những vị giám khảo công tâm nhất, đánh giá năng lực ứng viên hoàn toàn dựa trên chất lượng bài nộp mà không bị chi phối bởi bất kỳ thông tin cá nhân nào. Các tiêu chí chấm điểm đã được định lượng rõ ràng. Chỉ khi bài làm thực sự xuất sắc và đạt đủ điểm yêu cầu, nhà tuyển dụng mới được cấp quyền mở khóa để nhìn thấy danh tính thật của ứng viên.

Để trải nghiệm này diễn ra hoàn hảo, chúng ta sẽ áp dụng thiết kế giao diện chia đôi màn hình, mang lại không gian đối chiếu trực quan nhất. Đồng thời, một cơ chế tải tệp tin dự phòng sẽ được kích hoạt nếu định dạng bài nộp quá phức tạp (kiểu như ở dạng zip thì hiển thị màn hình "Không thể tải tệp" và đưa chữ "tải tệp xuống" to tướng ở giữa màn hình). Ở hậu phương, một cơ chế trạng thái bảo mật nghiêm ngặt sẽ canh gác hệ thống, triệt tiêu mọi nỗ lực gian lận hoặc thay đổi điểm số trái phép sau khi quyết định mở khóa đã được đưa ra.

## 3. Trải nghiệm người dùng: Hành trình khám phá nhân tài
Thay vì những gạch đầu dòng khô khan về mặt kỹ thuật, dưới đây là toàn bộ luồng trải nghiệm (UX) thực tế mà nhà tuyển dụng sẽ đi qua. Điều này giúp mọi người hình dung rõ nhất đích đến của Module 3.

### Bước 1: Tiếp cận hồ sơ ẩn danh
Nhà tuyển dụng đăng nhập vào bảng điều khiển và chọn một bài nộp bất kỳ. Tại thời điểm này, hệ thống tuân thủ tuyệt đối nguyên tắc không để lộ thông tin – không một cái tên hay địa chỉ thư điện tử nào được hé lộ. Màn hình ngay lập tức chuyển sang trạng thái Split-view.

### Bước 2: Không gian đối chiếu trực quan (Split-view)
- **Nửa màn hình bên trái:** Đóng vai trò là bàn làm việc. Nếu ứng viên nộp các tài liệu văn bản hoặc hình ảnh, nhà tuyển dụng có thể đọc và xem xét trực tiếp ngay trên trình duyệt. Ngược lại, đối với các tệp tin nén phức tạp chứa mã nguồn hoặc tập dữ liệu lớn, nửa bên trái sẽ hiển thị thông báo *Không thể xem trước tệp tin* đi kèm một nút **Tải Xuống** nổi bật ở vị trí trung tâm, giúp nhà tuyển dụng dễ dàng lấy dữ liệu về máy để đánh giá ngoại tuyến.
- **Nửa màn hình bên phải:** Luôn luôn hiển thị biểu mẫu chấm điểm (Rubric). Khi nhà tuyển dụng di chuyển các thanh trượt/ form nhập liệu điểm số, hệ thống sẽ tự động tổng hợp và hiển thị kết quả ngay tức thì mà không cần tải lại trang.

### Bước 3: Quyết định Phê duyệt và Mở khóa
Khi quá trình đánh giá hoàn tất và tổng điểm đạt mức kỳ vọng, nhà tuyển dụng sẽ đưa ra quyết định cuối cùng bằng cách nhấn vào nút **Phê duyệt & Mở khóa**. 

### Bước 4: UnLock
Đây là lúc hệ thống phía sau hoạt động hết công suất. Cơ chế trạng thái sẽ kích hoạt, đóng băng vĩnh viễn mọi điểm số và ngăn chặn mọi hành vi thay đổi sau đó. Ngay lập tức, một bảng thông tin rực rỡ sẽ xuất hiện trên màn hình đi kèm các hiệu ứng chúc mừng sinh động, chính thức công bố danh tính thật của ứng viên (bao gồm tên, thư điện tử và thông tin liên lạc). Từ khoảnh khắc này, nhà tuyển dụng có thể tiến hành kết nối phỏng vấn.