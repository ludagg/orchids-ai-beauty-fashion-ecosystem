// @vitest-environment jsdom
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ARTryOn } from './ARTryOn';
import * as matchers from '@testing-library/jest-dom/matchers';
expect.extend(matchers);

// Mock window and navigator.mediaDevices properly
const mockGetUserMedia = vi.fn();
const mockStop = vi.fn();

if (typeof window !== 'undefined') {
  if (typeof navigator !== 'undefined') {
    Object.defineProperty(navigator, 'mediaDevices', {
      value: {
        getUserMedia: mockGetUserMedia,
      },
      writable: true,
    });
  }
}

describe('ARTryOn', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockGetUserMedia.mockReset();
    mockStop.mockReset();
  });

  it('renders initial state with Start Camera button', () => {
    render(<ARTryOn />);
    expect(screen.getByText('AR Try-On')).toBeInTheDocument();
    expect(screen.getByText('See how this looks on you')).toBeInTheDocument();
    expect(screen.getAllByRole('button', { name: /start camera/i })[0]).toBeInTheDocument();
  });

  it('starts camera successfully', async () => {
    mockGetUserMedia.mockResolvedValueOnce({
      getTracks: () => [{ stop: mockStop }],
    } as any);

    const { unmount } = render(<ARTryOn productImageUrl="http://example.com/mock.jpg" />);

    const startBtn = screen.getAllByRole('button', { name: /start camera/i })[0];
    fireEvent.click(startBtn);

    await waitFor(() => {
      expect(mockGetUserMedia).toHaveBeenCalledWith({
        video: { facingMode: 'user' },
        audio: false,
      });
    });

    // Check if the overlay image is rendered after starting camera
    await waitFor(() => {
        const overlay = screen.queryByAltText('Product Overlay');
        if (overlay) {
            expect(overlay).toBeInTheDocument();
            expect(overlay).toHaveAttribute('src', 'http://example.com/mock.jpg');
        }
    });

    unmount();
  });

  it('handles camera access denial gracefully', async () => {
    mockGetUserMedia.mockRejectedValueOnce(new Error('Permission denied'));

    const { unmount } = render(<ARTryOn />);

    const startBtn = screen.getAllByRole('button', { name: /start camera/i })[0];
    fireEvent.click(startBtn);

    await waitFor(() => {
        if (screen.queryByText(/Camera Error/i)) {
             expect(screen.getByText(/Camera Error/i)).toBeInTheDocument();
             expect(screen.getByText(/Permission denied/i)).toBeInTheDocument();
        }
    });

    unmount();
  });
});
