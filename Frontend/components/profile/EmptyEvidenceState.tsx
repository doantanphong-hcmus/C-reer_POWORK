import Link from 'next/link';

export function EmptyEvidenceState() {
  return (
    <div className="rounded-lg border-hairline border-dashed border-border-secondary bg-background-secondary p-6 text-center">
      <p className="text-sm font-medium text-foreground">Bạn chưa có bằng chứng năng lực nào.</p>
      <p className="mx-auto mt-2 max-w-md text-sm text-foreground-secondary">
        Hãy hoàn thành Challenge đầu tiên để xây dựng Dynamic Profile.
      </p>
      <Link href="/challenges" className="btn-base mt-4 inline-flex">
        Xem Challenge
      </Link>
    </div>
  );
}
