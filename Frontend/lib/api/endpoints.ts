import { apiClient, unwrap } from './client';
import type {
  AuthSession,
  User,
  LoginRequest,
  RegisterRequest,
  Challenge,
  ChallengeSummary,
  CreateChallengeRequest,
  UpdateChallengeStatusRequest,
  SubmissionSummary,
  SubmitSolutionRequest,
  EvaluateRequest,
  EvaluateResponse,
  UnlockRequest,
  UnlockResponse,
  Profile,
  TalentPoolEntry,
  AddToTalentPoolRequest,
} from '@/lib/types';

// IAM Module — /api/v1/auth
export const authAPI = {
  login: (payload: LoginRequest) => unwrap<AuthSession>(apiClient.post('/auth/login', payload)),
  register: (payload: RegisterRequest) =>
    unwrap<AuthSession>(apiClient.post('/auth/register', payload)),
  logout: () => unwrap<{ message: string }>(apiClient.post('/auth/logout')),
  getMe: () => unwrap<User>(apiClient.get('/auth/me')),
};

// Challenge Module — /api/v1/challenges
export const challengeAPI = {
  list: (params?: { industry?: string }) =>
    unwrap<ChallengeSummary[]>(apiClient.get('/challenges', { params })),
  getById: (challengeId: string) => unwrap<Challenge>(apiClient.get(`/challenges/${challengeId}`)),
  create: (payload: CreateChallengeRequest) =>
    unwrap<Challenge>(apiClient.post('/challenges', payload)),
  updateStatus: (challengeId: string, payload: UpdateChallengeStatusRequest) =>
    unwrap<Pick<Challenge, 'challenge_id' | 'status' | 'updated_at'>>(
      apiClient.patch(`/challenges/${challengeId}/status`, payload)
    ),
};

// Assessment Module — /api/v1/assessment (Khu vực cách ly Blind Audition)
export const assessmentAPI = {
  submit: (payload: SubmitSolutionRequest) =>
    unwrap<SubmissionSummary>(apiClient.post('/assessment/submissions', payload)),
  listByChallenge: (challengeId: string) =>
    unwrap<SubmissionSummary[]>(apiClient.get(`/assessment/challenges/${challengeId}/submissions`)),
  evaluate: (submissionId: string, payload: EvaluateRequest) =>
    unwrap<EvaluateResponse>(
      apiClient.post(`/assessment/submissions/${submissionId}/evaluate`, payload)
    ),
  unlock: (submissionId: string, payload: UnlockRequest = { action: 'APPROVE' }) =>
    unwrap<UnlockResponse>(
      apiClient.post(`/assessment/submissions/${submissionId}/unlock`, payload)
    ),
};

// Profile Module — /api/v1/profiles
export const profileAPI = {
  getByUserId: (userId: string) => unwrap<Profile>(apiClient.get(`/profiles/${userId}`)),
};

// Talent Pool Module — /api/v1/talent-pool
export const talentPoolAPI = {
  list: () => unwrap<TalentPoolEntry[]>(apiClient.get('/talent-pool')),
  add: (payload: AddToTalentPoolRequest) =>
    unwrap<{ message: string }>(apiClient.post('/talent-pool', payload)),
};
