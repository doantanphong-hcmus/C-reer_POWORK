export type UserRole = 'Candidate' | 'Employer';

export interface User {
  user_id: string;
  email: string;
  full_name: string;
  role: UserRole;
  avatar_url?: string;
  created_at?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  full_name: string;
  role: UserRole;
}

export interface AuthSession {
  access_token: string;
  token_type: 'Bearer';
  user: User;
}
