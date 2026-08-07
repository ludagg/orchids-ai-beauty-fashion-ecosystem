// @vitest-environment jsdom
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { ARTryOn } from './ARTryOn';
import React from 'react';

// Mock matchMedia to prevent JSDOM errors with Radix UI
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(), // deprecated
    removeListener: vi.fn(), // deprecated
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

// Mock PointerEvent to prevent JSDOM Radix UI errors
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

// Mock ResizeObserver
class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
}
window.ResizeObserver = ResizeObserver;

const mockGetUserMedia = vi.fn();

describe('ARTryOn', () => {
  let originalMediaDevices: any;

  beforeEach(() => {
    // Setup navigator.mediaDevices mock
    originalMediaDevices = global.navigator.mediaDevices;
    Object.defineProperty(global.navigator, 'mediaDevices', {
      writable: true,
      value: {
        getUserMedia: mockGetUserMedia,
      },
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
    Object.defineProperty(global.navigator, 'mediaDevices', {
      writable: true,
      value: originalMediaDevices,
    });
  });

  it('renders the virtual try-on trigger button', () => {
    const { getAllByRole } = render(<ARTryOn />);
    expect(getAllByRole('button', { name: /virtual try-on/i })[0]).toBeDefined();
  });

  it('opens the dialog and attempts to start the camera', async () => {
    // Mock successful camera access
    const mockStream = {
      getTracks: () => [{ stop: vi.fn() }],
    };
    mockGetUserMedia.mockResolvedValue(mockStream);

    const { getAllByRole, getByText } = render(<ARTryOn />);

    const trigger = getAllByRole('button', { name: /virtual try-on/i })[0];
    fireEvent.click(trigger);

    // Wait for the dialog title to be present
    await waitFor(() => {
      expect(getByText('AR Try-On')).toBeDefined();
    });

    // Check if camera access was requested
    expect(mockGetUserMedia).toHaveBeenCalledWith({ video: { facingMode: 'user' } });
  });

  it('displays an error if camera access is denied', async () => {
    // Mock failed camera access
    mockGetUserMedia.mockRejectedValue(new Error('Permission denied'));

    const { getAllByRole, getByText, getAllByText } = render(<ARTryOn />);

    const trigger = getAllByRole('button', { name: /virtual try-on/i })[0];
    fireEvent.click(trigger);

    await waitFor(() => {
      expect(getAllByText('Unable to access camera. Please check your permissions.')[0]).toBeDefined();
    });

    // Check if Try Again button appears
    expect(getAllByRole('button', { name: /try again/i })[0]).toBeDefined();
  });
});