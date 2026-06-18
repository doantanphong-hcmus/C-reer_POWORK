'use client';

import { Input, Button } from '@/components/ui';
import { cn } from '@/lib/utils/cn';
import type { RubricCriteriaInput } from '@/lib/types';
import { TOTAL_WEIGHT, getTotalWeight, emptyCriteria } from '@/lib/utils/rubric';

interface RubricBuilderProps {
  value: RubricCriteriaInput[];
  onChange: (criteria: RubricCriteriaInput[]) => void;
}

/**
 * Component dựng rubric chấm điểm: thêm/xoá tiêu chí và tính tổng trọng số
 * real-time. Là component "controlled" — state thật do component cha giữ qua
 * value/onChange, nên dễ ghép với react-hook-form hoặc state thường.
 *
 * Quy ước: tổng weight (%) của tất cả tiêu chí phải đúng 100% thì rubric mới hợp lệ.
 */
export function RubricBuilder({ value, onChange }: RubricBuilderProps) {
  const total = getTotalWeight(value);
  const isComplete = total === TOTAL_WEIGHT;

  const updateRow = (index: number, patch: Partial<RubricCriteriaInput>) => {
    onChange(value.map((row, i) => (i === index ? { ...row, ...patch } : row)));
  };

  const addRow = () => onChange([...value, emptyCriteria()]);

  const removeRow = (index: number) => onChange(value.filter((_, i) => i !== index));

  return (
    <div className="flex flex-col gap-3">
      {/* Header cột */}
      <div className="hidden grid-cols-[1fr_96px_96px_40px] gap-2 px-1 text-2xs font-medium uppercase tracking-wide text-foreground-tertiary sm:grid">
        <span>Tiêu chí</span>
        <span>Trọng số (%)</span>
        <span>Điểm tối đa</span>
        <span />
      </div>

      {value.length === 0 && (
        <p className="rounded-md border-hairline border-border-secondary bg-background-tertiary px-3 py-4 text-center text-sm text-foreground-secondary">
          Chưa có tiêu chí nào. Nhấn “Thêm tiêu chí” để bắt đầu.
        </p>
      )}

      {value.map((row, index) => (
        <div
          key={index}
          className="grid grid-cols-1 gap-2 sm:grid-cols-[1fr_96px_96px_40px] sm:items-center"
        >
          <Input
            placeholder="VD: Chất lượng code"
            value={row.criteria_name}
            onChange={(e) => updateRow(index, { criteria_name: e.target.value })}
          />
          <Input
            type="number"
            min={0}
            max={100}
            placeholder="%"
            value={row.weight}
            onChange={(e) => updateRow(index, { weight: Number(e.target.value) })}
          />
          <Input
            type="number"
            min={1}
            placeholder="điểm"
            value={row.max_score}
            onChange={(e) => updateRow(index, { max_score: Number(e.target.value) })}
          />
          <Button
            type="button"
            variant="danger"
            size="sm"
            onClick={() => removeRow(index)}
            aria-label="Xoá tiêu chí"
            className="justify-self-start sm:justify-self-center"
          >
            ✕
          </Button>
        </div>
      ))}

      <div className="flex items-center justify-between">
        <Button type="button" variant="default" size="sm" onClick={addRow}>
          + Thêm tiêu chí
        </Button>

        {/* Tổng trọng số real-time */}
        <div className={cn('text-sm font-medium', isComplete ? 'text-success' : 'text-warning')}>
          Tổng trọng số: {total}% / {TOTAL_WEIGHT}%
          {!isComplete && (
            <span className="ml-1 text-foreground-secondary">
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
