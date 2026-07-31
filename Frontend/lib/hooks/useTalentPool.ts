import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getTalentPool, updateTalentPoolStatus, addToTalentPool } from '../api/talent-pool';
import { TalentPoolStatus, TalentPoolEntry } from '../types/talent-pool'; // Import types from common types file

export const useTalentPool = () => {
  return useQuery<TalentPoolEntry[]>({
    queryKey: ['talent-pool'],
    queryFn: getTalentPool,
  });
};

export const useUpdateTalentPoolStatus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ poolId, status }: { poolId: string; status: TalentPoolStatus }) =>
      updateTalentPoolStatus(poolId, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['talent-pool'] });
    },
    // Optional: onError for optimistic updates rollback or error handling
  });
};

export const useAddToTalentPool = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (userId: string) => addToTalentPool(userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['talent-pool'] });
    },
    // Optional: onError for error handling
  });
};
