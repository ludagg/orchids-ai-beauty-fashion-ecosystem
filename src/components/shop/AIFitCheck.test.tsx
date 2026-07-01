import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { expect, test, describe, vi, beforeEach } from 'vitest';
import { AIFitCheck } from './AIFitCheck';

const { mockUseSession } = vi.hoisted(() => ({
    mockUseSession: vi.fn(),
}));

vi.mock('@/lib/auth-client', () => ({
    useSession: mockUseSession,
}));

describe('AIFitCheck Component', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        global.fetch = vi.fn();
    });

    test('renders trigger button', () => {
        mockUseSession.mockReturnValue({ data: null });
        render(<AIFitCheck product={{ id: 'p1' }} />);

        expect(screen.getByText('AI Fit Check')).toBeDefined();
    });
});
