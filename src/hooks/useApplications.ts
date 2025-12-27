import { useState, useEffect } from "react";
import { getApplications } from "@raycast/api";
import { AppInfo } from "../types";

// ============================================
// Supported IDEs (whitelist)
// ============================================

const SUPPORTED_IDES: { bundleId: string; name: string }[] = [
  // Cursor
  { bundleId: "com.todesktop.230313mzl4w4u92", name: "Cursor" },

  // VS Code
  { bundleId: "com.microsoft.VSCode", name: "Visual Studio Code" },
  { bundleId: "com.microsoft.VSCodeInsiders", name: "VS Code Insiders" },

  // JetBrains
  { bundleId: "com.jetbrains.WebStorm", name: "WebStorm" },
  { bundleId: "com.jetbrains.intellij", name: "IntelliJ IDEA" },
  { bundleId: "com.jetbrains.intellij.ce", name: "IntelliJ IDEA CE" },
  { bundleId: "com.jetbrains.pycharm", name: "PyCharm" },
  { bundleId: "com.jetbrains.pycharm.ce", name: "PyCharm CE" },
  { bundleId: "com.jetbrains.phpstorm", name: "PhpStorm" },
  { bundleId: "com.jetbrains.rubymine", name: "RubyMine" },
  { bundleId: "com.jetbrains.goland", name: "GoLand" },
  { bundleId: "com.jetbrains.rider", name: "Rider" },
  { bundleId: "com.jetbrains.clion", name: "CLion" },
  { bundleId: "com.jetbrains.datagrip", name: "DataGrip" },
  { bundleId: "com.jetbrains.fleet", name: "Fleet" },

  // Apple
  { bundleId: "com.apple.dt.Xcode", name: "Xcode" },

  // Other IDEs
  { bundleId: "com.google.android.studio", name: "Android Studio" },
  { bundleId: "dev.zed.Zed", name: "Zed" },
  { bundleId: "com.sublimetext.4", name: "Sublime Text" },
  { bundleId: "com.sublimetext.3", name: "Sublime Text 3" },
  { bundleId: "com.github.atom", name: "Atom" },
  { bundleId: "com.panic.Nova", name: "Nova" },
  { bundleId: "com.barebones.bbedit", name: "BBEdit" },
  { bundleId: "com.macromates.TextMate", name: "TextMate" },
  { bundleId: "org.vim.MacVim", name: "MacVim" },
  { bundleId: "com.qvacua.VimR", name: "VimR" },
];

// ============================================
// useApplications Hook
// ============================================

interface UseApplicationsReturn {
  applications: AppInfo[];
  isLoading: boolean;
}

export function useApplications(): UseApplicationsReturn {
  const [applications, setApplications] = useState<AppInfo[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadApplications() {
      setIsLoading(true);
      try {
        const installedApps = await getApplications();
        const installedBundleIds = new Set(
          installedApps.map((app) => app.bundleId).filter(Boolean)
        );

        // Filter: only show supported IDEs that are installed
        const availableIDEs = SUPPORTED_IDES.filter((ide) =>
          installedBundleIds.has(ide.bundleId)
        );

        // Get full app info (path)
        const appInfos: AppInfo[] = availableIDEs.map((ide) => {
          const installedApp = installedApps.find(
            (app) => app.bundleId === ide.bundleId
          );
          return {
            name: ide.name,
            bundleId: ide.bundleId,
            path: installedApp?.path || "",
          };
        });

        setApplications(appInfos);
      } catch (error) {
        console.error("Failed to load applications:", error);
      } finally {
        setIsLoading(false);
      }
    }

    loadApplications();
  }, []);

  return { applications, isLoading };
}
