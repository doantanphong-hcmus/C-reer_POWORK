import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { challengeAPI } from '@/lib/api/endpoints';
import type { CreateChallengeRequest } from '@/lib/types';

export function useChallenges(params?: { industry?: string }) {
  return useQuery({
    queryKey: ['challenges', params],
    queryFn: () => challengeAPI.list(params),
  });
}

export function useChallenge(challengeId: string) {
  return useQuery({
    queryKey: ['challenge', challengeId],
    queryFn: () => challengeAPI.getById(challengeId),
    enabled: !!challengeId,
  });
}

export function useCreateChallenge() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateChallengeRequest) => challengeAPI.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['challenges'] });
    },
  });
}
