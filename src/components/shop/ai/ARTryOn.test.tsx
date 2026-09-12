// @vitest-environment jsdom
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import ARTryOn from './ARTryOn';

describe('ARTryOn', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        if (typeof navigator !== 'undefined') {
            Object.defineProperty(navigator, 'mediaDevices', {
                value: {
                    getUserMedia: vi.fn().mockResolvedValue({
                        getTracks: () => [{ stop: vi.fn() }]
                    })
                },
                configurable: true
            });
        }
    });

    const mockProduct = {
        mainImageUrl: "test.jpg"
    };

    it('renders the initial button', () => {
        render(<ARTryOn product={mockProduct} />);
        expect(screen.getAllByText(/Try On Visually \(AR\)/i)[0]).toBeDefined();
    });

    it('attempts to start camera when clicked', async () => {
        render(<ARTryOn product={mockProduct} />);
        const btn = screen.getAllByText(/Try On Visually \(AR\)/i)[0];
        fireEvent.click(btn);

        expect(navigator.mediaDevices.getUserMedia).toHaveBeenCalledWith({
            video: { facingMode: "user" },
            audio: false
        });
    });
});
