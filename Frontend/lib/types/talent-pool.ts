export type TalentPoolStatus = 'SAVED' | 'INVITED' | 'CONTACTED';

export interface TalentPoolCandidate {
  user_id: string;
  full_name: string;
  university?: string;
  year?: string;
  primary_skills?: string[];
}

export interface TalentPoolEntry {
  pool_id: string;
  candidate: TalentPoolCandidate;
  highest_score: number;
  challenges_taken: string[];
  status: TalentPoolStatus;
  added_at: string;
}

export interface AddToTalentPoolRequest {
  user_id: string;
}
