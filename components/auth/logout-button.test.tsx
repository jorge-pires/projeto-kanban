import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

vi.mock("@/app/(dashboard)/actions", () => ({
  logoutUser: vi.fn(),
}));

import { LogoutButton } from "@/components/auth/logout-button";

describe("LogoutButton", () => {
  it("renders a real submit action in the sidebar variant", () => {
    render(<LogoutButton variant="sidebar" />);

    const button = screen.getByRole("button", { name: "Sair" });

    expect(button).toHaveAttribute("type", "submit");
    expect(button).toHaveClass("w-full");
    expect(button.closest("form")).toBeInTheDocument();
  });
});
