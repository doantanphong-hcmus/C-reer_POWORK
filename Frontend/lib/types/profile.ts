export interface VerifiedEvidence {
  evidence_id: string;
  challenge_name: string;
  company_name: string;
  industry: string;
  total_score: number;
  unlocked_at: string;
}

export interface Profile {
  user_id: string;
  full_name: string;
  verified_evidences: VerifiedEvidence[];
}

export type EvidenceStatus = 'verified' | 'passed' | 'excellent';

export interface VerifiedSkill {
  id: string;
  name: string;
  score: number;
  level: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
  evidenceCount: number;
}

export interface SkillSummaryItem {
  id: string;
  name: string;
  score: number;
  maxScore: number;
}

export interface RubricItem {
  id: string;
  criterionName: string;
  score: number;
  maxScore: number;
  weight: number;
  feedback?: string;
}

export interface SubmissionFile {
  id: string;
  fileName: string;
  fileType: string;
  fileSize: number;
  url?: string;
}

export interface Evidence {
  id: string;
  challengeTitle: string;
  companyName: string;
  completedAt: string;
  submittedAt: string;
  status: EvidenceStatus;
  finalScore: number;
  maxScore: number;
  skills: VerifiedSkill[];
  rubricItems: RubricItem[];
  files: SubmissionFile[];
  employerFeedback?: string;
}

export interface CandidateProfile {
  id: string;
  fullName: string;
  avatarUrl?: string;
  headline?: string;
  bio?: string;
  location?: string;
  totalChallenges: number;
  passedChallenges: number;
  averageScore: number;
  verifiedSkills: VerifiedSkill[];
  skillSummary: SkillSummaryItem[];
  evidences: Evidence[];
}
