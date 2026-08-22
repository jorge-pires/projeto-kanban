import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

vi.mock("next/navigation", () => ({
  usePathname: () => "/projects",
}));

vi.mock("@/components/auth/logout-button", () => ({
  LogoutButton: () => <button type="button">Sair</button>,
}));

import { DashboardShell } from "@/components/dashboard/dashboard-shell";

describe("DashboardShell", () => {
  it("marks the current navigation page", () => {
    render(
      <DashboardShell user={{ name: "Jorge Pires", email: "j@example.com" }}>
        <p>Conteúdo</p>
      </DashboardShell>,
    );

    expect(
      screen.getByRole("link", {
        name: "Projetos",
      }),
    ).toHaveAttribute("aria-current", "page");
  });

  it("closes the mobile dialog with Escape and restores focus", async () => {
    const user = userEvent.setup();

    render(
      <DashboardShell user={{ name: "Jorge Pires", email: "j@example.com" }}>
        <p>Conteúdo</p>
      </DashboardShell>,
    );

    const menuButton = screen.getByRole("button", {
      name: "Abrir menu de navegação",
    });

    await user.click(menuButton);

    expect(
      screen.getByRole("dialog", { name: "Menu de navegação" }),
    ).toBeVisible();
    expect(document.body.style.overflow).toBe("hidden");

    await user.keyboard("{Escape}");

    expect(
      screen.queryByRole("dialog", { name: "Menu de navegação" }),
    ).not.toBeInTheDocument();

    await waitFor(() => {
      expect(menuButton).toHaveFocus();
      expect(document.body.style.overflow).toBe("");
    });
  });
});
