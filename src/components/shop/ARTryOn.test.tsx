import { describe, it, expect, vi, beforeEach, beforeAll } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ARTryOn } from './ARTryOn';

// Mock matchMedia which is often needed by Dialog components
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

describe('ARTryOn Component', () => {
  it('renders the trigger button initially', () => {
    render(<ARTryOn productImage="/test.jpg" productName="Test Product" />);
    expect(screen.getAllByText('Virtual Try-On (AR)')[0]).toBeDefined();
  });
});
