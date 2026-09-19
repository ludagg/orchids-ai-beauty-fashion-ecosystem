// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { ARTryOn } from '@/components/shop/ai/ARTryOn';
import * as matchers from '@testing-library/jest-dom/matchers';
expect.extend(matchers);

// Mock ResizeObserver for Radix UI
const ResizeObserverMock = vi.fn(() => ({
    observe: vi.fn(),
    unobserve: vi.fn(),
    disconnect: vi.fn(),
}));
vi.stubGlobal('ResizeObserver', ResizeObserverMock);
vi.stubGlobal('PointerEvent', class PointerEvent extends Event {});


describe('ARTryOn', () => {
    const mockProduct = { id: 'p1', name: 'Cool Hat', mainImageUrl: '/test-img.jpg' };

    // Mock navigator.mediaDevices
    const mockGetUserMedia = vi.fn();
    const mockMediaStream = {
        getTracks: vi.fn().mockReturnValue([{ stop: vi.fn() }])
    };

    beforeEach(() => {
        vi.clearAllMocks();

        // Setup media devices mock
        Object.defineProperty(global, 'navigator', {
            value: {
                mediaDevices: {
                    getUserMedia: mockGetUserMedia
                }
            },
            configurable: true
        });

        // Mock HTMLVideoElement methods
        window.HTMLMediaElement.prototype.play = vi.fn().mockResolvedValue(undefined);
    });

    it('renders the trigger button', () => {
        render(<ARTryOn product={mockProduct} />);
        expect(screen.getByText('AR Try-On')).toBeInTheDocument();
    });

    it('requests camera access when opened', async () => {
        mockGetUserMedia.mockResolvedValueOnce(mockMediaStream);

        render(<ARTryOn product={mockProduct} />);

        // Open dialog
        const buttons = screen.getAllByText('AR Try-On');
        fireEvent.click(buttons[0]);

        await waitFor(() => {
            expect(mockGetUserMedia).toHaveBeenCalledWith({
                video: { facingMode: "user" },
                audio: false
            });
        });

        // Title should be visible
        expect(screen.getByText('Cool Hat')).toBeInTheDocument();
    });

    it('handles camera permission denial', async () => {
        mockGetUserMedia.mockRejectedValueOnce(new Error('Permission denied'));

        render(<ARTryOn product={mockProduct} />);

        // Open dialog
        const buttons = screen.getAllByText('AR Try-On');
        fireEvent.click(buttons[0]);

        await waitFor(() => {
            expect(screen.getByText(/Permission denied/)).toBeInTheDocument();
        });

        // Error state UI
        expect(screen.getByText('Try Again')).toBeInTheDocument();
    });

    it('cleans up stream tracks on close', async () => {
        const mockStop = vi.fn();
        mockGetUserMedia.mockResolvedValueOnce({
            getTracks: () => [{ stop: mockStop }]
        });

        render(<ARTryOn product={mockProduct} />);

        // Open dialog
        const buttons = screen.getAllByText('AR Try-On');
        fireEvent.click(buttons[0]);

        await waitFor(() => {
            expect(mockGetUserMedia).toHaveBeenCalled();
        });

        // Close dialog via X button
        const closeButtons = screen.getAllByRole('button');
        const closeBtn = closeButtons.find(btn => btn.querySelector('svg.lucide-x'));

        if (closeBtn) fireEvent.click(closeBtn);

        await waitFor(() => {
            expect(mockStop).toHaveBeenCalled();
        });
    });
});
