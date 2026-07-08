'use client';

import { useMemo, useState } from 'react';
import { Button } from '@/components/ui';
import { cn } from '@/lib/utils/cn';
import {
  MAX_WEIGHTED_SCORE,
  getRawTotalScore,
  getWeightedTotalScore,
  type RubricScoreInput,
} from '@/lib/utils/rubric';
import type { EvaluateRequest, EvaluationItemInput, RubricCriteria } from '@/lib/types';

interface RubricScoringFormProps {
  criteria: RubricCriteria[];
  onSubmit?: (payload: EvaluateRequest) => void | Promise<void>;
  isSubmitting?: boolean;
  readOnly?: boolean;
  disabledReason?: string;
  initialEvaluations?: EvaluationItemInput[];
  initialGeneralComment?: string;
  submitLabel?: string;
  className?: string;
}

interface ScoreRow {
  score: number;
  comment: string;
}

interface ScoreDraftRow extends Partial<ScoreRow> {
  scoreText?: string;
}

interface QuickScore {
  label: string;
  value: number;
  hint: string;
}

const EMPTY_EVALUATIONS: EvaluationItemInput[] = [];

function getInputStep(maxScore: number): number {
  return maxScore <= 10 ? 0.5 : 1;
}

function clampScore(score: number, maxScore: number): number {
  if (!Number.isFinite(score)) return 0;

  const safeMax = Math.max(Number(maxScore) || 0, 0);
  const clamped = Math.min(Math.max(score, 0), safeMax);
  return Math.round(clamped * 10) / 10;
}

function roundToStep(value: number, step: number, maxScore: number): number {
  if (step <= 0) return clampScore(value, maxScore);
  return clampScore(Math.round(value / step) * step, maxScore);
}

function formatScore(score: number): string {
  return Number.isInteger(score) ? String(score) : score.toFixed(1);
}

function parseScoreText(value: string): number | null {
  const normalized = value.trim().replace(',', '.');
  if (!normalized) return null;

  const parsed = Number(normalized);
  return Number.isFinite(parsed) ? parsed : null;
}

function isScoreTextAllowed(value: string): boolean {
  return /^\d{0,3}([.,]\d{0,1})?$/.test(value.trim());
}

function getScoreRatio(score: number, maxScore: number): number {
  if (maxScore <= 0) return 0;
  return Math.min(Math.max(score / maxScore, 0), 1);
}

function getScoreMood(score: number, maxScore: number) {
  const ratio = getScoreRatio(score, maxScore);

  if (score <= 0) {
    return {
      label: 'Chưa chấm',
      bar: '#5e5d58',
      badge: 'border-border-secondary bg-background-tertiary text-foreground-tertiary',
      glow: 'shadow-black/10',
    };
  }

  if (ratio < 0.4) {
    return {
      label: 'Cần xem kỹ',
      bar: '#f87171',
      badge: 'border-[rgba(248,113,113,0.32)] bg-error-bg text-error',
      glow: 'shadow-[0_0_28px_rgba(248,113,113,0.08)]',
    };
  }

  if (ratio < 0.7) {
    return {
      label: 'Đạt cơ bản',
      bar: '#f59e0b',
      badge: 'border-[rgba(245,158,11,0.32)] bg-warning-bg text-warning',
      glow: 'shadow-[0_0_28px_rgba(245,158,11,0.08)]',
    };
  }

  if (ratio < 0.9) {
    return {
      label: 'Tốt',
      bar: '#60a5fa',
      badge: 'border-[rgba(96,165,250,0.32)] bg-info-bg text-info',
      glow: 'shadow-[0_0_28px_rgba(96,165,250,0.08)]',
    };
  }

  return {
    label: 'Xuất sắc',
    bar: '#22c55e',
    badge: 'border-[rgba(34,197,94,0.32)] bg-success-bg text-success',
    glow: 'shadow-[0_0_28px_rgba(34,197,94,0.08)]',
  };
}

function getTotalMood(percent: number): string {
  if (percent <= 0) return 'Chưa có điểm';
  if (percent < 45) return 'Cần cân nhắc';
  if (percent < 70) return 'Có tín hiệu';
  if (percent < 85) return 'Ứng viên mạnh';
  return 'Rất đáng unlock';
}

function getQuickScores(criterion: RubricCriteria): QuickScore[] {
  const step = getInputStep(criterion.max_score);
  const rawScores: QuickScore[] = [
    { label: '0', value: 0, hint: 'Chưa đạt' },
    { label: 'Cơ bản', value: criterion.max_score * 0.4, hint: 'Có phần đúng' },
    { label: 'Khá', value: criterion.max_score * 0.7, hint: 'Đạt yêu cầu' },
    { label: 'Tốt', value: criterion.max_score * 0.9, hint: 'Nổi bật' },
    { label: 'Max', value: criterion.max_score, hint: 'Trọn điểm' },
  ];
  const seen = new Set<number>();

  return rawScores
    .map((item) => ({ ...item, value: roundToStep(item.value, step, criterion.max_score) }))
    .filter((item) => {
      if (seen.has(item.value)) return false;
      seen.add(item.value);
      return true;
    });
}

function buildInitialRows(
  criteria: RubricCriteria[],
  initialEvaluations: EvaluationItemInput[] = []
): Record<string, ScoreRow> {
  const initialById = new Map(initialEvaluations.map((item) => [item.criteria_id, item]));

  return Object.fromEntries(
    criteria.map((criterion) => {
      const initial = initialById.get(criterion.criteria_id);

      return [
        criterion.criteria_id,
        {
          score: clampScore(initial?.score ?? 0, criterion.max_score),
          comment: initial?.comment ?? '',
        },
      ];
    })
  );
}

export function RubricScoringForm({
  criteria,
  onSubmit,
  isSubmitting = false,
  readOnly = false,
  disabledReason,
  initialEvaluations = EMPTY_EVALUATIONS,
  initialGeneralComment = '',
  submitLabel = 'Hoàn tất chấm điểm',
  className,
}: RubricScoringFormProps) {
  const initialRows = useMemo(
    () => buildInitialRows(criteria, initialEvaluations),
    [criteria, initialEvaluations]
  );
  const [draftRows, setDraftRows] = useState<Record<string, ScoreDraftRow>>({});
  const [generalCommentDraft, setGeneralCommentDraft] = useState<string | null>(null);
  const [validationMessage, setValidationMessage] = useState<string | null>(null);

  const rows = useMemo(
    () =>
      Object.fromEntries(
        criteria.map((criterion) => {
          const initial = initialRows[criterion.criteria_id] ?? { score: 0, comment: '' };
          const draft = draftRows[criterion.criteria_id] ?? {};

          return [
            criterion.criteria_id,
            {
              score: clampScore(
                typeof draft.score === 'number' ? draft.score : initial.score,
                criterion.max_score
              ),
              comment: typeof draft.comment === 'string' ? draft.comment : initial.comment,
            },
          ];
        })
      ),
    [criteria, draftRows, initialRows]
  );
  const generalComment = generalCommentDraft ?? initialGeneralComment;

  const scoreInputs: RubricScoreInput[] = useMemo(
    () =>
      criteria.map((criterion) => ({
        criteria_id: criterion.criteria_id,
        weight: criterion.weight,
        max_score: criterion.max_score,
        score: rows[criterion.criteria_id]?.score ?? 0,
      })),
    [criteria, rows]
  );

  const weightedTotal = getWeightedTotalScore(scoreInputs);
  const rawTotal = getRawTotalScore(scoreInputs);
  const rawMax = useMemo(
    () => criteria.reduce((sum, criterion) => sum + (Number(criterion.max_score) || 0), 0),
    [criteria]
  );
  const percent = MAX_WEIGHTED_SCORE > 0 ? (weightedTotal / MAX_WEIGHTED_SCORE) * 100 : 0;
  const completedCriteria = criteria.filter(
    (criterion) => (rows[criterion.criteria_id]?.score ?? 0) > 0
  ).length;
  const controlsDisabled = readOnly || isSubmitting;
  const hasNonDefaultMaxScore = criteria.some((criterion) => criterion.max_score !== 10);

  const updateDraftRow = (criterion: RubricCriteria, patch: ScoreDraftRow) => {
    if (readOnly || isSubmitting) return;

    setValidationMessage(null);
    const current = rows[criterion.criteria_id] ?? { score: 0, comment: '' };

    setDraftRows((prev) => ({
      ...prev,
      [criterion.criteria_id]: {
        ...current,
        ...prev[criterion.criteria_id],
        ...patch,
      },
    }));
  };

  const setCriterionScore = (
    criterion: RubricCriteria,
    score: number,
    scoreText = formatScore(score)
  ) => {
    const safeScore = clampScore(score, criterion.max_score);
    updateDraftRow(criterion, {
      score: safeScore,
      scoreText,
    });
  };

  const handleScoreTextChange = (criterion: RubricCriteria, value: string) => {
    if (!isScoreTextAllowed(value)) return;

    if (value.trim() === '') {
      updateDraftRow(criterion, { score: 0, scoreText: '' });
      return;
    }

    const parsed = parseScoreText(value);
    if (parsed === null) {
      updateDraftRow(criterion, { scoreText: value });
      return;
    }

    if (parsed > criterion.max_score) {
      setValidationMessage(
        `Điểm tối đa của "${criterion.criteria_name}" là ${formatScore(criterion.max_score)}.`
      );
      setCriterionScore(criterion, criterion.max_score);
      return;
    }

    updateDraftRow(criterion, {
      score: clampScore(parsed, criterion.max_score),
      scoreText: value,
    });
  };

  const commitScoreText = (criterion: RubricCriteria) => {
    const draftText = draftRows[criterion.criteria_id]?.scoreText;
    if (draftText === undefined) return;

    const parsed = parseScoreText(draftText);
    const safeScore = clampScore(parsed ?? 0, criterion.max_score);
    setCriterionScore(criterion, safeScore, formatScore(safeScore));
  };

  const updateComment = (criterion: RubricCriteria, comment: string) => {
    updateDraftRow(criterion, { comment });
  };

  const handleSubmit = async () => {
    if (readOnly) return;

    const evaluations: EvaluationItemInput[] = criteria.map((criterion) => {
      const row = rows[criterion.criteria_id] ?? { score: 0, comment: '' };

      return {
        criteria_id: criterion.criteria_id,
        score: clampScore(row.score, criterion.max_score),
        comment: row.comment.trim() || undefined,
      };
    });

    const invalidCriterion = criteria.find((criterion) => {
      const row = rows[criterion.criteria_id];
      return !row || row.score < 0 || row.score > criterion.max_score;
    });

    if (invalidCriterion) {
      setValidationMessage(`Điểm của "${invalidCriterion.criteria_name}" vượt quá giới hạn.`);
      return;
    }

    await onSubmit?.({
      evaluations,
      general_comment: generalComment.trim() || undefined,
    });
  };

  if (criteria.length === 0) {
    return (
      <div className="rounded-lg border-hairline border-border-secondary bg-background p-4 text-sm text-foreground-secondary">
        Challenge này chưa có rubric để chấm điểm.
      </div>
    );
  }

  return (
    <div className={cn('flex h-full min-h-0 flex-col', className)}>
      <div className="min-h-0 flex-1 space-y-4 overflow-y-auto pr-1">
        {readOnly && disabledReason && (
          <div className="rounded-lg border-hairline border-[rgba(96,165,250,0.3)] bg-info-bg px-4 py-3 text-xs leading-5 text-info">
            {disabledReason}
          </div>
        )}

        {criteria.map((criterion, index) => {
          const row = rows[criterion.criteria_id] ?? { score: 0, comment: '' };
          const ratio = getScoreRatio(row.score, criterion.max_score);
          const step = getInputStep(criterion.max_score);
          const mood = getScoreMood(row.score, criterion.max_score);
          const quickScores = getQuickScores(criterion);
          const scoreText = draftRows[criterion.criteria_id]?.scoreText ?? formatScore(row.score);
          const trackBackground = `linear-gradient(90deg, ${mood.bar} 0%, ${mood.bar} ${
            ratio * 100
          }%, rgba(255,255,255,0.09) ${ratio * 100}%, rgba(255,255,255,0.09) 100%)`;

          return (
            <div
              key={criterion.criteria_id}
              className={cn(
                'overflow-hidden rounded-lg border-hairline border-border-secondary bg-background shadow-sm transition-shadow',
                mood.glow
              )}
            >
              <div className="flex items-center justify-between gap-3 border-b-hairline border-border px-4 py-3.5">
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md border-hairline border-border-secondary bg-background-tertiary font-mono text-xs text-foreground-secondary">
                      {index + 1}
                    </span>
                    <h3 className="min-w-0 truncate text-lg font-semibold text-foreground">
                      {criterion.criteria_name}
                    </h3>
                  </div>
                </div>
                <div className="flex shrink-0 flex-wrap items-center justify-end gap-2">
                  <span className="rounded-pill border-hairline border-[rgba(124,111,247,0.4)] bg-accent-bg px-3.5 py-1.5 font-mono text-md font-semibold text-accent">
                    {criterion.weight}%
                  </span>
                  {hasNonDefaultMaxScore && criterion.max_score !== 10 && (
                    <span className="rounded-pill border-hairline border-border-secondary bg-background-tertiary px-3 py-1.5 font-mono text-xs font-medium text-foreground-secondary">
                      Max {formatScore(criterion.max_score)}
                    </span>
                  )}
                  <span
                    className={cn(
                      'rounded-pill border-hairline px-3.5 py-1.5 text-sm font-semibold',
                      mood.badge
                    )}
                  >
                    {mood.label}
                  </span>
                </div>
              </div>

              <div className="space-y-4 p-4">
                <div className="grid gap-4 xl:grid-cols-[132px_minmax(0,1fr)]">
                  <div className="rounded-lg border-hairline border-border bg-background-secondary p-3">
                    <div className="flex items-end gap-1">
                      <input
                        type="text"
                        inputMode="decimal"
                        value={scoreText}
                        onFocus={(event) => event.currentTarget.select()}
                        onChange={(event) =>
                          handleScoreTextChange(criterion, event.currentTarget.value)
                        }
                        onBlur={() => commitScoreText(criterion)}
                        disabled={controlsDisabled}
                        aria-label={`Nhập điểm cho tiêu chí ${criterion.criteria_name}`}
                        className="h-14 w-full rounded-md border-hairline border-border-secondary bg-background px-2 text-center font-mono text-4xl font-semibold text-foreground outline-none transition-colors placeholder:text-foreground-tertiary focus:border-accent disabled:opacity-60"
                      />
                      <span className="pb-2 font-mono text-sm text-foreground-tertiary">
                        /{formatScore(criterion.max_score)}
                      </span>
                    </div>
                    <div className="mt-3 grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        disabled={controlsDisabled || row.score <= 0}
                        onClick={() => setCriterionScore(criterion, row.score - step)}
                        className="h-10 rounded-md border-hairline border-border-secondary bg-background-tertiary font-mono text-2xl text-foreground transition-colors hover:bg-background disabled:cursor-not-allowed disabled:opacity-40"
                        aria-label={`Giảm điểm ${criterion.criteria_name}`}
                      >
                        -
                      </button>
                      <button
                        type="button"
                        disabled={controlsDisabled || row.score >= criterion.max_score}
                        onClick={() => setCriterionScore(criterion, row.score + step)}
                        className="h-10 rounded-md border-hairline border-border-secondary bg-background-tertiary font-mono text-2xl text-foreground transition-colors hover:bg-background disabled:cursor-not-allowed disabled:opacity-40"
                        aria-label={`Tăng điểm ${criterion.criteria_name}`}
                      >
                        +
                      </button>
                    </div>
                  </div>

                  <div className="min-w-0 space-y-3">
                    <div className="rounded-lg border-hairline border-border bg-background-secondary px-3 py-4">
                      <input
                        type="range"
                        min={0}
                        max={criterion.max_score}
                        step={step}
                        value={row.score}
                        onChange={(event) =>
                          setCriterionScore(
                            criterion,
                            Number(event.currentTarget.value),
                            formatScore(Number(event.currentTarget.value))
                          )
                        }
                        disabled={controlsDisabled}
                        aria-label={`Điểm cho tiêu chí ${criterion.criteria_name}`}
                        className="h-4 w-full cursor-pointer appearance-none rounded-pill disabled:cursor-not-allowed disabled:opacity-60 [&::-moz-range-thumb]:h-5 [&::-moz-range-thumb]:w-5 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-background [&::-moz-range-thumb]:bg-foreground [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-background [&::-webkit-slider-thumb]:bg-foreground"
                        style={{ background: trackBackground }}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-2 sm:grid-cols-5">
                      {quickScores.map((quickScore) => {
                        const active = Math.abs(row.score - quickScore.value) < 0.01;

                        return (
                          <button
                            key={`${criterion.criteria_id}-${quickScore.label}`}
                            type="button"
                            disabled={controlsDisabled}
                            onClick={() => setCriterionScore(criterion, quickScore.value)}
                            title={quickScore.hint}
                            className={cn(
                              'min-h-10 rounded-lg border-hairline px-2 py-2 text-center transition-colors disabled:cursor-not-allowed disabled:opacity-50',
                              active
                                ? 'border-[rgba(124,111,247,0.45)] bg-accent-bg text-accent'
                                : 'border-border bg-background-tertiary text-foreground-secondary hover:border-border-secondary hover:text-foreground'
                            )}
                          >
                            <span className="block text-sm font-semibold">{quickScore.label}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>

                <input
                  type="text"
                  value={row.comment}
                  onChange={(event) => updateComment(criterion, event.currentTarget.value)}
                  disabled={controlsDisabled}
                  placeholder="Nhận xét nhanh cho tiêu chí này (tuỳ chọn)..."
                  className="w-full rounded-md border-hairline border-border-secondary bg-background-tertiary px-[11px] py-[9px] text-xs text-foreground placeholder:text-foreground-tertiary outline-none transition-colors focus:border-accent disabled:opacity-60"
                />
              </div>
            </div>
          );
        })}

        <div className="rounded-lg border-hairline border-border-secondary bg-background p-4">
          <label className="text-md font-semibold text-foreground">Nhận xét tổng quan</label>
          <textarea
            value={generalComment}
            onChange={(event) => {
              setValidationMessage(null);
              setGeneralCommentDraft(event.currentTarget.value);
            }}
            disabled={controlsDisabled}
            placeholder="Đánh giá chung về bài nộp..."
            className="mt-2 h-24 w-full resize-none rounded-md border-hairline border-border-secondary bg-background-tertiary px-[11px] py-2 text-xs leading-5 text-foreground placeholder:text-foreground-tertiary outline-none transition-colors focus:border-accent disabled:opacity-60"
          />
        </div>
      </div>

      <div className="mt-3 shrink-0 border-t-hairline border-border-secondary pt-3">
        <div className="mb-3 grid grid-cols-[74px_minmax(0,1fr)] gap-3">
          <div
            className="flex h-[74px] w-[74px] items-center justify-center rounded-full p-1"
            style={{
              background: `conic-gradient(#22c55e ${Math.min(
                Math.max(percent, 0),
                100
              )}%, rgba(255,255,255,0.08) 0)`,
            }}
            aria-hidden
          >
            <div className="flex h-full w-full flex-col items-center justify-center rounded-full bg-background-secondary">
              <span className="font-mono text-lg font-bold text-foreground">
                {weightedTotal.toFixed(0)}
              </span>
              <span className="text-2xs text-foreground-tertiary">/100</span>
            </div>
          </div>

          <div className="min-w-0 rounded-lg border-hairline border-border bg-background px-3 py-2">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="text-2xs uppercase tracking-wide text-foreground-tertiary">
                  Tổng điểm
                </p>
                <p
                  aria-live="polite"
                  className="mt-0.5 font-mono text-2xl font-bold text-foreground"
                >
                  {weightedTotal.toFixed(1)}
                  <span className="text-sm font-normal text-foreground-tertiary">
                    {' '}
                    / {MAX_WEIGHTED_SCORE}
                  </span>
                </p>
              </div>
              <span className="shrink-0 rounded-pill border-hairline border-[rgba(34,197,94,0.3)] bg-success-bg px-2.5 py-1 text-2xs font-medium text-success">
                {getTotalMood(percent)}
              </span>
            </div>

            <div className="mt-3 grid grid-cols-2 gap-2 text-2xs text-foreground-tertiary sm:grid-cols-3">
              <span>
                Điểm thô: {formatScore(rawTotal)}/{formatScore(rawMax)}
              </span>
              <span>
                Đã chấm: {completedCriteria}/{criteria.length}
              </span>
              <span className="hidden sm:inline">Tiến độ: {percent.toFixed(0)}%</span>
            </div>
          </div>
        </div>

        {validationMessage && (
          <p className="mb-3 rounded-md border-hairline border-[rgba(248,113,113,0.35)] bg-error-bg px-3 py-2 text-xs text-error">
            {validationMessage}
          </p>
        )}

        <Button
          type="button"
          variant="primary"
          size="lg"
          onClick={handleSubmit}
          disabled={controlsDisabled}
          className="w-full"
        >
          {isSubmitting ? 'Đang lưu điểm...' : submitLabel}
        </Button>
      </div>
    </div>
  );
}
