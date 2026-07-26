import { expect, test, describe } from 'vitest';
import { render, screen } from '@testing-library/react';
import { CompareDialog } from './CompareDialog';

describe('CompareDialog Component', () => {
    test('renders nothing if no items', () => {
        const { container } = render(<CompareDialog items={[]} onClear={() => {}} />);
        expect(container.firstChild).toBeNull();
    });

    test('renders floating button if items are selected', () => {
        const items = [{ id: "1", name: "Item 1" }];
        render(<CompareDialog items={items} onClear={() => {}} />);
        expect(screen.getByText('1 selected')).toBeDefined();
        expect(screen.getByText('Compare')).toBeDefined();
    });
});