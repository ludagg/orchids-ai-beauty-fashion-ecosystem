// @vitest-environment jsdom
import { render, screen, fireEvent, act, cleanup } from '@testing-library/react';
import { ARTryOn } from './ARTryOn';
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';

describe('ARTryOn', () => {
  let mockGetUserMedia: any;

  beforeEach(() => {
    mockGetUserMedia = vi.fn().mockResolvedValue({
      getTracks: () => [
        { stop: vi.fn() }
      ]
    });

    if (typeof navigator !== 'undefined') {
      Object.defineProperty(navigator, 'mediaDevices', {
        value: {
          getUserMedia: mockGetUserMedia
        },
        configurable: true
      });
    } else {
        // Fallback for extremely strict environments where navigator isn't patched by JSDOM yet
        global.navigator = {
            mediaDevices: {
                getUserMedia: mockGetUserMedia
            }
        } as any;
    }

    // Mock HTMLMediaElement play
    if (typeof window !== 'undefined' && window.HTMLMediaElement) {
        window.HTMLMediaElement.prototype.play = vi.fn().mockResolvedValue(undefined);
    }
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
