export function formatFileSize(bytes: number): string {
  if (!Number.isFinite(bytes) || bytes < 0) {
    return 'Không rõ dung lượng';
  }

  if (bytes === 0) {
    return '0 B';
  }

  const units = ['B', 'KB', 'MB', 'GB'];
  const unitIndex = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), units.length - 1);
  const value = bytes / 1024 ** unitIndex;
  const formatter = new Intl.NumberFormat('vi-VN', {
    maximumFractionDigits: value >= 10 || unitIndex === 0 ? 0 : 1,
  });

  return `${formatter.format(value)} ${units[unitIndex]}`;
}

export function normalizeFileExtension(extension: string): string {
  const trimmedExtension = extension.trim().toLowerCase();
  return trimmedExtension.startsWith('.') ? trimmedExtension : `.${trimmedExtension}`;
}

export function getFileExtension(fileName: string): string {
  const trimmedFileName = fileName.trim().toLowerCase();
  const extensionStart = trimmedFileName.lastIndexOf('.');

  if (extensionStart <= 0 || extensionStart === trimmedFileName.length - 1) {
    return '';
  }

  return trimmedFileName.slice(extensionStart);
}

export function ensureFileNameExtension(fileName: string, extension: string): string {
  const trimmedFileName = fileName.trim();
  const normalizedExtension = normalizeFileExtension(extension);
  const currentExtension = getFileExtension(trimmedFileName);

  if (!currentExtension) {
    return `${trimmedFileName}${normalizedExtension}`;
  }

  return trimmedFileName;
}
