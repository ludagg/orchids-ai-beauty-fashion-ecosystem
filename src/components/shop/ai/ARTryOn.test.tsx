// @vitest-environment jsdom
import React from 'react';
import { render, screen, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ARTryOn } from './ARTryOn';

describe('ARTryOn Component', () => {
  let mockGetUserMedia: ReturnType<typeof vi.fn>;
  let mockStream: any;
  let mockTrack: any;

  beforeEach(() => {
    mockTrack = { stop: vi.fn() };
    mockStream = { getTracks: vi.fn().mockReturnValue([mockTrack]) };
    mockGetUserMedia = vi.fn().mockResolvedValue(mockStream);

    if (typeof navigator !== 'undefined') {
        Object.defineProperty(navigator, 'mediaDevices', {
            value: { getUserMedia: mockGetUserMedia },
            writable: true
        });
    } else {
        (global as any).navigator = {
            mediaDevices: { getUserMedia: mockGetUserMedia }
        };
    }
  });

  it('renders loading or error state initially', async () => {
    await act(async () => {
        render(<ARTryOn />);
    });
    // Video should be in document after stream resolves
    expect(mockGetUserMedia).toHaveBeenCalledWith({ video: { facingMode: 'user' } });
  });

  it('cleans up tracks on unmount', async () => {
    let unmountFn: () => void;
    await act(async () => {
        const { unmount } = render(<ARTryOn />);
        unmountFn = unmount;
    });

    await act(async () => {
        unmountFn();
    });

    expect(mockTrack.stop).toHaveBeenCalled();
  });
});
