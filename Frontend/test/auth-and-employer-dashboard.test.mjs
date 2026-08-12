import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

const read = (path) => readFile(new URL(path, import.meta.url), 'utf8');

test('auth pages use the shared professional brand panel and require terms consent', async () => {
  const [login, register, schema] = await Promise.all([
    read('../components/auth/LoginContent.tsx'),
    read('../app/(auth)/register/page.tsx'),
    read('../lib/validations/auth.ts'),
  ]);

  assert.match(login, /AuthBrandPanel/);
  assert.match(register, /AuthBrandPanel/);
  assert.match(register, /accepted_terms/);
  assert.match(schema, /accepted_terms:\s*z\.boolean\(\)\.refine\(Boolean/);
});

test('Employer dashboard renders the real overview inside its required providers', async () => {
  const [page, hook, evidence, providers] = await Promise.all([
    read('../app/employer/dashboard/page.tsx'),
    read('../lib/hooks/useEmployerOverview.ts'),
    read('../components/assessment/VerificationDashboardSections.tsx'),
    read('../app/providers.tsx'),
  ]);

  assert.match(page, /<EmployerOverview user=\{user\}/);
  assert.match(providers, /<ThemeProvider>\{children\}<\/ThemeProvider>/);
  assert.match(hook, /assessmentAPI\.listByChallenge/);
  assert.match(hook, /submission\.status === PENDING_STATUS/);
  assert.doesNotMatch(evidence, /Questions & Answers/);
  assert.match(evidence, /Câu trả lời phần tự luận/);
});

test('role selection uses professional SVG icons and Vietnamese product copy', async () => {
  const page = await read('../app/page.tsx');

  assert.match(page, /function CandidateIcon/);
  assert.match(page, /function EmployerIcon/);
  assert.match(page, /Ứng viên/);
  assert.match(page, /Nhà tuyển dụng/);
  assert.doesNotMatch(page, /🎓|🏢/u);
});
