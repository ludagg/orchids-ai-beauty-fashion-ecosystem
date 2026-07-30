import { expect, test, describe } from 'bun:test';
import { EmailTemplates } from './email-templates';

describe('EmailTemplates', () => {
    test('bookingConfirmation generates correct HTML', () => {
        const mockBooking = {
            salon: { name: 'Rare Beauty Salon' },
            service: { name: 'Haircut' },
            startTime: new Date('2026-05-15T10:00:00Z'),
            totalPrice: 2500, // 25.00 INR
        };
        const mockUser = { name: 'Alice' };

        const html = EmailTemplates.bookingConfirmation(mockBooking, mockUser);

        expect(html).toContain('Booking Confirmed!');
        expect(html).toContain('Hi Alice,');
        expect(html).toContain('Rare Beauty Salon');
        expect(html).toContain('Haircut');
        // Check for presence of price rather than exact match due to locale differences
        expect(html).toMatch(/25(\.00)?/);
        expect(html).toContain('/app/bookings');
    });

    test('bookingCancellation generates correct HTML', () => {
        const mockBooking = {
            salon: { id: 'salon-123', name: 'Rare Beauty Salon' },
        };
        const mockUser = { name: 'Bob' };

        const html = EmailTemplates.bookingCancellation(mockBooking, mockUser);

        expect(html).toContain('Booking Cancelled');
        expect(html).toContain('Hi Bob,');
        expect(html).toContain('Rare Beauty Salon');
        expect(html).toContain('/app/salons/salon-123');
    });

    test('orderConfirmation generates correct HTML', () => {
        const mockOrder = {
            id: 'ORD-12345',
            items: [
                { product: { name: 'Shampoo' }, quantity: 2, priceAtPurchase: 1500 },
                { product: { name: 'Conditioner' }, quantity: 1, priceAtPurchase: 2000 }
            ],
            totalAmount: 5000 // 50.00 INR
        };
        const mockUser = { name: 'Charlie' };

        const html = EmailTemplates.orderConfirmation(mockOrder, mockUser);

        expect(html).toContain('Order Received!');
        expect(html).toContain('Hi Charlie,');
        expect(html).toContain('ORD-12345');
        expect(html).toContain('Shampoo (x2)');
        expect(html).toContain('Conditioner (x1)');
        expect(html).toMatch(/15(\.00)?/);
        expect(html).toMatch(/20(\.00)?/);
        expect(html).toMatch(/50(\.00)?/);
        expect(html).toContain('/app/bookings'); // As per logic
    });
});
