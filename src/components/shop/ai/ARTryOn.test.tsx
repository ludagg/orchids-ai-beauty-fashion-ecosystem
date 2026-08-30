// @vitest-environment jsdom
import { render, screen, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import * as matchers from '@testing-library/jest-dom/matchers';
import { ARTryOn } from "./ARTryOn";

expect.extend(matchers);

// Mock matchMedia if not present
if (typeof window !== "undefined" && !window.matchMedia) {
  Object.defineProperty(window, "matchMedia", {
    writable: true,
    value: vi.fn().mockImplementation((query) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: vi.fn(), // Deprecated
      removeListener: vi.fn(), // Deprecated
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })),
  });
}

describe("ARTryOn Component", () => {
  let mockGetUserMedia: any;
  let mockStop: any;

  beforeEach(() => {
    mockStop = vi.fn();
    const mockStream = {
      getTracks: () => [{ stop: mockStop }],
    };

    mockGetUserMedia = vi.fn().mockResolvedValue(mockStream);

    // Provide fallback for navigator.mediaDevices
    if (typeof navigator !== "undefined") {
      Object.defineProperty(navigator, "mediaDevices", {
        value: { getUserMedia: mockGetUserMedia },
        writable: true,
        configurable: true,
      });
    }
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("renders loading state initially", async () => {
    render(<ARTryOn productImage="/test.jpg" productName="Test Product" />);
    expect(screen.getByText("Starting Camera...")).toBeInTheDocument();
  });

  it("calls getUserMedia to start camera", async () => {
    render(<ARTryOn productImage="/test.jpg" productName="Test Product" />);

    await waitFor(() => {
      expect(mockGetUserMedia).toHaveBeenCalledWith({
        video: { facingMode: "user" },
      });
    });

    // Loading should disappear
    await waitFor(() => {
      expect(screen.queryByText("Starting Camera...")).not.toBeInTheDocument();
    });
  });

  it("displays product image", async () => {
    render(<ARTryOn productImage="/test.jpg" productName="Test Product" />);
    const imgs = screen.getAllByAltText("Test Product");
    expect(imgs.length).toBeGreaterThan(0);
    expect(imgs[0]).toBeInTheDocument();
  });

  it("handles camera error gracefully", async () => {
    mockGetUserMedia.mockRejectedValue(new Error("Camera access denied"));

    render(<ARTryOn productImage="/test.jpg" productName="Test Product" />);

    await waitFor(() => {
      expect(screen.getByText("Camera access denied")).toBeInTheDocument();
      expect(screen.getByText("Try Again")).toBeInTheDocument();
    });
  });

  it("cleans up camera tracks on unmount", async () => {
    const { unmount } = render(
      <ARTryOn productImage="/test.jpg" productName="Test Product" />
    );

    await waitFor(() => {
      expect(mockGetUserMedia).toHaveBeenCalled();
    });

    unmount();

    expect(mockStop).toHaveBeenCalled();
  });
});
