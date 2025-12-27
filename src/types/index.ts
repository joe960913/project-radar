// ============================================
// Project Types
// ============================================

export interface Project {
  id: string;
  alias: string;
  paths: string[];
  app: AppInfo; // Changed from `ide: IDE` to support any application
  createdAt: number;
  updatedAt: number;
}

// ============================================
// Application Types
// ============================================

export interface AppInfo {
  name: string;
  bundleId: string;
  path: string;
}

// ============================================
// Git Types
// ============================================

export interface GitStatus {
  isGitRepo: boolean;
  branch?: string;
  hasChanges?: boolean;
  ahead?: number;
  behind?: number;
}

// ============================================
// Component Props Types
// ============================================

export interface ProjectWithStatus extends Project {
  gitStatus: GitStatus | null;
}

export interface ProjectFormProps {
  project?: Project;
  onSave: () => void;
}

// ============================================
// Launch Context Types
// ============================================

export interface OpenProjectContext {
  projectId: string;
}
