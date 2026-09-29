// @vitest-environment jsdom
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { AIFitCheckDialog } from './AIFitCheckDialog';
import { authClient } from '@/lib/auth-client';
import * as matchers from '@testing-library/jest-dom/matchers';
expect.extend(matchers);

// Mock Dialog trigger properly so it renders contents
vi.mock('@/components/ui/dialog', () => ({
  Dialog: ({ children, open, onOpenChange }: any) => <div data-testid="dialog">{children}</div>,
  DialogTrigger: ({ children }: any) => <div data-testid="dialog-trigger">{children}</div>,
  DialogContent: ({ children }: any) => <div data-testid="dialog-content">{children}</div>,
  DialogHeader: ({ children }: any) => <div>{children}</div>,
  DialogTitle: ({ children }: any) => <h2>{children}</h2>,
  DialogDescription: ({ children }: any) => <p>{children}</p>,
}));

vi.mock('@/lib/auth-client', () => ({
  authClient: {
    useSession: vi.fn(),
  },
}));

// Mock fetch globally
global.fetch = vi.fn();

describe('AIFitCheckDialog', () => {
  const mockProduct = {
    name: 'Test Shirt',
    brand: 'Test Brand',
    category: 'Shirt',
    description: 'A nice test shirt',
    sizes: [{ name: 'S' }, { name: 'M' }, { name: 'L' }],
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders sign in prompt when user is not logged in', () => {
    (authClient.useSession as any).mockReturnValue({ data: null, isPending: false });

    render(<AIFitCheckDialog product={mockProduct} />);

    expect(screen.getByText('Try AI Fit Check')).toBeInTheDocument();
    expect(screen.getByText('Sign in to find your perfect size')).toBeInTheDocument();
  });

  it('renders fit check button when user is logged in', () => {
    (authClient.useSession as any).mockReturnValue({
      data: { user: { id: '1', name: 'Test User' } },
      isPending: false,
    });

    // Mock initial measurements fetch to return empty
    (global.fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ height: null, weight: null, bodyType: null }),
    });

    render(<AIFitCheckDialog product={mockProduct} />);

    expect(screen.getByText('AI Fit Check')).toBeInTheDocument();
    expect(screen.getByText('Find your perfect size based on your profile')).toBeInTheDocument();
  });
});
