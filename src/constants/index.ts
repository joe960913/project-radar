// ============================================
// Storage Keys
// ============================================

export const STORAGE_KEYS = {
  PROJECTS: "projects",
} as const;

// ============================================
// UI Constants
// ============================================

export const SHORTCUTS = {
  ADD_PROJECT: { modifiers: ["cmd"], key: "n" },
  EDIT_PROJECT: { modifiers: ["cmd"], key: "e" },
  DELETE_PROJECT: { modifiers: ["cmd"], key: "backspace" },
  SHOW_IN_FINDER: { modifiers: ["cmd"], key: "f" },
  COPY_PATH: { modifiers: ["cmd", "shift"], key: "c" },
  CREATE_QUICKLINK: { modifiers: ["cmd", "shift"], key: "q" },
} as const;
