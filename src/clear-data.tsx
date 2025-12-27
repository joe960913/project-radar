import { LocalStorage, showToast, Toast, launchCommand, LaunchType } from "@raycast/api";

export default async function Command() {
  await LocalStorage.clear();
  await showToast({
    style: Toast.Style.Success,
    title: "All project data cleared",
    message: "Remember to delete quicklinks manually",
    primaryAction: {
      title: "Manage Quicklinks",
      onAction: async () => {
        await launchCommand({
          ownerOrAuthorName: "raycast",
          extensionName: "raycast",
          name: "manage-quicklinks",
          type: LaunchType.UserInitiated,
        });
      },
    },
  });
}
