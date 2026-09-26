// @vitest-environment jsdom

import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import * as matchers from '@testing-library/jest-dom/matchers';
import { AIFitCheckDialog } from './AIFitCheckDialog';

expect.extend(matchers);

// Mock Dialog Portal/Overlay behavior to keep it simple in JSDOM
vi.mock('@/components/ui/dialog', () => {
    return {
        Dialog: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
        DialogTrigger: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
        DialogContent: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
        DialogHeader: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
        DialogTitle: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
        DialogDescription: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
    }
});

vi.mock('@/components/ui/select', () => {
    return {
        Select: ({ children, onValueChange }: any) => (
             <div data-testid="mock-select" onClick={() => onValueChange('athletic')}>
                 {children}
             </div>
        ),
        SelectTrigger: ({ children }: any) => <button>{children}</button>,
        SelectValue: ({ placeholder }: any) => <span>{placeholder}</span>,
        SelectContent: ({ children }: any) => <div>{children}</div>,
        SelectItem: ({ children, value }: any) => <div data-value={value}>{children}</div>,
    }
});

// Setup globals required by Radix UI
if (typeof window !== 'undefined') {
  class MockPointerEvent extends Event {
    button: number;
    ctrlKey: boolean;
    pointerType: string;

    constructor(type: string, props: PointerEventInit) {
      super(type, props);
      this.button = props.button || 0;
      this.ctrlKey = props.ctrlKey || false;
      this.pointerType = props.pointerType || 'mouse';
    }
  }
  window.PointerEvent = MockPointerEvent as any;
  window.HTMLElement.prototype.scrollIntoView = vi.fn();
  window.HTMLElement.prototype.hasPointerCapture = vi.fn();
  window.HTMLElement.prototype.releasePointerCapture = vi.fn();

  class MockResizeObserver {
      observe() {}
      unobserve() {}
      disconnect() {}
  }
  window.ResizeObserver = MockResizeObserver;
}

global.fetch = vi.fn();

describe('AIFitCheckDialog', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (global.fetch as any).mockResolvedValue({
      ok: true,
      json: async () => ({ height: '', weight: '', bodyType: '' }),
    });
  });

  it('renders trigger button correctly', () => {
    render(<AIFitCheckDialog productId="p1" productName="Cool Shirt" />);
    expect(screen.getByText('AI Fit Check')).toBeInTheDocument();
  });

  it('shows measurement inputs when no recommendation exists', async () => {
    render(<AIFitCheckDialog productId="p1" productName="Cool Shirt" />);
    // The dialog trigger button itself says "AI Fit Check", but the dialog content also renders "AI Fit Analysis" when triggered
    // Since we mocked Radix to always render children, we might find multiple elements or just one based on our mock.
    // We use queryAllByText to avoid "Found multiple elements" error if Radix renders multiple nodes.
    expect(screen.queryAllByText('AI Fit Analysis').length).toBeGreaterThan(0);
    expect(screen.getByLabelText('Height (cm)')).toBeInTheDocument();
    expect(screen.getByLabelText('Weight (kg)')).toBeInTheDocument();
  });

  it('handles API failure gracefully when updating', async () => {
    (global.fetch as any)
      .mockResolvedValueOnce({ ok: true, json: async () => ({}) }) // GET
      .mockResolvedValueOnce({ ok: false }); // PATCH

    render(<AIFitCheckDialog productId="p1" productName="Cool Shirt" />);

    // Fill out form
    fireEvent.change(screen.getByLabelText('Height (cm)'), { target: { value: '180' } });
    fireEvent.change(screen.getByLabelText('Weight (kg)'), { target: { value: '75' } });

    // Simulate select change - pick the first one since we mocked Select to render children directly
    const mockSelects = screen.getAllByTestId('mock-select');
    fireEvent.click(mockSelects[0]);

    const saveButtons = screen.getAllByRole('button', { name: /Save & Analyze/i });
    expect(saveButtons[0]).not.toBeDisabled();

    fireEvent.click(saveButtons[0]);

    await waitFor(() => {
        expect(global.fetch).toHaveBeenCalledTimes(2);
    });
  });
});
