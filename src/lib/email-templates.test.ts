import { describe, it, expect } from 'bun:test';
import { EmailTemplates } from './email-templates';

describe('EmailTemplates', () => {
    it('should generate bookingConfirmation correctly', () => {
        const mockUser = { name: 'John Doe' };
        const mockBooking = {
            salon: { name: 'Super Cuts' },
            service: { name: 'Haircut' },
            startTime: '2025-01-01T10:00:00.000Z',
            totalPrice: 1500
        };

        const html = EmailTemplates.bookingConfirmation(mockBooking, mockUser);

        expect(html).toContain('John Doe');
        expect(html).toContain('Super Cuts');
        expect(html).toContain('Haircut');
        expect(html).toContain(process.env.NEXT_PUBLIC_APP_URL || '');
        // Price should be formatted, checking partial to avoid exact locale discrepancies
        expect(html).toContain('15');
    });

    it('should generate bookingCancellation correctly', () => {
        const mockUser = { name: 'Jane Doe' };
        const mockBooking = {
            salon: { id: 'salon-123', name: 'Nail Art' }
        };

        const html = EmailTemplates.bookingCancellation(mockBooking, mockUser);

        expect(html).toContain('Jane Doe');
        expect(html).toContain('Nail Art');
        expect(html).toContain('salon-123');
        expect(html).toContain(process.env.NEXT_PUBLIC_APP_URL || '');
    });

    it('should generate orderConfirmation correctly', () => {
        const mockUser = { name: 'Bob' };
        const mockOrder = {
            id: 'ORD-555',
            items: [
                { product: { name: 'Shampoo' }, quantity: 2, priceAtPurchase: 500 }
            ],
            totalAmount: 1000
        };

        const html = EmailTemplates.orderConfirmation(mockOrder, mockUser);

        expect(html).toContain('Bob');
        expect(html).toContain('ORD-555');
        expect(html).toContain('Shampoo (x2)');
        expect(html).toContain(process.env.NEXT_PUBLIC_APP_URL || '');
    });
});
