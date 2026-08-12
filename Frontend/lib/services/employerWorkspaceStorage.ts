import type { WorkspaceSettings, WorkspaceState } from '@/lib/types/employerOverview';

const STORAGE_KEY = 'powork-employer-workspace';
const CHANGE_EVENT = 'powork-employer-workspace-change';

export const DEFAULT_WORKSPACE_STATE: WorkspaceState = {
  bookmarkIds: [],
  settings: {
    workspaceName: 'POWORK Hiring',
    companyName: 'POWORK',
    memberEmails: [],
    emailNotifications: true,
    reviewNotifications: true,
    theme: 'dark',
    hideCandidateIdentity: true,
    privateWorkspace: true,
  },
};

let cachedState = DEFAULT_WORKSPACE_STATE;
let hasLoadedStorage = false;

export function getWorkspaceState(): WorkspaceState {
  if (typeof window === 'undefined') return cachedState;
  if (hasLoadedStorage) return cachedState;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      hasLoadedStorage = true;
      return cachedState;
    }
    const parsed = JSON.parse(raw) as Partial<WorkspaceState>;
    const savedSettings: Partial<WorkspaceSettings> = parsed.settings ?? {};
    cachedState = {
      bookmarkIds: Array.isArray(parsed.bookmarkIds)
        ? parsed.bookmarkIds.filter((id): id is string => typeof id === 'string')
        : [],
      settings: {
        ...DEFAULT_WORKSPACE_STATE.settings,
        ...savedSettings,
        workspaceName:
          typeof savedSettings.workspaceName === 'string'
            ? savedSettings.workspaceName
            : DEFAULT_WORKSPACE_STATE.settings.workspaceName,
        companyName:
          typeof savedSettings.companyName === 'string'
            ? savedSettings.companyName
            : DEFAULT_WORKSPACE_STATE.settings.companyName,
        memberEmails: Array.isArray(savedSettings.memberEmails)
          ? savedSettings.memberEmails.filter((email): email is string => typeof email === 'string')
          : [],
      },
    };
    hasLoadedStorage = true;
    return cachedState;
  } catch {
    hasLoadedStorage = true;
    return cachedState;
  }
}

export function saveWorkspaceState(state: WorkspaceState) {
  cachedState = state;
  hasLoadedStorage = true;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  window.dispatchEvent(new Event(CHANGE_EVENT));
}

export function subscribeWorkspaceState(callback: () => void) {
  const handleStorage = () => {
    hasLoadedStorage = false;
    getWorkspaceState();
    callback();
  };
  window.addEventListener(CHANGE_EVENT, callback);
  window.addEventListener('storage', handleStorage);
  return () => {
    window.removeEventListener(CHANGE_EVENT, callback);
    window.removeEventListener('storage', handleStorage);
  };
}
