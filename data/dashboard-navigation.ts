export interface DashboardNavigationItem {
  label: string;
  href: string;
  shortLabel: string;
}

export const dashboardNavigation: DashboardNavigationItem[] = [
  {
    label: "Dashboard",
    href: "/dashboard",
    shortLabel: "D",
  },
  {
    label: "Tarefas",
    href: "/tasks",
    shortLabel: "T",
  },
  {
    label: "Projetos",
    href: "/projects",
    shortLabel: "P",
  },
  {
    label: "Calendário",
    href: "/calendar",
    shortLabel: "C",
  },
  {
    label: "Perfil",
    href: "/profile",
    shortLabel: "PF",
  },
];
