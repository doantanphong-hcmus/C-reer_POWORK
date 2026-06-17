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
