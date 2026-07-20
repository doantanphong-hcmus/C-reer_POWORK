'use client';

import { Input, Button } from '@/components/ui';
import { cn } from '@/lib/utils/cn';
import type { RubricCriteriaInput } from '@/lib/types';
import { TOTAL_WEIGHT, getTotalWeight, emptyCriteria } from '@/lib/utils/rubric';

interface RubricBuilderProps {
  value: RubricCriteriaInput[];
  onChange: (criteria: RubricCriteriaInput[]) => void;
}

export function RubricBuilder({ value, onChange }: RubricBuilderProps) {
  const total = getTotalWeight(value);
  const isComplete = total === TOTAL_WEIGHT;

  const updateRow = (index: number, patch: Partial<RubricCriteriaInput>) => {
    onChange(value.map((row, i) => (i === index ? { ...row, ...patch } : row)));
  };

  const parseNumber = (rawValue: string, min: number, max?: number) => {
    const nextValue = Number(rawValue);
    if (!Number.isFinite(nextValue)) return min;
    const lowerBounded = Math.max(min, nextValue);
    return typeof max === 'number' ? Math.min(max, lowerBounded) : lowerBounded;
  };

  const addRow = () => {
    const remainingWeight = Math.max(TOTAL_WEIGHT - total, 0);
    onChange([...value, { ...emptyCriteria(), weight: remainingWeight }]);
  };

  const removeRow = (index: number) => {
    if (value.length <= 1) {
      onChange([emptyCriteria()]);
      return;
    }
    onChange(value.filter((_, i) => i !== index));
  };

  return (
    <div className="flex flex-col gap-3">
      <div className="hidden grid-cols-[1fr_80px_80px_36px] gap-2.5 px-1.5 text-xs font-semibold uppercase tracking-wide text-foreground-tertiary sm:grid">
        <span>Tiêu chí</span>
        <span className="text-center">Tỷ lệ (%)</span>
        <span className="text-center">Điểm max</span>
        <span />
      </div>

      {value.length === 0 && (
        <p className="rounded-md border-hairline border-border-secondary bg-background-tertiary px-3 py-5 text-center text-sm text-foreground-secondary">
          Chưa có tiêu chí nào. Nhấn “Thêm tiêu chí” để bắt đầu.
        </p>
      )}

      {value.map((row, index) => (
        <div
          key={index}
          className="grid grid-cols-1 gap-2.5 sm:grid-cols-[1fr_80px_80px_36px] sm:items-center"
        >
          <div className="text-sm [&_input]:h-10 [&_input]:text-sm">
            <Input
              placeholder="VD: Chất lượng code và tối ưu thuật toán..."
              value={row.criteria_name}
              onChange={(e) => updateRow(index, { criteria_name: e.target.value })}
            />
          </div>

          <div className="text-sm [&_input]:h-10 [&_input]:text-center [&_input]:text-sm">
            <Input
              type="number"
              min={0}
              max={100}
              placeholder="%"
              value={row.weight}
              onChange={(e) => updateRow(index, { weight: parseNumber(e.target.value, 0, 100) })}
            />
          </div>

          <div className="text-sm [&_input]:h-10 [&_input]:text-center [&_input]:text-sm">
            <Input
              type="number"
              min={1}
              placeholder="điểm"
              value={row.max_score}
              onChange={(e) => updateRow(index, { max_score: parseNumber(e.target.value, 1) })}
            />
          </div>

          <Button
            type="button"
            variant="danger"
            onClick={() => removeRow(index)}
            aria-label={`Xoá tiêu chí ${index + 1}`}
            title="Xoá tiêu chí"
            className="flex h-10 w-9 items-center justify-center justify-self-start p-0 text-xs sm:justify-self-center"
          >
            ✕
          </Button>
        </div>
      ))}

      <div className="mt-1 flex items-center justify-between">
        <Button
          type="button"
          variant="default"
          className="h-10 px-4 text-sm font-medium"
          onClick={addRow}
        >
          + Thêm tiêu chí
        </Button>

        <div
          aria-live="polite"
          className={cn('text-sm font-semibold', isComplete ? 'text-success' : 'text-warning')}
        >
          Tổng trọng số: {total}% / {TOTAL_WEIGHT}%
          {!isComplete && (
            <span className="ml-1 text-xs font-normal text-foreground-secondary">
              (
              {total < TOTAL_WEIGHT
                ? `thiếu ${TOTAL_WEIGHT - total}%`
                : `dư ${total - TOTAL_WEIGHT}%`}
              )
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
