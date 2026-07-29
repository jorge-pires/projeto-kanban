export interface NavigationLink {
  label: string
  href: string
  external?: boolean
}

export const navigationLinks: NavigationLink[] = [
  {
    label: "Início",
    href: "#home",
  },
  {
    label: "Recursos",
    href: "#features",
  },
  {
    label: "Sobre",
    href: "#about",
  },
  {
    label: "GitHub",
    href: "https://github.com/jorge-pires/projeto-kanban",
    external: true,
  },
]