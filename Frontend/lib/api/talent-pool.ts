import { apiClient, unwrap } from './client';
import type { TalentPoolEntry, TalentPoolStatus, AddToTalentPoolRequest } from '@/lib/types';

export const talentPoolAPI = {
  getTalentPool: () => 
    unwrap<TalentPoolEntry[]>(apiClient.get('/talent-pool')),

  updateTalentPoolStatus: (poolId: string, status: TalentPoolStatus) => 
    unwrap<void>(apiClient.patch(`/talent-pool/${poolId}/status`, { status })),

  addToTalentPool: (userId: string) => 
    unwrap<{ message: string }>(
      apiClient.post('/talent-pool', { user_id: userId } as AddToTalentPoolRequest)
    ),
};