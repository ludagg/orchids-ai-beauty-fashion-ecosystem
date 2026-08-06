// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { ARTryOn } from "./ARTryOn";

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

describe("ARTryOn", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders trigger button correctly", () => {
    render(<ARTryOn productId="test-prod" />);

    expect(screen.getByText("Virtual Try-On")).toBeDefined();
  });
});
