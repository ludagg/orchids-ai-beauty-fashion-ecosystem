// @vitest-environment jsdom
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { AIFitCheckDialog } from './AIFitCheckDialog';
import { authClient } from '@/lib/auth-client';

vi.mock('@/lib/auth-client', () => ({
    authClient: {
        useSession: vi.fn(),
    }
}));

// Mock ResizeObserver
if (typeof window !== 'undefined') {
    global.ResizeObserver = class {
        observe() {}
        unobserve() {}
        disconnect() {}
    };

    // Mock PointerEvent
    if (!global.PointerEvent) {
        class MockPointerEvent extends MouseEvent {
            pointerId: number;
            constructor(type: string, params: PointerEventInit = {}) {
                super(type, params);
                this.pointerId = params.pointerId || 0;
            }
        }
        global.PointerEvent = MockPointerEvent as any;
    }
}

describe('AIFitCheckDialog', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        global.fetch = vi.fn();
    });

    const mockProduct = {
        name: "Test Shirt",
        category: "Clothing",
        description: "A nice shirt",
        sizes: [{name: 'S'}, {name: 'M'}, {name: 'L'}]
    };

    it('renders the trigger button', () => {
        (authClient.useSession as any).mockReturnValue({ data: null });
        render(<AIFitCheckDialog product={mockProduct} onSizeRecommended={vi.fn()} />);
        expect(screen.queryAllByText('Try AI Fit Check').length).toBeGreaterThan(0);
    });

    it('fetches measurements when opened by authenticated user', async () => {
        (authClient.useSession as any).mockReturnValue({ data: { user: { id: '1' } } });

        (global.fetch as any).mockResolvedValueOnce({
            ok: true,
            json: async () => ({ height: '180', weight: '75', bodyType: 'Slim' })
        }).mockResolvedValueOnce({
            ok: true,
            json: async () => ({ recommendedSize: 'M', explanation: 'Good fit', confidence: 90 })
        });

        render(<AIFitCheckDialog product={mockProduct} onSizeRecommended={vi.fn()} />);

        const triggerButtons = screen.queryAllByText('Try AI Fit Check');
        fireEvent.click(triggerButtons[0]);

        await waitFor(() => {
            expect(global.fetch).toHaveBeenCalledWith('/api/users/profile/measurements');
        });
    });

    it('shows login message if unauthenticated', async () => {
        (authClient.useSession as any).mockReturnValue({ data: null });
        render(<AIFitCheckDialog product={mockProduct} onSizeRecommended={vi.fn()} />);

        const triggerButtons = screen.queryAllByText('Try AI Fit Check');
        fireEvent.click(triggerButtons[0]);

        await waitFor(() => {
            expect(screen.queryAllByText(/Please sign in to save your measurements/i).length).toBeGreaterThan(0);
        });
    });
});