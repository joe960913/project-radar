import {
  ActionPanel,
  Action,
  Form,
  showToast,
  Toast,
  useNavigation,
  Icon,
  launchCommand,
  LaunchType,
} from "@raycast/api";
import { useState } from "react";
import { ProjectFormProps, AppInfo } from "../types";
import { addProject, updateProject, isAliasExists } from "../lib/storage";
import { useApplications } from "../hooks/useApplications";
import { createProjectDeeplink } from "../utils/deeplink";

// ============================================
// Form Values Interface
// ============================================

interface FormValues {
  alias: string;
  paths: string[];
  appBundleId: string;
  createQuicklink: boolean;
}

// ============================================
// ProjectForm Component
// ============================================

export default function ProjectForm({ project, onSave }: ProjectFormProps) {
  const { pop } = useNavigation();
  const [aliasError, setAliasError] = useState<string | undefined>();
  const { applications, isLoading: appsLoading } = useApplications();

  const isEditing = !!project;

  async function handleSubmit(values: FormValues) {
    // Validate alias
    if (!values.alias.trim()) {
      setAliasError("Alias is required");
      return;
    }

    // Check for duplicate alias
    const aliasExists = await isAliasExists(values.alias.trim(), project?.id);
    if (aliasExists) {
      setAliasError("This alias already exists");
      return;
    }

    // Validate paths
    if (!values.paths || values.paths.length === 0) {
      await showToast({
        style: Toast.Style.Failure,
        title: "Validation Error",
        message: "Please select at least one path",
      });
      return;
    }

    // Validate app selection
    if (!values.appBundleId) {
      await showToast({
        style: Toast.Style.Failure,
        title: "Validation Error",
        message: "Please select an application",
      });
      return;
    }

    // Find the selected app
    const selectedApp = applications.find((app) => app.bundleId === values.appBundleId);
    if (!selectedApp) {
      await showToast({
        style: Toast.Style.Failure,
        title: "Validation Error",
        message: "Selected application not found",
      });
      return;
    }

    try {
      const appInfo: AppInfo = {
        name: selectedApp.name,
        bundleId: selectedApp.bundleId,
        path: selectedApp.path,
      };

      if (isEditing && project) {
        await updateProject(project.id, {
          alias: values.alias.trim(),
          paths: values.paths,
          app: appInfo,
        });
        await showToast({
          style: Toast.Style.Success,
          title: "Project updated",
          message: values.alias,
        });
        onSave();
        pop();
      } else {
        const newProject = await addProject({
          alias: values.alias.trim(),
          paths: values.paths,
          app: appInfo,
        });
        await showToast({
          style: Toast.Style.Success,
          title: "Project added",
          message: values.alias,
        });
        onSave();

        if (values.createQuicklink) {
          const deeplink = createProjectDeeplink(newProject.id);
          await launchCommand({
            ownerOrAuthorName: "raycast",
            extensionName: "raycast",
            name: "create-quicklink",
            type: LaunchType.UserInitiated,
            context: {
              name: newProject.alias,
              link: deeplink,
            },
          });
        } else {
          pop();
        }
      }
    } catch (error) {
      await showToast({
        style: Toast.Style.Failure,
        title: "Failed to save project",
        message: String(error),
      });
    }
  }

  function handleAliasChange() {
    if (aliasError) {
      setAliasError(undefined);
    }
  }

  return (
    <Form
      isLoading={appsLoading}
      navigationTitle={isEditing ? "Edit Project" : "New Project"}
      actions={
        <ActionPanel>
          <Action.SubmitForm
            title={isEditing ? "Save" : "Create"}
            icon={Icon.Check}
            onSubmit={handleSubmit}
          />
        </ActionPanel>
      }
    >
      <Form.TextField
        id="alias"
        title="Alias"
        placeholder="my-project"
        info="Short name for quick access"
        defaultValue={project?.alias}
        error={aliasError}
        onChange={handleAliasChange}
        autoFocus
      />

      <Form.FilePicker
        id="paths"
        title="Paths"
        allowMultipleSelection
        canChooseDirectories
        canChooseFiles={false}
        info="Select project folders"
        defaultValue={project?.paths}
      />

      <Form.Dropdown
        id="appBundleId"
        title="Open With"
        defaultValue={appsLoading ? undefined : project?.app?.bundleId}
      >
        {applications.map((app) => (
          <Form.Dropdown.Item
            key={app.bundleId}
            value={app.bundleId}
            title={app.name}
            icon={{ fileIcon: app.path }}
          />
        ))}
      </Form.Dropdown>

      {!isEditing && (
        <>
          <Form.Separator />
          <Form.Checkbox
            id="createQuicklink"
            label="Create Quicklink"
            info="Access this project from Raycast root search"
            defaultValue={true}
          />
        </>
      )}
    </Form>
  );
}
