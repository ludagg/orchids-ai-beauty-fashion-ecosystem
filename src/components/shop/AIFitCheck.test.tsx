import { expect, test, describe, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { AIFitCheck } from './AIFitCheck';

const { mockUseSession } = vi.hoisted(() => ({
  mockUseSession: vi.fn().mockReturnValue({ data: { user: { id: 'user-1' } } }),
}));

vi.mock('@/lib/auth-client', () => ({
  useSession: mockUseSession,
}));

vi.mock('sonner', () => ({
  toast: {
    error: vi.fn(),
    success: vi.fn(),
  },
}));

// Mock fetch
global.fetch = vi.fn();

describe('AIFitCheck Component', () => {
  const mockProduct = { id: 'prod-1', name: 'Test Product' };

  test('renders login prompt when unauthenticated', () => {
    mockUseSession.mockReturnValueOnce({ data: null });
    render(<AIFitCheck product={mockProduct} />);
    expect(screen.getByText('AI Fit Check Available')).toBeDefined();
    expect(screen.getByText('Log in to find your perfect size')).toBeDefined();
  });

  test('renders AI Fit Check trigger when authenticated', () => {
    mockUseSession.mockReturnValueOnce({ data: { user: { id: 'user-1' } } });
    render(<AIFitCheck product={mockProduct} />);
    expect(screen.getByText('Check your perfect size')).toBeDefined();
  });
});
