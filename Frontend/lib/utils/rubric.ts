import type { RubricCriteriaInput } from '@/lib/types';

/** Tổng trọng số của một rubric hợp lệ phải đúng bằng 100%. */
export const TOTAL_WEIGHT = 100;

/** Tổng trọng số hiện tại (tính real-time khi người dùng nhập). */
export function getTotalWeight(criteria: RubricCriteriaInput[]): number {
  return criteria.reduce((sum, c) => sum + (Number(c.weight) || 0), 0);
}

/** Rubric hợp lệ: có tiêu chí, mọi tiêu chí có tên + max_score > 0, tổng weight = 100. */
export function isRubricValid(criteria: RubricCriteriaInput[]): boolean {
  if (criteria.length === 0) return false;
  const allValid = criteria.every(
    (c) => c.criteria_name.trim().length > 0 && Number(c.max_score) > 0 && Number(c.weight) >= 0
  );
  return allValid && getTotalWeight(criteria) === TOTAL_WEIGHT;
}

/** Một dòng tiêu chí rỗng mặc định. */
export function emptyCriteria(): RubricCriteriaInput {
  return { criteria_name: '', weight: 0, max_score: 10 };
}
