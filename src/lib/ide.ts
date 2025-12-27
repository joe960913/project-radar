import { showToast, Toast, showHUD, open } from "@raycast/api";
import { Project } from "../types";

// ============================================
// IDE/App Operations
// ============================================

export async function openProjectInApp(project: Project): Promise<boolean> {
  try {
    // Open all paths with the specified application
    for (const path of project.paths) {
      await open(path, project.app.bundleId);
    }
    return true;
  } catch (error) {
    await showToast({
      style: Toast.Style.Failure,
      title: "Failed to open project",
      message: String(error),
    });
    return false;
  }
}

export async function openProjectWithHUD(project: Project): Promise<void> {
  const success = await openProjectInApp(project);

  if (success) {
    await showHUD(`Opening ${project.alias} in ${project.app.name}`);
  }
}

export async function openProjectWithToast(project: Project): Promise<void> {
  const success = await openProjectInApp(project);

  if (success) {
    await showToast({
      style: Toast.Style.Success,
      title: `Opening in ${project.app.name}`,
      message: project.alias,
    });
  }
}
