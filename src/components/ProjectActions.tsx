import { ActionPanel, Action, Icon, confirmAlert, Alert } from "@raycast/api";
import { Project, ProjectWithStatus } from "../types";
import { SHORTCUTS } from "../constants";
import { openProjectWithToast } from "../lib/ide";
import { createProjectDeeplink } from "../utils/deeplink";
import ProjectForm from "./ProjectForm";

// ============================================
// ProjectActions Component
// ============================================

interface ProjectActionsProps {
  project: Project | ProjectWithStatus;
  onRefresh: () => void;
  onDelete: (project: Project) => Promise<boolean>;
}

export default function ProjectActions({ project, onRefresh, onDelete }: ProjectActionsProps) {
  const handleOpen = async () => {
    await openProjectWithToast(project);
  };

  const handleDelete = async () => {
    const confirmed = await confirmAlert({
      title: "Delete Project",
      message: `Are you sure you want to delete "${project.alias}"?`,
      primaryAction: {
        title: "Delete",
        style: Alert.ActionStyle.Destructive,
      },
    });

    if (confirmed) {
      await onDelete(project);
    }
  };

  return (
    <ActionPanel>
      {/* Primary Action */}
      <ActionPanel.Section>
        <Action
          icon={Icon.AppWindowSidebarRight}
          title={`Open in ${project.app.name}`}
          onAction={handleOpen}
        />
      </ActionPanel.Section>

      {/* Project Management */}
      <ActionPanel.Section title="Project">
        <Action.Push
          icon={Icon.Pencil}
          title="Edit"
          shortcut={SHORTCUTS.EDIT_PROJECT as any}
          target={<ProjectForm project={project} onSave={onRefresh} />}
        />
        <Action.Push
          icon={Icon.Plus}
          title="Add New"
          shortcut={SHORTCUTS.ADD_PROJECT as any}
          target={<ProjectForm onSave={onRefresh} />}
        />
      </ActionPanel.Section>

      {/* File & Path */}
      <ActionPanel.Section title="Path">
        <Action.ShowInFinder
          path={project.paths[0]}
          shortcut={SHORTCUTS.SHOW_IN_FINDER as any}
        />
        <Action.CopyToClipboard
          title="Copy Path"
          content={project.paths.join("\n")}
          shortcut={SHORTCUTS.COPY_PATH as any}
        />
        <Action.CreateQuicklink
          title="Create Quicklink"
          shortcut={SHORTCUTS.CREATE_QUICKLINK as any}
          quicklink={{
            name: project.alias,
            link: createProjectDeeplink(project.id),
          }}
        />
      </ActionPanel.Section>

      {/* Destructive */}
      <ActionPanel.Section>
        <Action
          icon={Icon.Trash}
          title="Delete"
          style={Action.Style.Destructive}
          shortcut={SHORTCUTS.DELETE_PROJECT as any}
          onAction={handleDelete}
        />
      </ActionPanel.Section>
    </ActionPanel>
  );
}
