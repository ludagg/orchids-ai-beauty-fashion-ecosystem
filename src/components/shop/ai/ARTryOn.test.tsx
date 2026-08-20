// @vitest-environment jsdom
import { render, screen, fireEvent, act, cleanup } from '@testing-library/react';
import { ARTryOn } from './ARTryOn';
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';
import * as matchers from '@testing-library/jest-dom/matchers';
expect.extend(matchers);

// Mock PointerEvent and ResizeObserver for Radix UI Dialog in JSDOM
class MockPointerEvent extends Event {
  button: number;
  ctrlKey: boolean;
  pointerType: string;

  constructor(type: string, props: PointerEventInit) {
    super(type, props);
    this.button = props.button || 0;
    this.ctrlKey = props.ctrlKey || false;
    this.pointerType = props.pointerType || 'mouse';
  }
}
window.PointerEvent = MockPointerEvent as any;
window.HTMLElement.prototype.scrollIntoView = vi.fn();
window.HTMLElement.prototype.hasPointerCapture = vi.fn();
window.HTMLElement.prototype.releasePointerCapture = vi.fn();

global.ResizeObserver = class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
};

describe('ARTryOn', () => {
  let mockGetUserMedia: any;

  beforeEach(() => {
    mockGetUserMedia = vi.fn().mockResolvedValue({
      getTracks: () => [
        { stop: vi.fn() }
      ]
    });

    Object.defineProperty(navigator, 'mediaDevices', {
      value: {
        getUserMedia: mockGetUserMedia
      },
      configurable: true
    });

    // Mock HTMLMediaElement play
    window.HTMLMediaElement.prototype.play = vi.fn().mockResolvedValue(undefined);
  });

  afterEach(() => {
    vi.clearAllMocks();
    cleanup();
  });

  it('renders trigger button correctly', () => {
    render(<ARTryOn />);
    expect(screen.getByRole('button', { name: /Virtual AR Try-On/i })).toBeInTheDocument();
  });

  it('opens dialog and requests camera access', async () => {
    render(<ARTryOn productName="Test Lipstick" />);

    const triggerBtn = screen.getByRole('button', { name: /Virtual AR Try-On/i });
    fireEvent.click(triggerBtn);

    // Check if dialog content is rendered
    expect(screen.getByText('AR Try-On')).toBeInTheDocument();
    expect(screen.getByText(/See how Test Lipstick looks on you/i)).toBeInTheDocument();

    // Give time for async startCamera to resolve
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 50));
    });

    expect(mockGetUserMedia).toHaveBeenCalledWith({
      video: { facingMode: 'user' },
      audio: false
    });
  });
});
