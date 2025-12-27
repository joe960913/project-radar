import { List, Icon } from "@raycast/api";
import { Project, ProjectWithStatus } from "../types";
import ProjectActions from "./ProjectActions";

// ============================================
// ProjectListItem Component
// ============================================

interface ProjectListItemProps {
  project: ProjectWithStatus;
  onRefresh: () => void;
  onDelete: (project: Project) => Promise<boolean>;
}

export default function ProjectListItem({ project, onRefresh, onDelete }: ProjectListItemProps) {
  const subtitle = formatSubtitle(project);
  const keywords = [project.alias, project.app.name, ...project.paths];

  return (
    <List.Item
      key={project.id}
      icon={{ fileIcon: project.app.path }}
      title={project.alias}
      subtitle={subtitle}
      keywords={keywords}
      accessories={getAccessories(project)}
      actions={
        <ProjectActions
          project={project}
          onRefresh={onRefresh}
          onDelete={onDelete}
        />
      }
    />
  );
}

// ============================================
// Helper Functions
// ============================================

function formatSubtitle(project: ProjectWithStatus): string {
  const pathName = project.paths[0].split("/").pop() || project.paths[0];
  return pathName;
}

function getAccessories(project: ProjectWithStatus): List.Item.Accessory[] {
  const accessories: List.Item.Accessory[] = [];

  // Git branch (if git repo)
  if (project.gitStatus?.isGitRepo && project.gitStatus.branch) {
    accessories.push({
      icon: Icon.CodeBlock,
      text: project.gitStatus.branch,
      tooltip: `Branch: ${project.gitStatus.branch}`,
    });
  }

  // Uncommitted changes indicator
  if (project.gitStatus?.hasChanges) {
    accessories.push({
      icon: Icon.Dot,
      tooltip: "Uncommitted changes",
    });
  }

  // Path count (if multiple)
  if (project.paths.length > 1) {
    accessories.push({
      text: `${project.paths.length}`,
      icon: Icon.Folder,
      tooltip: `${project.paths.length} paths`,
    });
  }

  // App name (rightmost)
  accessories.push({
    text: project.app.name,
  });

  return accessories;
}
