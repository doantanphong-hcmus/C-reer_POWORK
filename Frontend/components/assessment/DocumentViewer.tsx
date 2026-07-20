'use client';

import { useMemo, useState } from 'react';
import { Button } from '@/components/ui';
import { cn } from '@/lib/utils/cn';
import { formatFileSize } from '@/lib/utils/file';
import type { DocumentKind, ReviewDocument } from '@/lib/types';

interface DocumentViewerProps {
  document?: ReviewDocument | null;
  className?: string;
}

type PreviewState = 'idle' | 'loading' | 'ready' | 'error';

function kindFromMimeType(mimeType?: string | null): DocumentKind | null {
  const normalized = mimeType?.toLowerCase().trim();

  if (!normalized) return null;
  if (normalized.includes('pdf')) return 'pdf';
  if (normalized.startsWith('image/')) return 'image';
  if (
    normalized.includes('zip') ||
    normalized.includes('x-7z') ||
    normalized.includes('x-rar') ||
    normalized.includes('x-tar') ||
    normalized.includes('gzip')
  ) {
    return 'zip';
  }

  return null;
}

export function inferDocumentKind(
  fileName?: string | null,
  mimeType?: string | null
): DocumentKind {
  const mimeKind = kindFromMimeType(mimeType);
  const ext = fileName?.split('.').pop()?.toLowerCase().trim() ?? '';

  if (ext === 'pdf') return 'pdf';
  if (['png', 'jpg', 'jpeg', 'gif', 'webp', 'svg', 'bmp', 'avif'].includes(ext)) {
    return 'image';
  }
  if (['zip', 'rar', '7z', 'tar', 'gz'].includes(ext)) return 'zip';

  return mimeKind ?? 'unknown';
}

function getKindLabel(kind: DocumentKind): string {
  if (kind === 'pdf') return 'PDF';
  if (kind === 'image') return 'IMG';
  if (kind === 'zip') return 'ZIP';
  return 'FILE';
}

function getFallbackCopy({
  kind,
  hasUrl,
  isError,
}: {
  kind: DocumentKind;
  hasUrl: boolean;
  isError: boolean;
}) {
  if (!hasUrl) {
    return {
      title: 'Chưa có file để xem trước',
      description:
        'Backend chưa trả URL hợp lệ cho bài nộp này. Reviewer vẫn có thể tiếp tục chấm rubric khi dữ liệu file được bổ sung.',
    };
  }

  if (isError) {
    return {
      title: 'Không tải được bản xem trước',
      description:
        'File có thể bị chặn bởi trình duyệt, URL đã hết hạn hoặc MIME type không khớp. Hãy tải xuống để kiểm tra bằng công cụ phù hợp.',
    };
  }

  if (kind === 'zip') {
    return {
      title: 'File nén không thể xem trước',
      description:
        'Trình duyệt không mở trực tiếp file nén. Hãy tải xuống để giải nén và xem nội dung bài nộp.',
    };
  }

  return {
    title: 'Không hỗ trợ xem trước định dạng này',
    description:
      'Định dạng file hiện tại không thể nhúng vào màn hình chấm. Hãy tải xuống để mở bằng phần mềm phù hợp.',
  };
}

export function DocumentViewer({ document, className }: DocumentViewerProps) {
  const fileName = document?.fileName?.trim() || 'submission-file';
  const url = document?.url?.trim() || '';
  const kind = useMemo(
    () => document?.kind ?? inferDocumentKind(document?.fileName, document?.mimeType),
    [document?.fileName, document?.kind, document?.mimeType]
  );
  const hasUrl = url.length > 0;
  const canPreview = hasUrl && (kind === 'pdf' || kind === 'image');
  const sizeLabel =
    typeof document?.fileSize === 'number' && document.fileSize > 0
      ? formatFileSize(document.fileSize)
      : null;

  return (
    <div
      className={cn(
        'flex h-full min-h-[360px] flex-col overflow-hidden rounded-lg border-hairline border-border-secondary bg-background',
        className
      )}
    >
      <div className="flex min-h-12 items-center justify-between gap-3 border-b-hairline border-border-secondary bg-background-tertiary px-4 py-2.5">
        <div className="flex min-w-0 items-center gap-2">
          <span
            className="inline-flex h-7 w-9 shrink-0 items-center justify-center rounded-md border-hairline border-border-secondary bg-background font-mono text-2xs font-semibold text-foreground-secondary"
            aria-hidden
          >
            {getKindLabel(kind)}
          </span>
          <div className="min-w-0">
            <p className="truncate text-sm font-medium text-foreground" title={fileName}>
              {fileName}
            </p>
            <p className="truncate text-2xs text-foreground-tertiary">
              {sizeLabel ?? document?.description ?? 'Sẵn sàng cho reviewer'}
            </p>
          </div>
        </div>

        {hasUrl ? (
          <a
            href={url}
            download={fileName}
            target="_blank"
            rel="noreferrer"
            className="inline-flex h-8 shrink-0 items-center justify-center rounded-lg border-hairline border-border-secondary bg-background px-3 text-xs font-medium text-foreground transition-colors hover:opacity-90"
          >
            Tải xuống
          </a>
        ) : (
          <Button type="button" size="sm" disabled>
            Chưa có URL
          </Button>
        )}
      </div>

      <DocumentPreviewBody
        key={`${kind}:${url}`}
        fileName={fileName}
        url={url}
        kind={kind}
        sizeLabel={sizeLabel}
        hasUrl={hasUrl}
        canPreview={canPreview}
      />
    </div>
  );
}

function DocumentPreviewBody({
  fileName,
  url,
  kind,
  sizeLabel,
  hasUrl,
  canPreview,
}: {
  fileName: string;
  url: string;
  kind: DocumentKind;
  sizeLabel: string | null;
  hasUrl: boolean;
  canPreview: boolean;
}) {
  const [previewState, setPreviewState] = useState<PreviewState>(canPreview ? 'loading' : 'idle');
  const showFallback = !canPreview || previewState === 'error';
  const showLoading = canPreview && previewState === 'loading';

  return (
    <div className="relative min-h-0 flex-1 bg-background-secondary">
      {canPreview && kind === 'pdf' && (
        <iframe
          src={url}
          title={`Xem trước ${fileName}`}
          onLoad={() => setPreviewState('ready')}
          onError={() => setPreviewState('error')}
          className={cn(
            'absolute inset-0 h-full w-full border-0 bg-white transition-opacity duration-150',
            previewState === 'ready' ? 'opacity-100' : 'opacity-0'
          )}
        />
      )}

      {canPreview && kind === 'image' && (
        // eslint-disable-next-line @next/next/no-img-element -- API submissions can be data URLs or arbitrary external file URLs.
        <img
          src={url}
          alt={fileName}
          onLoad={() => setPreviewState('ready')}
          onError={() => setPreviewState('error')}
          className={cn(
            'absolute inset-0 h-full w-full object-contain p-4 transition-opacity duration-150',
            previewState === 'ready' ? 'opacity-100' : 'opacity-0'
          )}
        />
      )}

      {showLoading && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 px-6 text-center">
          <div className="h-10 w-10 animate-pulse rounded-lg border-hairline border-border-secondary bg-background-tertiary" />
          <p className="text-sm font-medium text-foreground-secondary">Đang tải bản xem trước...</p>
        </div>
      )}

      {showFallback && (
        <DocumentFallback
          fileName={fileName}
          url={url}
          kind={kind}
          sizeLabel={sizeLabel}
          hasUrl={hasUrl}
          isError={previewState === 'error'}
        />
      )}
    </div>
  );
}

function DocumentFallback({
  fileName,
  url,
  kind,
  sizeLabel,
  hasUrl,
  isError,
}: {
  fileName: string;
  url: string;
  kind: DocumentKind;
  sizeLabel: string | null;
  hasUrl: boolean;
  isError: boolean;
}) {
  const copy = getFallbackCopy({ kind, hasUrl, isError });

  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 px-6 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-lg border-hairline border-border-secondary bg-background-tertiary font-mono text-sm font-semibold text-foreground-secondary">
        {getKindLabel(kind)}
      </div>
      <div>
        <p className="text-sm font-semibold text-foreground">{copy.title}</p>
        <p className="mx-auto mt-1.5 max-w-sm text-xs leading-5 text-foreground-secondary">
          {copy.description}
        </p>
      </div>
      <div className="flex max-w-full items-center gap-2 rounded-md border-hairline border-border-secondary bg-background px-3 py-2">
        <span className="rounded-sm bg-background-tertiary px-1.5 py-0.5 font-mono text-2xs text-foreground-tertiary">
          {getKindLabel(kind)}
        </span>
        <span
          className="max-w-[240px] truncate text-xs font-medium text-foreground"
          title={fileName}
        >
          {fileName}
        </span>
        {sizeLabel && <span className="text-2xs text-foreground-tertiary">- {sizeLabel}</span>}
      </div>
      {hasUrl ? (
        <a href={url} download={fileName} target="_blank" rel="noreferrer">
          <Button variant="primary" size="lg" type="button" className="px-5">
            Tải xuống file
          </Button>
        </a>
      ) : (
        <Button variant="default" size="lg" type="button" disabled>
          Chưa thể tải xuống
        </Button>
      )}
    </div>
  );
}

export type { DocumentKind, ReviewDocument };
