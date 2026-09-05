// @vitest-environment jsdom

import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { ARTryOn } from './ARTryOn';
import * as matchers from '@testing-library/jest-dom/matchers';
expect.extend(matchers);

// Mock Next.js utilities
vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: vi.fn() }),
}));

describe('ARTryOn Component', () => {
  let mockGetUserMedia: any;
  let mockStream: any;
  let mockTrack: any;

  beforeEach(() => {
    mockTrack = { stop: vi.fn() };
    mockStream = {
      getTracks: vi.fn().mockReturnValue([mockTrack]),
    };

    mockGetUserMedia = vi.fn().mockResolvedValue(mockStream);

    if (typeof global.navigator === 'undefined') {
        (global as any).navigator = {
            mediaDevices: {
                getUserMedia: mockGetUserMedia
            }
        };
    } else {
        Object.defineProperty(global.navigator, 'mediaDevices', {
            value: { getUserMedia: mockGetUserMedia },
            writable: true,
        });
    }

    // Mock HTMLMediaElement.play
    if (typeof window !== 'undefined') {
        window.HTMLMediaElement.prototype.play = vi.fn().mockResolvedValue(undefined);
    }
  });

  afterEach(() => {
    vi.clearAllMocks();
    document.body.innerHTML = '';
  });

  it('renders initial state correctly', () => {
    render(<ARTryOn productName="Test Glasses" />);

    expect(screen.getByText('Virtual Try-On')).toBeInTheDocument();
    expect(screen.getByText('See how Test Glasses looks on you')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /try it on/i })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /close/i })).not.toBeInTheDocument();
  });

  it('starts camera when "Try it on" is clicked', async () => {
    render(<ARTryOn />);

    const startButton = screen.getByRole('button', { name: /try it on/i });
    fireEvent.click(startButton);

    expect(mockGetUserMedia).toHaveBeenCalledWith({
      video: { facingMode: 'user' },
      audio: false,
    });

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /close/i })).toBeInTheDocument();
      expect(screen.getByText('Align face here')).toBeInTheDocument();
      expect(screen.getByText('AI computing fit...')).toBeInTheDocument();
    });
  });

  it('stops camera when "Close" is clicked', async () => {
    render(<ARTryOn />);

    const startButton = screen.getByRole('button', { name: /try it on/i });
    fireEvent.click(startButton);

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /close/i })).toBeInTheDocument();
    });

    const closeButton = screen.getByRole('button', { name: /close/i });
    fireEvent.click(closeButton);

    expect(mockTrack.stop).toHaveBeenCalled();

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /try it on/i })).toBeInTheDocument();
      expect(screen.queryByText('Align face here')).not.toBeInTheDocument();
    });
  });

  it('displays error message if camera access fails', async () => {
    const errorMsg = 'Not allowed';
    mockGetUserMedia.mockRejectedValueOnce(new Error(errorMsg));

    render(<ARTryOn />);

    const startButton = screen.getByRole('button', { name: /try it on/i });
    fireEvent.click(startButton);

    await waitFor(() => {
      expect(screen.getByText(errorMsg)).toBeInTheDocument();
    });
  });
});
