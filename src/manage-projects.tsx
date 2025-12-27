import { ActionPanel, Action, List, Icon, confirmAlert, Alert } from "@raycast/api";
import { useProjectsSimple } from "./hooks/useProjects";
import { ProjectForm } from "./components";
import { SHORTCUTS } from "./constants";
import { Project } from "./types";

// ============================================
// Manage Projects Command
// ============================================

export default function ManageProjects() {
  const { projects, isLoading, refresh, deleteProject } = useProjectsSimple();

  const handleDelete = async (project: Project) => {
    const confirmed = await confirmAlert({
      title: "Delete Project",
      message: `Are you sure you want to delete "${project.alias}"?`,
      primaryAction: {
        title: "Delete",
        style: Alert.ActionStyle.Destructive,
      },
    });

    if (confirmed) {
      await deleteProject(project);
    }
  };

  return (
    <List
      isLoading={isLoading}
      searchBarPlaceholder="Search projects..."
    >
      {projects.length === 0 && !isLoading ? (
        <List.EmptyView
          icon={Icon.Document}
          title="No Projects"
          description="Add your first project to get started"
          actions={
            <ActionPanel>
              <Action.Push
                icon={Icon.Plus}
                title="Add Project"
                shortcut={SHORTCUTS.ADD_PROJECT as any}
                target={<ProjectForm onSave={refresh} />}
              />
            </ActionPanel>
          }
        />
      ) : (
        projects.map((project) => (
          <List.Item
            key={project.id}
            icon={{ fileIcon: project.app.path }}
            title={project.alias}
            subtitle={project.paths[0].split("/").pop()}
            keywords={[project.alias, project.app.name, ...project.paths]}
            accessories={[
              project.paths.length > 1
                ? { text: `${project.paths.length}`, icon: Icon.Folder, tooltip: `${project.paths.length} paths` }
                : null,
              { text: project.app.name },
            ].filter(Boolean) as List.Item.Accessory[]}
            actions={
              <ActionPanel>
                <ActionPanel.Section>
                  <Action.Push
                    icon={Icon.Pencil}
                    title="Edit Project"
                    target={<ProjectForm project={project} onSave={refresh} />}
                  />
                  <Action.Push
                    icon={Icon.Plus}
                    title="Add Project"
                    shortcut={SHORTCUTS.ADD_PROJECT as any}
                    target={<ProjectForm onSave={refresh} />}
                  />
                </ActionPanel.Section>

                <ActionPanel.Section>
                  <Action.ShowInFinder
                    path={project.paths[0]}
                    shortcut={SHORTCUTS.SHOW_IN_FINDER as any}
                  />
                  <Action.CopyToClipboard
                    title="Copy Path"
                    content={project.paths.join("\n")}
                    shortcut={SHORTCUTS.COPY_PATH as any}
                  />
                </ActionPanel.Section>

                <ActionPanel.Section>
                  <Action
                    icon={Icon.Trash}
                    title="Delete Project"
                    style={Action.Style.Destructive}
                    shortcut={SHORTCUTS.DELETE_PROJECT as any}
                    onAction={() => handleDelete(project)}
                  />
                </ActionPanel.Section>
              </ActionPanel>
            }
          />
        ))
      )}
    </List>
  );
}
