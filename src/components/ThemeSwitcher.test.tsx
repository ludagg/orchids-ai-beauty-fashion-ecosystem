import "../test-setup";
import { describe, it, expect } from "vitest";
import React from "react";
import { ThemeSwitcher } from "./ThemeSwitcher";

const { render, screen, fireEvent } = require("@testing-library/react");

describe("ThemeSwitcher", () => {
  it("renders theme switcher button", () => {
    render(<ThemeSwitcher />);
    const button = screen.getByRole("button");
    expect(button).toBeDefined();
  });
});
