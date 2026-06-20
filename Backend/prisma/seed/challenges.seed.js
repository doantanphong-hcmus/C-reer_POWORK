/**
 * SEED SCRIPT — Challenges & Rubrics
 * Nguồn data: Seed_Data_Challenges.md (TL cung cấp)
 *
 * Chạy: node prisma/seed/challenges.seed.js
 * (cần có sẵn ít nhất 1 User role=Employer + Company trong DB trước khi seed)
 */
import prisma from '../../src/shared/config/prisma.js'

const SEED_CHALLENGES = [
  {
    title: 'Tối ưu hóa hệ thống Caching cho nền tảng Thương mại Điện tử mua sắm đợt Flash Sale',
    description:
      'Xây dựng một kiến trúc Caching sử dụng Redis để giải quyết bài toán sập hệ thống khi có 1 triệu request/giây đổ vào tính năng Mua Hàng trong đợt Flash Sale. Ứng viên cần cung cấp sơ đồ kiến trúc (System Design), mã nguồn (mô phỏng bằng Node.js hoặc Go) và kết quả load test.',
    industry: 'Công nghệ Thông tin',
    deadline: '2026-07-20T23:59:59Z',
    rubrics: [
      { criteria_name: 'Kiến trúc hệ thống', weight: 40, max_score: 10 },
      { criteria_name: 'Hiệu năng & Tối ưu hóa', weight: 30, max_score: 10 },
      { criteria_name: 'Chất lượng mã nguồn', weight: 30, max_score: 10 },
    ],
  },
  {
    title: 'Lập kế hoạch Launching sản phẩm nước giải khát mới hướng tới Gen Z',
    description:
      'Công ty chuẩn bị ra mắt dòng nước giải khát tăng lực chiết xuất thảo mộc. Hãy lập một bản kế hoạch Digital Marketing toàn diện (IMC Plan) kéo dài 3 tháng với ngân sách 500 triệu VNĐ. Yêu cầu nộp file Slide trình bày chiến lược, phân bổ ngân sách, và các Key Visual / Mockup ý tưởng cho Content.',
    industry: 'Marketing & Truyền thông',
    deadline: '2026-07-25T23:59:59Z',
    rubrics: [
      { criteria_name: 'Tính sáng tạo & Độ lan tỏa', weight: 40, max_score: 10 },
      { criteria_name: 'Khả năng thực thi & Tối ưu ngân sách', weight: 35, max_score: 10 },
      { criteria_name: 'Thẩm mỹ của tư liệu', weight: 25, max_score: 10 },
    ],
  },
  {
    title: 'Thiết kế chính sách giữ chân nhân tài cho công ty có tỷ lệ nghỉ việc cao',
    description:
      'Một công ty quy mô 500 nhân sự đang đối mặt với bài toán nhân viên nghỉ việc nghiêm trọng (tỷ lệ nghỉ việc lên tới 25%/năm). Dựa trên dữ liệu khảo sát nhân viên giả định, bạn hãy xây dựng một Đề án Cải thiện Trải nghiệm Nhân viên (Employee Experience) và cơ chế đãi ngộ mới nhằm giảm tỷ lệ nghỉ việc xuống dưới 10%.',
    industry: 'Quản trị Nhân sự',
    deadline: '2026-07-30T23:59:59Z',
    rubrics: [
      { criteria_name: 'Tính khả thi và Hiệu quả', weight: 45, max_score: 10 },
      { criteria_name: 'Sự thấu cảm văn hóa', weight: 35, max_score: 10 },
      { criteria_name: 'Sự đổi mới trong đãi ngộ', weight: 20, max_score: 10 },
    ],
  },
  {
    title: 'Xây dựng kịch bản Telesale và chiến lược tiếp cận khách hàng B2B doanh nghiệp lớn',
    description:
      'Bạn là chuyên viên phát triển kinh doanh cho một phần mềm ERP. Mục tiêu của bạn là chốt được cuộc hẹn giới thiệu sản phẩm với Giám đốc điều hành của một chuỗi bán lẻ 50 cửa hàng. Hãy viết kịch bản gọi điện dài không quá 3 phút và chiến lược Ice-breaking để vượt qua thư ký.',
    industry: 'Kinh doanh & Bán hàng',
    deadline: '2026-08-05T23:59:59Z',
    rubrics: [
      { criteria_name: 'Khả năng chốt sale', weight: 40, max_score: 10 },
      { criteria_name: 'Kỹ năng xử lý từ chối', weight: 35, max_score: 10 },
      { criteria_name: 'Sự gãy gọn, chuyên nghiệp', weight: 25, max_score: 10 },
    ],
  },
  {
    title: 'Lập mô hình tài chính (P&L) dự phóng 3 năm cho dự án khởi nghiệp F&B',
    description:
      'Một chuỗi cà phê chuẩn bị mở thêm 3 chi nhánh mới tại trung tâm TP.HCM. Bạn được cung cấp các số liệu chi phí cố định (mặt bằng, nhân sự) và chi phí biến đổi (nguyên vật liệu). Hãy lập bảng báo cáo kết quả hoạt động kinh doanh (P&L) dự phóng 3 năm trên Excel, đồng thời tính toán điểm hòa vốn.',
    industry: 'Tài chính & Kế toán',
    deadline: '2026-08-10T23:59:59Z',
    rubrics: [
      { criteria_name: 'Độ chính xác số liệu', weight: 50, max_score: 10 },
      { criteria_name: 'Tính logic của giả định', weight: 30, max_score: 10 },
      { criteria_name: 'Trực quan hóa báo cáo', weight: 20, max_score: 10 },
    ],
  },
  {
    title: 'Thiết kế Đề cương Giảng dạy môn Lịch sử Đảng',
    description:
      'Trường đại học Khoa Học Tự Nhiên đang tìm kiếm giảng viên thỉnh giảng cho môn "Lịch sử Đảng" dành cho sinh viên năm 2. Bạn hãy thiết kế một đề cương môn học kéo dài 7 tuần, kết hợp giữa lý thuyết cốt lõi và bài tập thực hành nhóm. Vui lòng đính kèm Đề cương chi tiết (Syllabus) và một Slide bài giảng mẫu cho tuần học đầu tiên.',
    industry: 'Giáo dục & Đào tạo',
    deadline: '2026-08-15T23:59:59Z',
    rubrics: [
      { criteria_name: 'Tính cấu trúc và Khoa học', weight: 40, max_score: 10 },
      { criteria_name: 'Khả năng sư phạm & Truyền đạt', weight: 35, max_score: 10 },
      { criteria_name: 'Tính thực tiễn và Cập nhật', weight: 25, max_score: 10 },
    ],
  },
  {
    title: 'Sáng tác Concept Art cho dự án game Thần thoại Việt Nam',
    description:
      'Một Studio Game độc lập đang phát triển tựa game nhập vai hành động lấy cảm hứng từ truyền thuyết Sơn Tinh - Thủy Tinh. Bạn hãy sáng tác một bản Concept Art phác họa tạo hình nhân vật Thủy Tinh (bao gồm trang phục, vũ khí và thú cưỡi) kết hợp giữa yếu tố văn hóa dân gian Việt Nam và phong cách Dark Fantasy hiện đại. Vui lòng nộp bản phác thảo chi tiết và bảng phối màu.',
    industry: 'Nghệ thuật & Sáng tạo',
    deadline: '2026-08-20T23:59:59Z',
    rubrics: [
      { criteria_name: 'Tính sáng tạo & Đột phá', weight: 40, max_score: 10 },
      { criteria_name: 'Kỹ thuật hội họa (Bố cục, Ánh sáng, Màu sắc)', weight: 40, max_score: 10 },
      { criteria_name: 'Mức độ bám sát văn hóa dân gian', weight: 20, max_score: 10 },
    ],
  },
]

async function main() {
  // Lấy 1 Company bất kỳ đã có trong DB để gắn challenge vào (demo/test only)
  const company = await prisma.company.findFirst()
  if (!company) {
    console.error('Chưa có Company nào trong DB. Hãy register 1 account Employer trước khi seed.')
    process.exit(1)
  }

  for (const data of SEED_CHALLENGES) {
    // Validate nhanh: tổng weight phải = 100 (đúng convention TL đặt ra)
    const totalWeight = data.rubrics.reduce((sum, r) => sum + r.weight, 0)
    if (totalWeight !== 100) {
      console.error(`Bỏ qua "${data.title}" — tổng weight = ${totalWeight}, không phải 100`)
      continue
    }

    const created = await prisma.challenge.create({
      data: {
        companyId: company.id,
        companyName: company.companyName,
        title: data.title,
        description: data.description,
        industry: data.industry,
        deadline: new Date(data.deadline),
        status: 'OPEN',
        rubricCriteria: {
          create: data.rubrics.map((r) => ({
            criteriaName: r.criteria_name,
            weight: r.weight,
            maxScore: r.max_score,
          })),
        },
      },
    })
    console.log(`Seeded: ${created.title}`)
  }

  console.log('Seed hoàn tất.')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
