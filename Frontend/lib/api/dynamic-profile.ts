import { mockCandidateProfile, mockEvidenceById } from '@/lib/data/mockCandidateProfile';
import type { CandidateProfile, Evidence } from '@/lib/types';

function waitForMockLatency() {
  return new Promise<void>((resolve) => {
    setTimeout(resolve, 250);
  });
}

function normalizeProfile(profile: CandidateProfile): CandidateProfile {
  const evidences = profile.evidences ?? [];
  const totalChallenges = profile.totalChallenges ?? evidences.length;
  const passedChallenges =
    profile.passedChallenges ??
    evidences.filter((evidence) => ['passed', 'verified', 'excellent'].includes(evidence.status))
      .length;
  const averageScore =
    profile.averageScore ??
    (evidences.length > 0
      ? Math.round(
          evidences.reduce((total, evidence) => total + evidence.finalScore, 0) / evidences.length
        )
      : 0);

  return {
    ...profile,
    totalChallenges,
    passedChallenges,
    averageScore,
    verifiedSkills: profile.verifiedSkills ?? [],
    skillSummary: profile.skillSummary ?? [],
    evidences,
  };
}

export const dynamicProfileAPI = {
  async getCandidateProfile(): Promise<CandidateProfile> {
    // Replace this mock adapter with apiClient.get('/profiles/me/dynamic') when backend is ready.
    await waitForMockLatency();
    return normalizeProfile(mockCandidateProfile);
  },

  async getEvidenceDetail(evidenceId: string): Promise<Evidence | null> {
    // Replace this mock lookup with apiClient.get(`/profiles/me/evidences/${evidenceId}`).
    await waitForMockLatency();
    return mockEvidenceById[evidenceId] ?? null;
  },
};
