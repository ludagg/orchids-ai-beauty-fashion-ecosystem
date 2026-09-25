import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';
import ARTryOn from './ARTryOn';

// @vitest-environment jsdom

// Mock HTMLMediaElement methods
if (typeof window !== 'undefined') {
  window.HTMLMediaElement.prototype.play = vi.fn();
  window.HTMLMediaElement.prototype.pause = vi.fn();
}

describe('ARTryOn Component', () => {
  let originalGetUserMedia: any;

  beforeEach(() => {
    // Mock navigator.mediaDevices.getUserMedia
    originalGetUserMedia = navigator.mediaDevices ? navigator.mediaDevices.getUserMedia : undefined;

    if (typeof navigator !== 'undefined') {
      const mockGetUserMedia = vi.fn().mockResolvedValue({
        getTracks: () => [{ stop: vi.fn() }]
      });

      if (!navigator.mediaDevices) {
        (navigator as any).mediaDevices = {};
      }
      navigator.mediaDevices.getUserMedia = mockGetUserMedia;
    }
  });

  afterEach(() => {
    // Restore navigator.mediaDevices.getUserMedia
    if (typeof navigator !== 'undefined' && navigator.mediaDevices) {
      navigator.mediaDevices.getUserMedia = originalGetUserMedia;
    }
    vi.restoreAllMocks();
  });

  it('renders the Try On button', () => {
    render(<ARTryOn />);
    const buttons = screen.queryAllByRole('button', { name: /AR Try-On Mode/i });
    expect(buttons.length).toBeGreaterThan(0);
  });

  it('opens the dialog and requests camera access when clicked', async () => {
    render(<ARTryOn />);
    const buttons = screen.getAllByRole('button', { name: /AR Try-On Mode/i });

    // Use the first matched button since Dialog might render multiple for accessibility
    fireEvent.click(buttons[0]);

    await waitFor(() => {
      expect(navigator.mediaDevices.getUserMedia).toHaveBeenCalledWith({
        video: { facingMode: 'user' }
      });
    });
  });
});
