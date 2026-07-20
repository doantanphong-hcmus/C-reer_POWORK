import { useQuery } from '@tanstack/react-query';
import { dynamicProfileAPI } from '@/lib/api/dynamic-profile';

export function useCandidateProfile(userId: string) {
  return useQuery({
    queryKey: ['candidate-profile'],
    queryFn: () => dynamicProfileAPI.getCandidateProfile(userId),
    enabled: Boolean(userId),
  });
}

export function useEvidenceDetail(evidenceId: string) {
  return useQuery({
    queryKey: ['candidate-profile', 'evidence', evidenceId],
    queryFn: () => dynamicProfileAPI.getEvidenceDetail(evidenceId),
    enabled: Boolean(evidenceId),
  });
}
