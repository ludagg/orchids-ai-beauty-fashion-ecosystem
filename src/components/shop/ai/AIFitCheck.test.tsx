// @vitest-environment jsdom
import { expect, test, describe, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { AIFitCheck } from './AIFitCheck';

// Mock session hook
const mockUseSession = vi.fn();
vi.mock('@/lib/auth-client', () => ({
    useSession: () => mockUseSession()
}));

// Mock fetch
global.fetch = vi.fn();

describe('AIFitCheck Component', () => {

    test('renders nothing if product has no sizes', () => {
        mockUseSession.mockReturnValue({ data: null });
        const { container } = render(<AIFitCheck product={{ name: "Bag" }} />);
        expect(container.firstChild).toBeNull();
    });

    test('renders trigger if product has sizes', () => {
        mockUseSession.mockReturnValue({ data: null });
        render(<AIFitCheck product={{ sizes: [{ name: "M" }] }} />);
        expect(screen.getByText('AI Fit Check')).toBeDefined();
    });
});