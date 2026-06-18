'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/hooks/useAuth';
import { useCreateChallenge } from '@/lib/hooks/useChallenges';
import { RubricBuilder } from '@/components/rubric';
import { Input, Button } from '@/components/ui';
import { isRubricValid, emptyCriteria } from '@/lib/utils/rubric';
import type { RubricCriteriaInput } from '@/lib/types';

export default function CreateChallengePage() {
  const router = useRouter();
  const { user } = useAuth();
  const createChallenge = useCreateChallenge();

  const [title, setTitle] = useState('');
  const [industry, setIndustry] = useState('');
  const [deadline, setDeadline] = useState('');
  const [description, setDescription] = useState('');
  const [criteria, setCriteria] = useState<RubricCriteriaInput[]>([emptyCriteria()]);
  const [error, setError] = useState('');

  // Chỉ Employer mới được tạo thử thách.
  if (user && user.role !== 'Employer') {
    return (
      <div className="mx-auto max-w-2xl">
        <div className="card text-center text-foreground-secondary">
          Chỉ Nhà tuyển dụng mới có thể tạo thử thách.
        </div>
      </div>
    );
  }

  const fieldsFilled = title.trim() && industry.trim() && deadline.trim() && description.trim();
  const rubricOk = isRubricValid(criteria);
  const canSubmit = Boolean(fieldsFilled) && rubricOk && !createChallenge.isPending;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!canSubmit) return;
    try {
      await createChallenge.mutateAsync({
        title: title.trim(),
        description: description.trim(),
        industry: industry.trim(),
        deadline: new Date(deadline).toISOString(),
        rubrics: criteria,
      });
      router.push('/challenges');
    } catch {
      setError('Tạo thử thách thất bại. Vui lòng thử lại.');
    }
  };

  return (
    <div className="mx-auto max-w-3xl">
      <h1 className="text-3xl font-semibold text-foreground">Tạo thử thách mới</h1>
      <p className="mt-1 text-base text-foreground-secondary">
        Định nghĩa đề bài và rubric chấm điểm cho ứng viên.
      </p>

      <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-5">
        <div className="card flex flex-col gap-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-foreground">Tiêu đề</label>
            <Input
              placeholder="VD: Tối ưu thuật toán xử lý bản đồ"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-medium text-foreground">Ngành</label>
              <Input
                placeholder="VD: Công nghệ thông tin"
                value={industry}
                onChange={(e) => setIndustry(e.target.value)}
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-foreground">Hạn chót</label>
              <Input
                type="datetime-local"
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
              />
            </div>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-foreground">Mô tả</label>
            <textarea
              rows={5}
              placeholder="Mô tả chi tiết yêu cầu của thử thách..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full rounded-md border-hairline border-border-secondary bg-background-tertiary px-[11px] py-[7px] text-xs text-foreground placeholder:text-foreground-tertiary transition-colors focus:border-accent focus:outline-none"
            />
          </div>
        </div>

        <div className="card flex flex-col gap-3">
          <div>
            <h2 className="text-md font-medium text-foreground">Rubric chấm điểm</h2>
            <p className="text-sm text-foreground-secondary">
              Tổng trọng số các tiêu chí phải bằng 100%.
            </p>
          </div>
          <RubricBuilder value={criteria} onChange={setCriteria} />
        </div>

        {error && (
          <div className="rounded-lg border border-error/30 bg-error-bg px-4 py-3 text-sm text-error">
            {error}
          </div>
        )}

        <div className="flex items-center justify-end gap-3">
          <Button type="button" variant="default" onClick={() => router.back()}>
            Huỷ
          </Button>
          <Button type="submit" variant="accent" disabled={!canSubmit}>
            {createChallenge.isPending ? 'Đang tạo...' : 'Tạo thử thách'}
          </Button>
        </div>
      </form>
    </div>
  );
}
