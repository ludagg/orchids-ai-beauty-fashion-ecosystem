import { expect, test, describe } from 'bun:test';
import { EmailTemplates } from './email-templates';

describe('EmailTemplates', () => {
    test('bookingConfirmation generates correct HTML', () => {
        const user = { name: 'Alice' };
        const booking = {
            salon: { name: 'Super Cuts' },
            service: { name: 'Haircut' },
            startTime: '2025-01-01T10:00:00Z',
            totalPrice: 2500, // $25.00
        };

        const html = EmailTemplates.bookingConfirmation(booking, user);

        expect(html).toContain('Booking Confirmed!');
        expect(html).toContain('Hi Alice');
        expect(html).toContain('Super Cuts');
        expect(html).toContain('Haircut');
        // Match locale-formatted values partially
        expect(html).toMatch(/₹\s*25\.00|25\.00\s*₹/);
    });

    test('bookingCancellation generates correct HTML', () => {
        const user = { name: 'Bob' };
        const booking = {
            salon: { id: 's123', name: 'Nail Spa' },
        };

        const html = EmailTemplates.bookingCancellation(booking, user);

        expect(html).toContain('Booking Cancelled');
        expect(html).toContain('Hi Bob');
        expect(html).toContain('Nail Spa');
        expect(html).toContain('/app/salons/s123');
    });

    test('orderConfirmation generates correct HTML', () => {
        const user = { name: 'Charlie' };
        const order = {
            id: 'ord_987',
            totalAmount: 5000,
            items: [
                {
                    product: { name: 'Shampoo' },
                    quantity: 2,
                    priceAtPurchase: 2500
                }
            ]
        };

        const html = EmailTemplates.orderConfirmation(order, user);

        expect(html).toContain('Order Received!');
        expect(html).toContain('Hi Charlie');
        expect(html).toContain('ord_987');
        expect(html).toContain('Shampoo (x2)');
        expect(html).toMatch(/₹\s*50\.00|50\.00\s*₹/);
        expect(html).toMatch(/₹\s*25\.00|25\.00\s*₹/);
    });
});
