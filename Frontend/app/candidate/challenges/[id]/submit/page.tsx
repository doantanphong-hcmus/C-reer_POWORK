'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useMemo, useState } from 'react';
import {
  SubmissionHistory,
  Uploader,
  type SubmissionItem,
  type SubmissionStatus,
  type UploadMetadata,
} from '@/components/submissions';
import { Badge, Button } from '@/components/ui';

const STATUS_LABELS: Record<SubmissionStatus, string> = {
  pending: 'Đang chờ xử lý',
  processing: 'Đang kiểm tra',
  accepted: 'Đã ghi nhận',
  rejected: 'Bị từ chối',
  failed: 'Bị chặn bảo mật',
};

function getChallengeId(params: ReturnType<typeof useParams>): string {
  const rawId = params?.id;

  if (Array.isArray(rawId)) {
    return rawId[0] ?? 'demo-challenge';
  }

  return rawId ?? 'demo-challenge';
}

function createInitialSubmissions(challengeId: string): SubmissionItem[] {
  return [
    {
      id: `${challengeId}-submission-002`,
      fileName: 'solution-v2.pdf',
      originalFileName: 'solution-v2.pdf',
      submittedAt: new Date(Date.now() - 1000 * 60 * 45),
      status: 'processing',
      version: 2,
      fileSize: 2_450_000,
      note: 'Đã cập nhật phần responsive và sửa lỗi validation.',
    },
    {
      id: `${challengeId}-submission-001`,
      fileName: 'solution-v1.zip',
      originalFileName: 'solution-v1.zip',
      submittedAt: new Date(Date.now() - 1000 * 60 * 60 * 26),
      status: 'pending',
      version: 1,
      fileSize: 6_280_000,
    },
  ];
}

function getLatestSubmission(submissions: SubmissionItem[]) {
  return [...submissions].sort((left, right) => {
    const leftTime = new Date(left.submittedAt).getTime();
    const rightTime = new Date(right.submittedAt).getTime();
    return rightTime - leftTime;
  })[0];
}

export default function CandidateChallengeSubmitPage() {
  const challengeId = getChallengeId(useParams());
  const [submissions, setSubmissions] = useState<SubmissionItem[]>(() =>
    createInitialSubmissions(challengeId)
  );
  const [isUploaderOpen, setIsUploaderOpen] = useState(false);
  const [lastRefreshedAt, setLastRefreshedAt] = useState<Date>(() => new Date());

  const latestSubmission = useMemo(() => getLatestSubmission(submissions), [submissions]);
  const latestWithDownload = submissions.find((submission) => submission.downloadUrl);

  const handleUpload = async (file: File, metadata: UploadMetadata) => {
    await new Promise<void>((resolve) => {
      window.setTimeout(resolve, 600);
    });

    const downloadUrl = URL.createObjectURL(file);

    setSubmissions((currentSubmissions) => {
      const latestVersion = currentSubmissions.reduce(
        (maxVersion, submission) => Math.max(maxVersion, submission.version ?? 0),
        0
      );

      return [
        {
          id: `${challengeId}-submission-${Date.now()}`,
          fileName: metadata.savedFileName,
          originalFileName: metadata.originalFileName,
          submittedAt: new Date(),
          status: 'pending',
          version: latestVersion + 1,
          fileSize: metadata.fileSize,
          note: metadata.note,
          downloadUrl,
        },
        ...currentSubmissions,
      ];
    });
  };

  const handleRefresh = () => {
    setLastRefreshedAt(new Date());
  };

  return (
    <div className="mx-auto flex h-full min-h-0 max-w-6xl flex-col gap-4">
      <header className="flex shrink-0 flex-col gap-4 border-b-hairline border-border pb-4 sm:min-h-32 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <Link href="/candidate/dashboard" className="back-link hover:underline">
            &larr; Quay lại tổng quan
          </Link>
          <h1 className="mt-4 text-4xl font-semibold tracking-tight text-foreground">
            Nộp bài thử thách
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-foreground-secondary">
            Employer chỉ nhìn thấy mã ứng viên và mã bài nộp trong quá trình đánh giá ẩn danh, không
            thấy danh tính cá nhân của bạn.
          </p>
        </div>

        <div className="flex shrink-0 flex-col gap-2 rounded-lg border-hairline border-border bg-background-secondary px-4 py-3">
          <span className="text-xs text-foreground-tertiary">Mã challenge</span>
          <span className="font-mono text-sm text-accent">{challengeId}</span>
          <div className="mt-1 flex items-center gap-2">
            <Badge variant={latestSubmission ? 'blind' : 'fail'}>
              {latestSubmission ? STATUS_LABELS[latestSubmission.status] : 'Chưa nộp'}
            </Badge>
          </div>
        </div>
      </header>

      <section className="flex shrink-0 flex-col gap-3 rounded-lg border-hairline border-border bg-background-secondary px-4 py-3 sm:min-h-16 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-medium text-foreground">
            {latestSubmission
              ? `Phiên bản mới nhất: lần ${latestSubmission.version}`
              : 'Chưa có bài nộp'}
          </p>
          <p className="mt-1 text-xs text-foreground-tertiary">
            Làm mới lúc{' '}
            {new Intl.DateTimeFormat('vi-VN', {
              hour: '2-digit',
              minute: '2-digit',
            }).format(lastRefreshedAt)}
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          {latestWithDownload?.downloadUrl && (
            <a
              href={latestWithDownload.downloadUrl}
              download={latestWithDownload.fileName}
              className="btn-base"
            >
              Tải file mới nhất
            </a>
          )}
          <Button type="button" variant="default" onClick={handleRefresh}>
            Làm mới
          </Button>
          <Button type="button" variant="primary" onClick={() => setIsUploaderOpen(true)}>
            {submissions.length > 0 ? 'Nộp phiên bản mới' : 'Nộp bài mới'}
          </Button>
        </div>
      </section>

      <SubmissionHistory
        submissions={submissions}
        onRefresh={handleRefresh}
        onCreateFirstSubmission={() => setIsUploaderOpen(true)}
        className="min-h-0"
      />

      <Uploader
        challengeId={challengeId}
        isOpen={isUploaderOpen}
        onClose={() => setIsUploaderOpen(false)}
        onUpload={handleUpload}
        hasExistingSubmissions={submissions.length > 0}
      />
    </div>
  );
}
