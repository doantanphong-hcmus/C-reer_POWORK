import type { CandidateProfile, Evidence, VerifiedSkill } from '@/lib/types';

const skill = (
  id: string,
  name: string,
  score: number,
  level: VerifiedSkill['level'],
  evidenceCount: number
): VerifiedSkill => ({
  id,
  name,
  score,
  level,
  evidenceCount,
});

const skills = {
  frontend: skill('skill-frontend', 'Frontend', 91, 'Advanced', 4),
  backend: skill('skill-backend', 'Backend', 84, 'Advanced', 3),
  uiux: skill('skill-uiux', 'UI/UX', 88, 'Advanced', 3),
  problemSolving: skill('skill-problem-solving', 'Problem Solving', 93, 'Expert', 4),
  documentation: skill('skill-documentation', 'Documentation', 86, 'Advanced', 2),
  communication: skill('skill-communication', 'Communication', 82, 'Intermediate', 2),
};

const sampleFileUrl =
  'data:text/plain;charset=utf-8,POWORK%20sample%20evidence%20file%20for%20Dynamic%20Profile';

export const mockCandidateProfile: CandidateProfile = {
  id: 'candidate-dynamic-profile-demo',
  fullName: 'Nguyen Minh Anh',
  headline: 'Frontend Engineer | React, Next.js, Design Systems',
  bio: 'Ung vien tap trung vao giao dien san pham, kha nang chuyen wireframe thanh UI co cau truc va giai quyet bai toan bang bang chung thuc chien.',
  location: 'Ho Chi Minh City, Vietnam',
  totalChallenges: 4,
  passedChallenges: 4,
  averageScore: 89,
  verifiedSkills: [
    skills.frontend,
    skills.problemSolving,
    skills.uiux,
    skills.backend,
    skills.documentation,
    skills.communication,
  ],
  skillSummary: [
    { id: 'summary-frontend', name: 'Frontend', score: 91, maxScore: 100 },
    { id: 'summary-backend', name: 'Backend', score: 84, maxScore: 100 },
    { id: 'summary-uiux', name: 'UI/UX', score: 88, maxScore: 100 },
    { id: 'summary-problem-solving', name: 'Problem Solving', score: 93, maxScore: 100 },
    { id: 'summary-documentation', name: 'Documentation', score: 86, maxScore: 100 },
    { id: 'summary-communication', name: 'Communication', score: 82, maxScore: 100 },
  ],
  evidences: [
    {
      id: 'evidence-next-dashboard',
      challengeTitle: 'Build a hiring analytics dashboard',
      companyName: 'VNG Digital Lab',
      completedAt: '2026-06-28T09:30:00.000Z',
      submittedAt: '2026-06-27T21:15:00.000Z',
      status: 'excellent',
      finalScore: 94,
      maxScore: 100,
      skills: [skills.frontend, skills.uiux, skills.problemSolving],
      rubricItems: [
        {
          id: 'rubric-next-architecture',
          criterionName: 'Architecture and routing',
          score: 24,
          maxScore: 25,
          weight: 25,
          feedback: 'Route structure is clear and keeps dashboard concerns separated.',
        },
        {
          id: 'rubric-next-ui',
          criterionName: 'UI implementation',
          score: 28,
          maxScore: 30,
          weight: 30,
          feedback: 'Strong visual hierarchy, consistent spacing, and readable states.',
        },
        {
          id: 'rubric-next-data',
          criterionName: 'Data handling',
          score: 22,
          maxScore: 25,
          weight: 25,
          feedback: 'Good loading and empty states. Error copy can be more specific later.',
        },
        {
          id: 'rubric-next-docs',
          criterionName: 'Documentation',
          score: 20,
          maxScore: 20,
          weight: 20,
          feedback: 'Clear handoff notes and component boundaries.',
        },
      ],
      files: [
        {
          id: 'file-next-demo',
          fileName: 'dashboard-solution.zip',
          fileType: 'ZIP',
          fileSize: 4280000,
          url: sampleFileUrl,
        },
        {
          id: 'file-next-notes',
          fileName: 'implementation-notes.pdf',
          fileType: 'PDF',
          fileSize: 980000,
        },
      ],
      employerFeedback:
        'The solution shows strong product thinking and reliable frontend architecture. The dashboard is easy to scan and the candidate explains trade-offs clearly.',
    },
    {
      id: 'evidence-cache-api',
      challengeTitle: 'Design caching strategy for high-traffic APIs',
      companyName: 'KMS Technology',
      completedAt: '2026-06-19T08:00:00.000Z',
      submittedAt: '2026-06-18T20:20:00.000Z',
      status: 'verified',
      finalScore: 88,
      maxScore: 100,
      skills: [skills.backend, skills.problemSolving, skills.documentation],
      rubricItems: [
        {
          id: 'rubric-cache-design',
          criterionName: 'System design',
          score: 27,
          maxScore: 30,
          weight: 30,
          feedback: 'Cache invalidation and fallback flow are practical.',
        },
        {
          id: 'rubric-cache-risk',
          criterionName: 'Risk analysis',
          score: 20,
          maxScore: 25,
          weight: 25,
          feedback: 'Identifies stale data risks and monitoring needs.',
        },
        {
          id: 'rubric-cache-cost',
          criterionName: 'Cost awareness',
          score: 19,
          maxScore: 20,
          weight: 20,
          feedback: 'Reasonable Redis sizing assumptions.',
        },
        {
          id: 'rubric-cache-docs',
          criterionName: 'Communication',
          score: 22,
          maxScore: 25,
          weight: 25,
          feedback: 'Clear diagrams and concise explanation.',
        },
      ],
      files: [
        {
          id: 'file-cache-design',
          fileName: 'cache-strategy.md',
          fileType: 'MD',
          fileSize: 360000,
          url: sampleFileUrl,
        },
      ],
      employerFeedback:
        'Strong backend reasoning. The answer balances performance, cost, and operational safety.',
    },
    {
      id: 'evidence-mobile-flow',
      challengeTitle: 'Improve mobile submission flow',
      companyName: 'POWORK Labs',
      completedAt: '2026-06-11T10:45:00.000Z',
      submittedAt: '2026-06-10T22:10:00.000Z',
      status: 'passed',
      finalScore: 85,
      maxScore: 100,
      skills: [skills.frontend, skills.uiux, skills.communication],
      rubricItems: [
        {
          id: 'rubric-mobile-responsive',
          criterionName: 'Responsive layout',
          score: 24,
          maxScore: 30,
          weight: 30,
          feedback: 'Mobile layout remains usable and keeps primary actions visible.',
        },
        {
          id: 'rubric-mobile-state',
          criterionName: 'Interaction states',
          score: 20,
          maxScore: 25,
          weight: 25,
          feedback: 'Upload states are readable. Retry state needs one more pass.',
        },
        {
          id: 'rubric-mobile-accessibility',
          criterionName: 'Accessibility',
          score: 19,
          maxScore: 20,
          weight: 20,
          feedback: 'Labels and focus states are handled well.',
        },
        {
          id: 'rubric-mobile-handoff',
          criterionName: 'Handoff quality',
          score: 22,
          maxScore: 25,
          weight: 25,
          feedback: 'Good notes for QA and edge cases.',
        },
      ],
      files: [
        {
          id: 'file-mobile-prototype',
          fileName: 'mobile-flow-prototype.fig',
          fileType: 'FIG',
          fileSize: 2200000,
        },
      ],
      employerFeedback:
        'Good attention to mobile constraints and clear communication of design decisions.',
    },
    {
      id: 'evidence-rubric-builder',
      challengeTitle: 'Create a rubric builder component',
      companyName: 'TopDev Studio',
      completedAt: '2026-06-02T07:30:00.000Z',
      submittedAt: '2026-06-01T19:45:00.000Z',
      status: 'verified',
      finalScore: 90,
      maxScore: 100,
      skills: [skills.frontend, skills.documentation, skills.problemSolving],
      rubricItems: [
        {
          id: 'rubric-builder-reuse',
          criterionName: 'Component reusability',
          score: 26,
          maxScore: 30,
          weight: 30,
          feedback: 'Component API is clear and avoids leaking parent concerns.',
        },
        {
          id: 'rubric-builder-validation',
          criterionName: 'Validation logic',
          score: 22,
          maxScore: 25,
          weight: 25,
          feedback: 'Total weight validation is understandable and hard to misuse.',
        },
        {
          id: 'rubric-builder-maintain',
          criterionName: 'Maintainability',
          score: 22,
          maxScore: 25,
          weight: 25,
          feedback: 'Types and helpers make future expansion simple.',
        },
        {
          id: 'rubric-builder-ux',
          criterionName: 'Reviewer UX',
          score: 20,
          maxScore: 20,
          weight: 20,
          feedback: 'Fast to scan and edit criteria.',
        },
      ],
      files: [
        {
          id: 'file-rubric-source',
          fileName: 'rubric-builder.tsx',
          fileType: 'TSX',
          fileSize: 51000,
          url: sampleFileUrl,
        },
      ],
      employerFeedback:
        'The implementation is clean and reusable. It is ready to be plugged into a larger assessment flow.',
    },
  ],
};

export const mockEvidenceById: Record<string, Evidence> = mockCandidateProfile.evidences.reduce(
  (acc, evidence) => {
    acc[evidence.id] = evidence;
    return acc;
  },
  {} as Record<string, Evidence>
);
