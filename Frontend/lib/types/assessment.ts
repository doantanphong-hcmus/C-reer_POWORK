export type SubmissionStatus = 'Pending' | 'Evaluated' | 'Approved' | 'Rejected' | 'Failed';

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
