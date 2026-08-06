// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { AIFitCheck } from "./AIFitCheck";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";

vi.mock("@/lib/auth-client", () => ({
  authClient: {
    useSession: vi.fn(),
  },
}));

vi.mock("sonner", () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

global.fetch = vi.fn();

class MockPointerEvent extends Event {
  button: number;
  ctrlKey: boolean;
  pointerType: string;

  constructor(type: string, props: PointerEventInit) {
    super(type, props);
    this.button = props.button || 0;
    this.ctrlKey = props.ctrlKey || false;
    this.pointerType = props.pointerType || "mouse";
  }
}

global.PointerEvent = MockPointerEvent as any;
global.ResizeObserver = class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
};

describe("AIFitCheck", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders trigger correctly", () => {
    vi.mocked(authClient.useSession).mockReturnValue({ data: null } as any);
    render(<AIFitCheck productId="test-prod" />);

    expect(screen.getByText("AI Fit Analysis")).toBeDefined();
    expect(screen.getByText("Find your perfect size")).toBeDefined();
  });
});
