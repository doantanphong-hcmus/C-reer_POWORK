import type { RubricCriteria } from './challenge';

export type SubmissionStatus =
  | 'Pending'
  | 'Evaluated'
  | 'Approved'
  | 'Rejected'
  | 'Failed'
  | 'PENDING'
  | 'EVALUATED'
  | 'APPROVED'
  | 'REJECTED'
  | 'FAILED';

export type DocumentKind = 'pdf' | 'image' | 'zip' | 'unknown';

export interface ReviewDocument {
  fileName?: string | null;
  url?: string | null;
  kind?: DocumentKind | null;
  mimeType?: string | null;
  fileSize?: number | null;
  description?: string | null;
}

export interface SubmissionSummary {
  submission_id: string;
  hash_id: string;
  status: SubmissionStatus;
  solution_url?: string;
  submitted_at?: string;
}

export interface SubmitSolutionRequest {
  challenge_id: string;
  solution_url: string;
}

export interface GradingSubmission {
  submission_id: string;
  hash_id: string;
  status: SubmissionStatus;
  challenge_id?: string;
  challenge_title: string;
  submitted_at?: string;
  solution_url?: string;
  criteria: RubricCriteria[];
  documents: ReviewDocument[];
  is_unlocked?: boolean;
  unlocked_candidate_profile?: UnlockedCandidateProfile;
  data_source?: 'api' | 'mock';
}

export interface EvaluationItemInput {
  criteria_id: string;
  score: number;
  comment?: string;
}

export interface EvaluateRequest {
  evaluations: EvaluationItemInput[];
  general_comment?: string;
}

export interface EvaluateResponse {
  submission_id: string;
  evaluations: EvaluationItemInput[];
  general_comment?: string;
  total_score: number;
  evaluated_at: string;
}

export interface UnlockedCandidateProfile {
  user_id: string;
  full_name: string;
  email: string;
}

export interface UnlockResponse {
  message: string;
  unlocked_candidate_profile: UnlockedCandidateProfile;
}

export interface UnlockRequest {
  action: 'APPROVE';
}

export interface GetPresignedUploadUrlRequest {
  challenge_id: string;
  file_name: string;
  file_type: string;
}

export interface GetPresignedUploadUrlResponse {
  upload_url: string;
  file_key: string;
}
