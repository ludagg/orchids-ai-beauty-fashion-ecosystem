import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import React from "react";
import { ThemeSwitcher } from "./ThemeSwitcher";

const mockSetTheme = vi.fn();
let mockResolvedTheme = "light";

vi.mock("next-themes", () => ({
  useTheme: () => ({
    setTheme: mockSetTheme,
    resolvedTheme: mockResolvedTheme,
  }),
}));

vi.mock("@/components/ui/tooltip", () => ({
  Tooltip: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  TooltipTrigger: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  TooltipContent: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

describe("ThemeSwitcher", () => {
  it("renders dark theme toggle label when theme is light", () => {
    mockResolvedTheme = "light";
    render(<ThemeSwitcher />);

    const button = screen.getByRole("button", { name: "Switch to dark theme" });
    expect(button).toBeDefined();

    fireEvent.click(button);
    expect(mockSetTheme).toHaveBeenCalledWith("dark");
  });

  it("renders light theme toggle label when theme is dark", () => {
    mockResolvedTheme = "dark";
    render(<ThemeSwitcher />);

    const button = screen.getByRole("button", { name: "Switch to light theme" });
    expect(button).toBeDefined();

    fireEvent.click(button);
    expect(mockSetTheme).toHaveBeenCalledWith("light");
  });
});
