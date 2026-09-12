// @vitest-environment jsdom
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import AIFitCheckDialog from './AIFitCheckDialog';

// Mock matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

// Mock fetch
global.fetch = vi.fn();

describe('AIFitCheckDialog', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    const mockProduct = {
        name: "Test T-Shirt",
        mainCategory: "Clothing",
        brand: "TestBrand",
        sizes: ["S", "M", "L"]
    };

    it('renders the trigger button', () => {
        render(<AIFitCheckDialog product={mockProduct} />);
        expect(screen.getByText(/AI Fit Check/i)).toBeDefined();
        expect(screen.getByText(/Find your perfect size/i)).toBeDefined();
    });
});
