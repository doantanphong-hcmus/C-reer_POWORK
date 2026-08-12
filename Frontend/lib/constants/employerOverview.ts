import type {
  ActivityAction,
  OverviewMetricKey,
  SettingsSection,
  TaskKey,
} from '@/lib/types/employerOverview';

export const EMPLOYER_COPY = {
  pageTitle: 'Tổng quan tuyển dụng',
  pageDescription: 'Theo dõi thử thách, bài nộp và tiến độ đánh giá trong một không gian làm việc.',
  activeChallenges: 'Thử thách đang hoạt động',
  reviewQueue: 'Bài nộp cần chấm',
  tasks: 'Việc cần làm',
  recentActivity: 'Hoạt động gần đây',
  bookmarks: 'Thử thách đã lưu',
  settings: 'Cài đặt không gian làm việc',
  viewAll: 'Xem tất cả',
  viewSubmissions: 'Xem bài nộp',
  noChallenges: 'Chưa có thử thách đang hoạt động.',
  noReviews: 'Không có bài nộp nào đang chờ chấm.',
  noActivity: 'Chưa có hoạt động gần đây.',
  loadError: 'Không thể tải dữ liệu tổng quan tuyển dụng.',
} as const;

export const METRIC_LABELS: Record<OverviewMetricKey, { label: string; description: string }> = {
  activeChallenges: { label: 'Thử thách đang mở', description: 'Đang nhận bài nộp' },
  pendingReviews: { label: 'Bài nộp cần chấm', description: 'Đang chờ đánh giá' },
  unlockedProfiles: { label: 'Hồ sơ đã mở khóa', description: 'Trong kho ứng viên' },
  nextDeadline: { label: 'Hạn gần nhất', description: 'Mốc cần theo dõi' },
};

export const TASK_LABELS: Record<TaskKey, { title: string; description: string }> = {
  createChallenge: {
    title: 'Tạo thử thách đầu tiên',
    description: 'Khởi động quy trình tuyển dụng dựa trên năng lực.',
  },
  reviewSubmissions: {
    title: 'Chấm bài đang chờ',
    description: 'Hoàn tất các bài đánh giá ẩn danh đang chờ xử lý.',
  },
  deadlineSoon: {
    title: 'Kiểm tra thử thách sắp hết hạn',
    description: 'Rà soát deadline và bài nộp trước khi đóng.',
  },
};

export const ACTIVITY_LABELS: Record<ActivityAction, string> = {
  challengeCreated: 'đã tạo thử thách',
  submissionReceived: 'đã gửi bài cho',
};

export const SETTINGS_LABELS: Record<SettingsSection, string> = {
  profile: 'Thông tin chung',
  members: 'Thành viên',
  notifications: 'Thông báo',
  appearance: 'Giao diện',
  privacy: 'Quyền riêng tư',
};
