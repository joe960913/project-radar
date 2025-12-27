import { List } from "@raycast/api";
import { useState } from "react";
import { useProjects, SORT_OPTIONS, SortOption } from "./hooks/useProjects";
import { ProjectListItem, EmptyView } from "./components";
import { ProjectWithStatus } from "./types";

// ============================================
// Go Command - Main Project Launcher
// ============================================

export default function GoCommand() {
  const { projects, groups, isLoading, refresh, deleteProject, toggleFavorite, sortBy, setSortBy } = useProjects();
  const [selectedGroup, setSelectedGroup] = useState<string>("all");

  // Filter projects by selected group
  const filteredProjects =
    selectedGroup === "all"
      ? projects
      : selectedGroup === "favorites"
        ? projects.filter((p) => p.isFavorite)
        : selectedGroup === "ungrouped"
          ? projects.filter((p) => !p.group)
          : projects.filter((p) => p.group === selectedGroup);

  // Group projects for sections
  const groupedProjects = groupProjectsByCategory(filteredProjects);

  return (
    <List
      isLoading={isLoading}
      searchBarPlaceholder="Search projects..."
      searchBarAccessory={
        <List.Dropdown
          tooltip="Filter & Sort"
          value={`${selectedGroup}|${sortBy}`}
          onChange={(value) => {
            const [group, sort] = value.split("|");
            if (group) setSelectedGroup(group);
            if (sort) setSortBy(sort as SortOption);
          }}
        >
          <List.Dropdown.Section title="Filter">
            <List.Dropdown.Item title="All Projects" value={`all|${sortBy}`} />
            <List.Dropdown.Item title="Favorites" value={`favorites|${sortBy}`} />
            {groups.map((group) => (
              <List.Dropdown.Item key={group} title={group} value={`${group}|${sortBy}`} />
            ))}
            <List.Dropdown.Item title="Ungrouped" value={`ungrouped|${sortBy}`} />
          </List.Dropdown.Section>
          <List.Dropdown.Section title="Sort">
            {SORT_OPTIONS.map((option) => (
              <List.Dropdown.Item
                key={option.value}
                title={option.title}
                value={`${selectedGroup}|${option.value}`}
              />
            ))}
          </List.Dropdown.Section>
        </List.Dropdown>
      }
    >
      {filteredProjects.length === 0 && !isLoading ? (
        <EmptyView groups={groups} onProjectAdded={refresh} />
      ) : (
        Object.entries(groupedProjects).map(([section, sectionProjects]) => (
          <List.Section key={section} title={section}>
            {sectionProjects.map((project) => (
              <ProjectListItem
                key={project.id}
                project={project}
                groups={groups}
                onRefresh={refresh}
                onDelete={deleteProject}
                onToggleFavorite={toggleFavorite}
              />
            ))}
          </List.Section>
        ))
      )}
    </List>
  );
}

// ============================================
// Helper Functions
// ============================================

function groupProjectsByCategory(
  projects: ProjectWithStatus[]
): Record<string, ProjectWithStatus[]> {
  const result: Record<string, ProjectWithStatus[]> = {};

  // First, favorites
  const favorites = projects.filter((p) => p.isFavorite);
  if (favorites.length > 0) {
    result["Favorites"] = favorites;
  }

  // Then, group by group name
  const nonFavorites = projects.filter((p) => !p.isFavorite);
  const grouped = new Map<string, ProjectWithStatus[]>();

  for (const project of nonFavorites) {
    const groupName = project.group || "Ungrouped";
    if (!grouped.has(groupName)) {
      grouped.set(groupName, []);
    }
    grouped.get(groupName)!.push(project);
  }

  // Sort groups alphabetically, but put Ungrouped last
  const sortedGroups = [...grouped.keys()].sort((a, b) => {
    if (a === "Ungrouped") return 1;
    if (b === "Ungrouped") return -1;
    return a.localeCompare(b);
  });

  for (const groupName of sortedGroups) {
    result[groupName] = grouped.get(groupName)!;
  }

  return result;
}
