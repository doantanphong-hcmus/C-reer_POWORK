import { authHandlers } from './auth';
import { challengeHandlers } from './challenges';
import { assessmentHandlers } from './assessment';
import { profileHandlers } from './profile';
import { talentPoolHandlers } from './talent-pool';

export const handlers = [
  ...authHandlers,
  ...challengeHandlers,
  ...assessmentHandlers,
  ...profileHandlers,
  ...talentPoolHandlers,
];
