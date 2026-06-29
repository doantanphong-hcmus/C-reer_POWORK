'use client';

import { ChangeEvent, DragEvent, FormEvent, useCallback, useEffect, useRef, useState } from 'react';
import { Button, Input } from '@/components/ui';
import { cn } from '@/lib/utils/cn';
import {
  ensureFileNameExtension,
  formatFileSize,
  getFileExtension,
  normalizeFileExtension,
} from '@/lib/utils/file';

export type UploadState = 'idle' | 'selected' | 'uploading' | 'success' | 'error';

export interface UploadMetadata {
  originalFileName: string;
  savedFileName: string;
  extension: string;
  fileSize: number;
  note?: string;
}

export interface UploaderProps {
  challengeId: string;
  maxSizeMB?: number;
  acceptedExtensions?: string[];
  onUpload?: (file: File, metadata: UploadMetadata) => Promise<void> | void;
  disabled?: boolean;
  isOpen?: boolean;
  onClose?: () => void;
  hasExistingSubmissions?: boolean;
}

interface SelectedUploadFile {
  file: File;
  extension: string;
  saveAsName: string;
  validationError: string | null;
}

const DEFAULT_MAX_SIZE_MB = 10;
const DEFAULT_ACCEPTED_EXTENSIONS = ['.zip', '.pdf'];
const DANGEROUS_FILE_NAME_CHARS = /[\/\\:*?"<>|]/;

const extensionToneStyles: Record<string, string> = {
  '.doc': 'border-info bg-info-bg text-info',
  '.docx': 'border-info bg-info-bg text-info',
  '.xls': 'border-success bg-success-bg text-success',
  '.xlsx': 'border-success bg-success-bg text-success',
  '.pdf': 'border-[rgba(245,158,11,0.35)] bg-warning-bg text-warning',
  '.png': 'border-[rgba(248,113,113,0.28)] bg-error-bg text-error',
  '.jpg': 'border-[rgba(248,113,113,0.28)] bg-error-bg text-error',
  '.jpeg': 'border-[rgba(248,113,113,0.28)] bg-error-bg text-error',
  '.mp3': 'border-[rgba(124,111,247,0.35)] bg-accent-bg text-accent',
  '.mp4': 'border-[rgba(124,111,247,0.35)] bg-accent-bg text-accent',
  '.zip': 'border-border-secondary bg-background-tertiary text-foreground-secondary',
  '.rar': 'border-border-secondary bg-background-tertiary text-foreground-secondary',
};

function getReadableExtensions(extensions: string[]): string {
  return extensions.join(' hoặc ');
}

function getExtensionBadgeClass(extension: string): string {
  return (
    extensionToneStyles[extension] ??
    'border-border-secondary bg-background-tertiary text-foreground-secondary'
  );
}

function validateSavedFileName(rawName: string, originalExtension: string): string | null {
  const fileName = rawName.trim();

  if (!fileName) {
    return 'Tên lưu không được để trống.';
  }

  if (DANGEROUS_FILE_NAME_CHARS.test(fileName)) {
    return 'Tên file không được chứa các ký tự / \\ : * ? " < > |.';
  }

  if (fileName.endsWith('.')) {
    return 'Tên file không được kết thúc bằng dấu chấm.';
  }

  const typedExtension = getFileExtension(fileName);
  if (typedExtension && typedExtension !== originalExtension) {
    return `Không thể đổi phần mở rộng ${originalExtension} thành ${typedExtension}.`;
  }

  return null;
}

export function Uploader({
  challengeId,
  maxSizeMB = DEFAULT_MAX_SIZE_MB,
  acceptedExtensions = DEFAULT_ACCEPTED_EXTENSIONS,
  onUpload,
  disabled = false,
  isOpen = true,
  onClose,
  hasExistingSubmissions = false,
}: UploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const [selectedFile, setSelectedFile] = useState<SelectedUploadFile | null>(null);
  const [uploadState, setUploadState] = useState<UploadState>('idle');
  const [message, setMessage] = useState<string | null>(null);
  const [note, setNote] = useState('');
  const [isDragging, setIsDragging] = useState(false);

  const normalizedExtensions = acceptedExtensions.map(normalizeFileExtension);
  const acceptedText = getReadableExtensions(normalizedExtensions);
  const maxSizeBytes = maxSizeMB * 1024 * 1024;
  const isBusy = uploadState === 'uploading';
  const nameError = selectedFile
    ? validateSavedFileName(selectedFile.saveAsName, selectedFile.extension)
    : null;
  const hasValidationError = Boolean(selectedFile?.validationError || nameError);
  const isUploadDisabled = disabled || isBusy || !selectedFile || hasValidationError;
  const modalTitle = hasExistingSubmissions ? 'Nộp phiên bản mới' : 'Nộp bài mới';

  const resetInput = useCallback(() => {
    if (inputRef.current) {
      inputRef.current.value = '';
    }
  }, []);

  const resetForm = useCallback(() => {
    setSelectedFile(null);
    setUploadState('idle');
    setMessage(null);
    setNote('');
    setIsDragging(false);
    resetInput();
  }, [resetInput]);

  const closeModal = useCallback(() => {
    if (isBusy) return;
    resetForm();
    onClose?.();
  }, [isBusy, onClose, resetForm]);

  useEffect(() => {
    if (!isOpen) return;
    window.setTimeout(() => dialogRef.current?.focus(), 0);
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return undefined;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        closeModal();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, closeModal]);

  if (!isOpen) {
    return null;
  }

  const validateFile = (file: File) => {
    const extension = getFileExtension(file.name);
    const hasAcceptedExtension = normalizedExtensions.includes(extension);

    if (!hasAcceptedExtension) {
      return {
        extension,
        error: `Chỉ chấp nhận file ${acceptedText}.`,
      };
    }

    if (file.size > maxSizeBytes) {
      return {
        extension,
        error: `Dung lượng file tối đa là ${maxSizeMB}MB.`,
      };
    }

    return {
      extension,
      error: null,
    };
  };

  const selectFile = (file?: File) => {
    if (!file || disabled || isBusy) return;

    const validation = validateFile(file);
    setSelectedFile({
      file,
      extension: validation.extension || getFileExtension(file.name),
      saveAsName: file.name,
      validationError: validation.error,
    });
    setUploadState(validation.error ? 'error' : 'selected');
    setMessage(validation.error);
    resetInput();
  };

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    selectFile(event.target.files?.[0]);
  };

  const handleDragOver = (event: DragEvent<HTMLLabelElement>) => {
    event.preventDefault();
    if (!disabled && !isBusy) {
      setIsDragging(true);
    }
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (event: DragEvent<HTMLLabelElement>) => {
    event.preventDefault();
    setIsDragging(false);
    selectFile(event.dataTransfer.files?.[0]);
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    setUploadState('idle');
    setMessage(null);
    resetInput();
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!selectedFile) {
      setUploadState('error');
      setMessage('Vui lòng chọn file trước khi nộp bài.');
      return;
    }

    if (isUploadDisabled) return;

    try {
      setUploadState('uploading');
      setMessage(null);

      const savedFileName = ensureFileNameExtension(
        selectedFile.saveAsName,
        selectedFile.extension
      );
      await onUpload?.(selectedFile.file, {
        originalFileName: selectedFile.file.name,
        savedFileName,
        extension: selectedFile.extension,
        fileSize: selectedFile.file.size,
        note: note.trim() || undefined,
      });

      resetForm();
      onClose?.();
    } catch (error) {
      setUploadState('error');
      setMessage(
        error instanceof Error ? error.message : 'Không thể nộp bài lúc này. Vui lòng thử lại.'
      );
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4 py-6"
      role="presentation"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          closeModal();
        }
      }}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="submission-uploader-title"
        tabIndex={-1}
        className="flex max-h-[calc(100vh-48px)] w-full max-w-2xl flex-col overflow-hidden rounded-lg border-hairline border-border-secondary bg-background-secondary shadow-2xl focus:outline-none"
      >
        <form className="flex min-h-0 flex-col" onSubmit={handleSubmit}>
          <div className="shrink-0 border-b-hairline border-border px-5 py-4">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2
                  id="submission-uploader-title"
                  className="text-2xl font-semibold text-foreground"
                >
                  {modalTitle}
                </h2>
                <p className="mt-1 text-xs text-foreground-secondary">
                  Mã challenge: <span className="font-mono text-accent">{challengeId}</span>
                </p>
              </div>
              <button
                type="button"
                className="rounded-md px-2 py-1 text-lg leading-none text-foreground-secondary transition-colors hover:bg-background-tertiary hover:text-foreground"
                onClick={closeModal}
                disabled={isBusy}
                aria-label="Đóng modal"
                title="Đóng"
              >
                ×
              </button>
            </div>
            <p className="mt-3 text-sm leading-6 text-foreground-secondary">
              Chọn file bài làm để nộp. Hệ thống sẽ kiểm tra định dạng, dung lượng và bảo mật trước
              khi gửi đến employer.
            </p>
          </div>

          <div className="min-h-0 flex-1 space-y-4 overflow-y-auto px-5 py-4">
            <section>
              <div className="flex flex-wrap items-center gap-2">
                {normalizedExtensions.map((extension) => (
                  <span
                    key={extension}
                    className={cn(
                      'rounded-pill border-hairline px-2.5 py-1 text-xs font-medium uppercase',
                      getExtensionBadgeClass(extension)
                    )}
                  >
                    {extension}
                  </span>
                ))}
                <span className="rounded-pill border-hairline border-border-secondary bg-background-tertiary px-2.5 py-1 text-xs text-foreground-secondary">
                  Tối đa {maxSizeMB}MB
                </span>
              </div>
            </section>

            <label
              className={cn(
                'flex min-h-32 cursor-pointer flex-col items-center justify-center rounded-lg border-hairline border-dashed px-4 py-6 text-center transition-colors',
                'border-border-secondary bg-background hover:border-accent',
                isDragging && 'border-accent bg-accent-bg',
                (disabled || isBusy) && 'cursor-not-allowed opacity-60'
              )}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              <input
                ref={inputRef}
                type="file"
                accept={normalizedExtensions.join(',')}
                className="sr-only"
                disabled={disabled || isBusy}
                onChange={handleInputChange}
              />
              <span className="text-md font-medium text-foreground">
                Kéo thả file vào đây hoặc bấm để chọn
              </span>
              <span className="mt-2 text-xs text-foreground-tertiary">
                Chọn file mới sẽ thay thế file hiện tại trong phiên nộp này.
              </span>
            </label>

            {message && (
              <p
                className="rounded-md border-hairline border-[rgba(248,113,113,0.25)] bg-error-bg px-3 py-2 text-sm text-error"
                aria-live="polite"
              >
                {message}
              </p>
            )}

            <section>
              <div className="mb-2 flex items-center justify-between">
                <h3 className="text-sm font-semibold text-foreground">File đã chọn</h3>
                <span className="text-xs text-foreground-tertiary">MVP hỗ trợ 1 file/lần nộp</span>
              </div>

              {!selectedFile && (
                <div className="rounded-lg border-hairline border-border bg-background px-3 py-4 text-sm text-foreground-secondary">
                  Chưa có file nào được chọn.
                </div>
              )}

              {selectedFile && (
                <div className="rounded-lg border-hairline border-border bg-background p-3">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span
                          className={cn(
                            'rounded-md border-hairline px-2 py-1 text-xs font-semibold uppercase',
                            getExtensionBadgeClass(selectedFile.extension)
                          )}
                        >
                          {selectedFile.extension || 'file'}
                        </span>
                        <p className="min-w-0 truncate text-sm font-medium text-foreground">
                          {selectedFile.file.name}
                        </p>
                      </div>
                      <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1 text-xs text-foreground-secondary">
                        <span>{formatFileSize(selectedFile.file.size)}</span>
                        <span>
                          {selectedFile.validationError || nameError
                            ? (selectedFile.validationError ?? nameError)
                            : 'Sẵn sàng nộp'}
                        </span>
                      </div>
                    </div>
                    <Button
                      type="button"
                      variant="danger"
                      size="sm"
                      onClick={handleRemoveFile}
                      disabled={isBusy}
                    >
                      Xóa
                    </Button>
                  </div>

                  <div className="mt-3">
                    <label className="mb-1 block text-xs font-medium text-foreground-secondary">
                      Lưu thành
                    </label>
                    <Input
                      value={selectedFile.saveAsName}
                      error={Boolean(nameError)}
                      disabled={isBusy}
                      onChange={(event) =>
                        setSelectedFile((currentFile) =>
                          currentFile
                            ? { ...currentFile, saveAsName: event.target.value }
                            : currentFile
                        )
                      }
                    />
                    {nameError && <p className="mt-1 text-xs text-error">{nameError}</p>}
                  </div>
                </div>
              )}
            </section>

            <section>
              <label className="mb-1 block text-xs font-medium text-foreground-secondary">
                Ghi chú cho reviewer
              </label>
              <textarea
                value={note}
                disabled={isBusy}
                onChange={(event) => setNote(event.target.value)}
                placeholder="Ví dụ: Em đã cập nhật phần responsive và sửa lỗi validation."
                className="min-h-20 w-full resize-none rounded-md border-hairline border-border-secondary bg-background px-3 py-2 text-sm text-foreground outline-none transition-colors placeholder:text-foreground-tertiary focus:border-accent disabled:opacity-60"
              />
            </section>
          </div>

          <div className="flex shrink-0 flex-col-reverse gap-2 border-t-hairline border-border px-5 py-4 sm:flex-row sm:justify-end">
            <Button
              type="button"
              variant="default"
              size="lg"
              onClick={closeModal}
              disabled={isBusy}
            >
              Hủy
            </Button>
            <Button type="submit" variant="primary" size="lg" disabled={isUploadDisabled}>
              {isBusy ? 'Đang nộp...' : 'Nộp bài'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
