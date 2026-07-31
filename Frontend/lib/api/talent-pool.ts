import apiClient from './client';
import { TalentPoolEntry, TalentPoolStatus } from '../types/talent-pool';

export const getTalentPool = async (): Promise<TalentPoolEntry[]> => {
  const response = await apiClient.get<{ data: TalentPoolEntry[] }>('/talent-pool');
  return response.data.data;
};

export const updateTalentPoolStatus = async (
  poolId: string,
  status: TalentPoolStatus
): Promise<void> => {
  await apiClient.patch(`/talent-pool/${poolId}/status`, { status });
};

export const addToTalentPool = async (userId: string): Promise<void> => {
  await apiClient.post('/talent-pool', { user_id: userId });
};
