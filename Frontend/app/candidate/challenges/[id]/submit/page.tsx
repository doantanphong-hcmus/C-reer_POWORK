
'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useMemo, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { assessmentAPI } from '@/lib/api/endpoints';
import { SubmissionSummary } from '@/lib/types';
import {
  SubmissionHistory,
  Uploader,
  type SubmissionItem,
  // type SubmissionStatus, // Removed as we use SubmissionSummary['status']
  type UploadMetadata,
} from '@/components/submissions';
import { Badge, Button } from '@/components/ui';

// Map backend status (PascalCase) to frontend labels
const STATUS_LABELS: Record<SubmissionSummary['status'], string> = {
  Pending: 'Đang chờ xử lý',
  Evaluated: 'Đang kiểm tra',
  Approved: 'Đã ghi nhận',
  Rejected: 'Bị từ chối',
  Failed: 'Bị chặn bảo mật',
};

// This function is still needed to extract challengeId from URL params
function getChallengeId(params: ReturnType<typeof useParams>): string {
  const rawId = params?.id;

  if (Array.isArray(rawId)) {
    return rawId[0] ?? 'demo-challenge';
  }

  return rawId ?? 'demo-challenge';
}

export default function CandidateChallengeSubmitPage() {
  const challengeId = getChallengeId(useParams());
  const queryClient = useQueryClient();

  const { data: submissions = [], isLoading: isLoadingSubmissions } = useQuery<
    SubmissionSummary[]
  >({
    queryKey: [challengeId, 'submissions'],
    queryFn: () => assessmentAPI.listByChallenge(challengeId),
  });

  const { mutateAsync: uploadSubmissionMutation, isPending: isUploading } = useMutation({
    mutationFn: async ({ file, metadata }: { file: File; metadata: UploadMetadata }) => {
      // Step 1: Get presigned URL
      const { upload_url, file_key } = await assessmentAPI.getPresignedUploadUrl({
        challenge_id: challengeId,
        file_name: metadata.originalFileName,
        file_type: file.type,
      });

      // Step 2: Upload file to MinIO
      await axios.put(upload_url, file, {
        headers: {
          'Content-Type': file.type,
        },
      });

      // Step 3: Notify backend about submission
      await assessmentAPI.submit({
        challenge_id: challengeId,
        solution_url: file_key,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [challengeId, 'submissions'] });
      setIsUploaderOpen(false);
    },
    onError: (error) => {
      let errorMessage = 'Đã xảy ra lỗi khi nộp bài.';

      if (axios.isAxiosError(error)) {
        if (error.response) {
          // Lỗi từ phản hồi của backend (ví dụ: status 4xx, 5xx)
          errorMessage = `Nộp bài thất bại: ${error.response.data.message || error.message}`;
        } else if (error.request) {
          // Lỗi không nhận được phản hồi (ví dụ: mất mạng, timeout)
          errorMessage = 'Không thể kết nối đến máy chủ. Vui lòng kiểm tra kết nối mạng của bạn.';
        } else {
          // Lỗi khi thiết lập request
          errorMessage = `Lỗi trong quá trình gửi yêu cầu: ${error.message}`;
        }
      } else {
        // Lỗi không phải từ Axios
        errorMessage = `Lỗi không xác định: ${error.message || errorMessage}`;
      }

      alert(errorMessage);
    },
  });

  const [isUploaderOpen, setIsUploaderOpen] = useState(false);

  const latestSubmission = useMemo(() => {
    if (submissions.length === 0) return undefined;
    return [...submissions].sort((a, b) => new Date(b.submitted_at!).getTime() - new Date(a.submitted_at!).getTime())[0];
  }, [submissions]);

  const handleUpload = async (file: File, metadata: UploadMetadata) => {
    await uploadSubmissionMutation({ file, metadata });
  };

  const handleRefresh = () => {
    queryClient.invalidateQueries({ queryKey: [challengeId, 'submissions'] });
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
            <Badge variant={latestSubmission?.status === 'Approved' ? 'blind' : 'fail'}>
              {latestSubmission ? STATUS_LABELS[latestSubmission.status] : 'Chưa nộp'}
            </Badge>
          </div>
        </div>
      </header>

      <section className="flex shrink-0 flex-col gap-3 rounded-lg border-hairline border-border bg-background-secondary px-4 py-3 sm:min-h-16 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-medium text-foreground">
            {latestSubmission
              ? `Phiên bản mới nhất: lần ${latestSubmission.hash_id.slice(-4)}`
              : 'Chưa có bài nộp'}
          </p>
          <p className="mt-1 text-xs text-foreground-tertiary">
            {isLoadingSubmissions ? 'Đang tải lịch sử...' : `Cập nhật gần nhất: ${new Date(latestSubmission?.submitted_at!).toLocaleTimeString('vi-VN')}`}
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          {latestSubmission?.solution_url && (
            <a
              href={latestSubmission.solution_url}
              download={latestSubmission.hash_id} // Or a more user-friendly name if available
              className="btn-base"
            >
              Tải file mới nhất
            </a>
          )}
          <Button type="button" variant="default" onClick={handleRefresh} disabled={isLoadingSubmissions}>
            Làm mới
          </Button>
          <Button type="button" variant="primary" onClick={() => setIsUploaderOpen(true)} disabled={isUploading}>
            {submissions.length > 0 ? 'Nộp phiên bản mới' : 'Nộp bài mới'}
          </Button>
        </div>
      </section>

      <SubmissionHistory
        submissions={submissions.map(s => ({
          id: s.submission_id,
          fileName: s.solution_url?.split('/').pop() || s.hash_id,
          originalFileName: s.solution_url?.split('/').pop() || s.hash_id,
          submittedAt: new Date(s.submitted_at!),
          status: s.status.toLowerCase() as SubmissionItem['status'], // Ensure status is lowercase
          version: 0, // Versioning is not directly in SubmissionSummary, might need backend change or infer
          fileSize: 0, // Not available in SubmissionSummary, might need backend change
          note: '', // Not available in SubmissionSummary
          downloadUrl: s.solution_url,
        }))}
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
