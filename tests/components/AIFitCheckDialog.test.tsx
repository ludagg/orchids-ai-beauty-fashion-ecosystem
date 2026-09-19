// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { AIFitCheckDialog } from '@/components/shop/ai/AIFitCheckDialog';
import { authClient } from '@/lib/auth-client';
import * as matchers from '@testing-library/jest-dom/matchers';
expect.extend(matchers);

// Mock auth client
vi.mock('@/lib/auth-client', () => ({
    authClient: {
        useSession: vi.fn()
    }
}));

// Mock ResizeObserver for Radix UI
const ResizeObserverMock = vi.fn(() => ({
    observe: vi.fn(),
    unobserve: vi.fn(),
    disconnect: vi.fn(),
}));
vi.stubGlobal('ResizeObserver', ResizeObserverMock);
vi.stubGlobal('PointerEvent', class PointerEvent extends Event {});


describe('AIFitCheckDialog', () => {
    const mockProduct = { id: 'p1', name: 'Test Jacket', sizes: [{name: 'M'}] };

    beforeEach(() => {
        vi.clearAllMocks();
        // Setup default fetch mock to prevent actual requests
        global.fetch = vi.fn();
    });

    it('renders the trigger button', () => {
        (authClient.useSession as any).mockReturnValue({ data: null });
        render(<AIFitCheckDialog product={mockProduct} />);

        expect(screen.getByText('AI Fit Check')).toBeInTheDocument();
        expect(screen.getByText('Find your perfect size')).toBeInTheDocument();
    });

    it('shows sign in message when user is not authenticated and dialog is opened', async () => {
        (authClient.useSession as any).mockReturnValue({ data: null });
        render(<AIFitCheckDialog product={mockProduct} />);

        // Open dialog
        const buttons = screen.getAllByText('AI Fit Check');
        fireEvent.click(buttons[0]);

        await waitFor(() => {
            expect(screen.getByText('Please sign in to use the AI Fit Check feature.')).toBeInTheDocument();
        });
    });

    it('fetches profile and shows edit form if measurements are missing', async () => {
        (authClient.useSession as any).mockReturnValue({ data: { user: { id: 'u1' } } });

        // Mock profile fetch returning empty measurements
        (global.fetch as any).mockResolvedValueOnce({
            ok: true,
            json: async () => ({ height: null, weight: null, bodyType: null })
        });

        render(<AIFitCheckDialog product={mockProduct} />);

        // Open dialog
        const buttons = screen.getAllByText('AI Fit Check');
        fireEvent.click(buttons[0]);

        await waitFor(() => {
            expect(global.fetch).toHaveBeenCalledWith('/api/users/profile/measurements');
        }, { timeout: 3000 });

        // Form should be visible
        await waitFor(() => {
            expect(screen.getByLabelText('Height (cm)')).toBeInTheDocument();
            expect(screen.getByLabelText('Weight (kg)')).toBeInTheDocument();
        });
    });

    it('fetches recommendation directly if measurements exist', async () => {
        (authClient.useSession as any).mockReturnValue({ data: { user: { id: 'u1' } } });

        // 1. Mock profile fetch
        (global.fetch as any).mockResolvedValueOnce({
            ok: true,
            json: async () => ({ height: '180', weight: '75', bodyType: 'Athletic' })
        });

        // 2. Mock AI Fit fetch
        (global.fetch as any).mockResolvedValueOnce({
            ok: true,
            json: async () => ({ size: 'L', reasoning: 'Perfect fit', confidence: 90 })
        });

        render(<AIFitCheckDialog product={mockProduct} />);

        // Open dialog
        const buttons = screen.getAllByText('AI Fit Check');
        fireEvent.click(buttons[0]);

        // Verify AI call happens
        await waitFor(() => {
            expect(global.fetch).toHaveBeenCalledTimes(2);
            expect(global.fetch).toHaveBeenNthCalledWith(2, '/api/ai-fit', expect.any(Object));
        });

        // Verify result is displayed
        await waitFor(() => {
            expect(screen.getByText('L')).toBeInTheDocument(); // The size
            expect(screen.getByText('Perfect fit')).toBeInTheDocument(); // The reasoning
        });
    });
});
