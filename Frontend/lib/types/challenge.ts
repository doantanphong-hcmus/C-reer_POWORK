export type ChallengeStatus = 'Open' | 'Closed' | 'Archived';

export interface RubricCriteria {
  criteria_id: string;
  criteria_name: string;
  weight: number;
  max_score: number;
}

export interface RubricCriteriaInput {
  criteria_name: string;
  weight: number;
  max_score: number;
}

export interface ChallengeSummary {
  challenge_id: string;
  title: string;
  company_name: string;
  industry: string;
  deadline: string;
}

export interface Challenge extends ChallengeSummary {
  description: string;
  status: ChallengeStatus;
  rubrics: RubricCriteria[];
  created_at: string;
  updated_at?: string;
}

export interface CreateChallengeRequest {
  title: string;
  description: string;
  industry: string;
  deadline: string;
  rubrics: RubricCriteriaInput[];
}

export interface UpdateChallengeStatusRequest {
  status: ChallengeStatus;
}
