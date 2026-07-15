'use client';

import {
  EvidenceHighlights,
  EvidenceTimeline,
  LoadingSkeleton,
  ProfessionalSummary,
  ProfileAnalytics,
  ProfileHeader,
  ProfileNavigationTabs,
  SkillsRubricSummary,
} from '@/components/profile';
import { useAuth, useCandidateProfile } from '@/lib/hooks';

export default function CandidateDynamicProfilePage() {
  const { user } = useAuth();
  const { data: profile, isLoading, isError, error } = useCandidateProfile(user?.user_id ?? "");

  const handleShare = async () => {
    if (typeof window === 'undefined') return;

    try {
      await navigator.clipboard.writeText(window.location.href);
    } catch {
      window.prompt('Copy profile link', window.location.href);
    }
  };

  if (isLoading) {
    return <LoadingSkeleton />;
  }

  if (isError) {
    return (
      <div className="mx-auto max-w-3xl rounded-lg border-hairline border-border-secondary bg-background-secondary p-5 text-sm text-error">
        {error?.message || 'Không thể tải Dynamic Profile. Vui lòng thử lại sau.'}
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="mx-auto max-w-3xl rounded-lg border-hairline border-border-secondary bg-background-secondary p-5 text-sm text-foreground-secondary">
        Không tìm thấy hồ sơ ứng viên.
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-[1240px] space-y-6">
      <ProfileHeader profile={profile} isOwner={user?.role === 'Candidate'} onShare={handleShare} />

      <ProfessionalSummary profile={profile} />

      <SkillsRubricSummary
        verifiedSkills={profile.verifiedSkills}
        skillSummary={profile.skillSummary}
      />

      <ProfileNavigationTabs />

      <EvidenceHighlights evidences={profile.evidences} />

      <EvidenceTimeline evidences={profile.evidences} />

      <ProfileAnalytics profile={profile} />
    </div>
  );
}
