import type { CandidateProfile, Evidence, VerifiedSkill } from '@/lib/types';

const skill = (
  id: string,
  name: string,
  score: number,
  level: VerifiedSkill['level'],
  evidenceCount: number
): VerifiedSkill => ({
  id,
  name,
  score,
  level,
  evidenceCount,
});

const skills = {
  frontend: skill('skill-frontend', 'Frontend', 91, 'Advanced', 4),
  backend: skill('skill-backend', 'Backend', 84, 'Advanced', 3),
  uiux: skill('skill-uiux', 'UI/UX', 88, 'Advanced', 3),
  problemSolving: skill('skill-problem-solving', 'Giải quyết vấn đề', 93, 'Expert', 4),
  documentation: skill('skill-documentation', 'Tài liệu hóa', 86, 'Advanced', 2),
  communication: skill('skill-communication', 'Giao tiếp', 82, 'Intermediate', 2),
};

const sampleFileUrl =
  'data:text/plain;charset=utf-8,POWORK%20sample%20evidence%20file%20for%20Dynamic%20Profile';

export const mockCandidateProfile: CandidateProfile = {
  id: 'candidate-dynamic-profile-demo',
  fullName: 'Nguyễn Minh Anh',
  headline: 'Kỹ sư Frontend | React, Next.js, Thiết kế hệ thống',
  bio: 'Ứng viên có tư duy sản phẩm, khả năng chuyển yêu cầu nghiệp vụ thành giao diện rõ ràng và giải quyết vấn đề bằng những bằng chứng thực chiến đã được doanh nghiệp xác thực.',
  location: 'TP. Hồ Chí Minh, Việt Nam',
  totalChallenges: 4,
  passedChallenges: 4,
  averageScore: 89,
  verifiedSkills: [
    skills.frontend,
    skills.problemSolving,
    skills.uiux,
    skills.backend,
    skills.documentation,
    skills.communication,
  ],
  skillSummary: [
    { id: 'summary-frontend', name: 'Frontend', score: 91, maxScore: 100 },
    { id: 'summary-backend', name: 'Backend', score: 84, maxScore: 100 },
    { id: 'summary-uiux', name: 'UI/UX', score: 88, maxScore: 100 },
    { id: 'summary-problem-solving', name: 'Giải quyết vấn đề', score: 93, maxScore: 100 },
    { id: 'summary-documentation', name: 'Tài liệu hóa', score: 86, maxScore: 100 },
    { id: 'summary-communication', name: 'Giao tiếp', score: 82, maxScore: 100 },
  ],
  evidences: [
    {
      id: 'evidence-next-dashboard',
      challengeTitle: 'Xây dựng bảng điều khiển phân tích tuyển dụng',
      companyName: 'VNG Digital Lab Việt Nam',
      completedAt: '2026-06-28T09:30:00.000Z',
      submittedAt: '2026-06-27T21:15:00.000Z',
      status: 'excellent',
      finalScore: 94,
      maxScore: 100,
      skills: [skills.frontend, skills.uiux, skills.problemSolving],
      rubricItems: [
        {
          id: 'rubric-next-architecture',
          criterionName: 'Kiến trúc ứng dụng và định tuyến',
          score: 24,
          maxScore: 25,
          weight: 25,
          feedback: 'Cấu trúc route rõ ràng, các phần nghiệp vụ của dashboard được tách hợp lý.',
        },
        {
          id: 'rubric-next-ui',
          criterionName: 'Chất lượng triển khai giao diện',
          score: 28,
          maxScore: 30,
          weight: 30,
          feedback: 'Phân cấp thị giác tốt, khoảng cách nhất quán và các trạng thái dễ nhận biết.',
        },
        {
          id: 'rubric-next-data',
          criterionName: 'Xử lý dữ liệu',
          score: 22,
          maxScore: 25,
          weight: 25,
          feedback:
            'Trạng thái tải và dữ liệu trống được xử lý tốt; thông báo lỗi có thể cụ thể hơn.',
        },
        {
          id: 'rubric-next-docs',
          criterionName: 'Tài liệu bàn giao',
          score: 20,
          maxScore: 20,
          weight: 20,
          feedback: 'Tài liệu bàn giao súc tích, ranh giới component rõ ràng.',
        },
      ],
      files: [
        {
          id: 'file-next-demo',
          fileName: 'dashboard-solution.zip',
          fileType: 'ZIP',
          fileSize: 4280000,
          url: sampleFileUrl,
        },
        {
          id: 'file-next-notes',
          fileName: 'implementation-notes.pdf',
          fileType: 'PDF',
          fileSize: 980000,
        },
      ],
      employerFeedback:
        'Giải pháp thể hiện tư duy sản phẩm tốt và kiến trúc Frontend đáng tin cậy. Dashboard dễ theo dõi, ứng viên giải thích các đánh đổi kỹ thuật rõ ràng.',
    },
    {
      id: 'evidence-cache-api',
      challengeTitle: 'Thiết kế chiến lược bộ nhớ đệm cho API tải cao',
      companyName: 'KMS Technology Việt Nam',
      completedAt: '2026-06-19T08:00:00.000Z',
      submittedAt: '2026-06-18T20:20:00.000Z',
      status: 'verified',
      finalScore: 88,
      maxScore: 100,
      skills: [skills.backend, skills.problemSolving, skills.documentation],
      rubricItems: [
        {
          id: 'rubric-cache-design',
          criterionName: 'Thiết kế hệ thống',
          score: 27,
          maxScore: 30,
          weight: 30,
          feedback: 'Cơ chế vô hiệu hóa cache và luồng dự phòng có tính thực tiễn.',
        },
        {
          id: 'rubric-cache-risk',
          criterionName: 'Phân tích rủi ro',
          score: 20,
          maxScore: 25,
          weight: 25,
          feedback: 'Nhận diện đúng rủi ro dữ liệu cũ và nhu cầu giám sát.',
        },
        {
          id: 'rubric-cache-cost',
          criterionName: 'Tối ưu chi phí',
          score: 19,
          maxScore: 20,
          weight: 20,
          feedback: 'Giả định dung lượng Redis hợp lý và có căn cứ.',
        },
        {
          id: 'rubric-cache-docs',
          criterionName: 'Khả năng trình bày',
          score: 22,
          maxScore: 25,
          weight: 25,
          feedback: 'Sơ đồ trực quan, phần giải thích ngắn gọn và dễ kiểm chứng.',
        },
      ],
      files: [
        {
          id: 'file-cache-design',
          fileName: 'cache-strategy.md',
          fileType: 'MD',
          fileSize: 360000,
          url: sampleFileUrl,
        },
      ],
      employerFeedback:
        'Tư duy Backend chắc chắn; giải pháp cân bằng tốt hiệu năng, chi phí và an toàn vận hành.',
    },
    {
      id: 'evidence-mobile-flow',
      challengeTitle: 'Cải tiến luồng nộp bài trên thiết bị di động',
      companyName: 'POWORK Labs',
      completedAt: '2026-06-11T10:45:00.000Z',
      submittedAt: '2026-06-10T22:10:00.000Z',
      status: 'passed',
      finalScore: 85,
      maxScore: 100,
      skills: [skills.frontend, skills.uiux, skills.communication],
      rubricItems: [
        {
          id: 'rubric-mobile-responsive',
          criterionName: 'Bố cục đáp ứng',
          score: 24,
          maxScore: 30,
          weight: 30,
          feedback: 'Bố cục di động dễ sử dụng và luôn giữ thao tác chính trong tầm nhìn.',
        },
        {
          id: 'rubric-mobile-state',
          criterionName: 'Trạng thái tương tác',
          score: 20,
          maxScore: 25,
          weight: 25,
          feedback: 'Trạng thái tải tệp rõ ràng; luồng thử lại cần hoàn thiện thêm.',
        },
        {
          id: 'rubric-mobile-accessibility',
          criterionName: 'Khả năng tiếp cận',
          score: 19,
          maxScore: 20,
          weight: 20,
          feedback: 'Nhãn và trạng thái focus được xử lý đúng chuẩn.',
        },
        {
          id: 'rubric-mobile-handoff',
          criterionName: 'Chất lượng bàn giao',
          score: 22,
          maxScore: 25,
          weight: 25,
          feedback: 'Ghi chú cho QA và các trường hợp biên đầy đủ.',
        },
      ],
      files: [
        {
          id: 'file-mobile-prototype',
          fileName: 'mobile-flow-prototype.fig',
          fileType: 'FIG',
          fileSize: 2200000,
        },
      ],
      employerFeedback:
        'Ứng viên chú ý tốt đến giới hạn trên di động và trình bày quyết định thiết kế thuyết phục.',
    },
    {
      id: 'evidence-rubric-builder',
      challengeTitle: 'Xây dựng bộ tạo tiêu chí chấm điểm động',
      companyName: 'TopDev Việt Nam',
      completedAt: '2026-06-02T07:30:00.000Z',
      submittedAt: '2026-06-01T19:45:00.000Z',
      status: 'verified',
      finalScore: 90,
      maxScore: 100,
      skills: [skills.frontend, skills.documentation, skills.problemSolving],
      rubricItems: [
        {
          id: 'rubric-builder-reuse',
          criterionName: 'Khả năng tái sử dụng component',
          score: 26,
          maxScore: 30,
          weight: 30,
          feedback: 'API của component rõ ràng, không làm rò rỉ trách nhiệm của component cha.',
        },
        {
          id: 'rubric-builder-validation',
          criterionName: 'Logic kiểm tra dữ liệu',
          score: 22,
          maxScore: 25,
          weight: 25,
          feedback: 'Kiểm tra tổng trọng số dễ hiểu và khó bị sử dụng sai.',
        },
        {
          id: 'rubric-builder-maintain',
          criterionName: 'Khả năng bảo trì',
          score: 22,
          maxScore: 25,
          weight: 25,
          feedback: 'Kiểu dữ liệu và helper giúp việc mở rộng sau này đơn giản.',
        },
        {
          id: 'rubric-builder-ux',
          criterionName: 'Trải nghiệm người chấm',
          score: 20,
          maxScore: 20,
          weight: 20,
          feedback: 'Người chấm có thể đọc và chỉnh sửa tiêu chí nhanh chóng.',
        },
      ],
      files: [
        {
          id: 'file-rubric-source',
          fileName: 'rubric-builder.tsx',
          fileType: 'TSX',
          fileSize: 51000,
          url: sampleFileUrl,
        },
      ],
      employerFeedback:
        'Phần triển khai gọn gàng, dễ tái sử dụng và sẵn sàng tích hợp vào luồng đánh giá lớn hơn.',
    },
  ],
};

export const mockEvidenceById: Record<string, Evidence> = mockCandidateProfile.evidences.reduce(
  (acc, evidence) => {
    acc[evidence.id] = evidence;
    return acc;
  },
  {} as Record<string, Evidence>
);
