import { authHandlers } from './auth';
import { challengeHandlers } from './challenges';
import { assessmentHandlers } from './assessment';
import { profileHandlers } from './profile';

export const handlers = [
  ...authHandlers,
  ...challengeHandlers,
  ...assessmentHandlers,
  ...profileHandlers,
];
