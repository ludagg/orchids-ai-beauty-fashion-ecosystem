import { expect, test, describe } from 'bun:test';
import { EmailTemplates } from './email-templates';

describe('EmailTemplates', () => {
    test('bookingConfirmation should include user name, salon name, and formatted price', () => {
        const user = { name: 'Alice' };
        const booking = {
            salon: { name: 'Super Salon' },
            service: { name: 'Haircut' },
            startTime: new Date('2026-05-13T10:00:00Z').toISOString(),
            totalPrice: 2500 // 25 INR
        };

        const result = EmailTemplates.bookingConfirmation(booking, user);

        expect(result).toContain('Alice');
        expect(result).toContain('Super Salon');
        expect(result).toContain('Haircut');
        expect(result).toMatch(/25/);
        expect(result).toContain('/app/bookings');
    });

    test('bookingCancellation should include user name and salon name', () => {
        const user = { name: 'Bob' };
        const booking = {
            salon: { id: 'salon-123', name: 'Magic Clips' }
        };

        const result = EmailTemplates.bookingCancellation(booking, user);

        expect(result).toContain('Bob');
        expect(result).toContain('Magic Clips');
        expect(result).toContain('/app/salons/salon-123');
    });

    test('orderConfirmation should include user name, product name, and tracked URL', () => {
        const user = { name: 'Charlie' };
        const order = {
            id: 'ord-456',
            items: [
                {
                    product: { name: 'Shampoo' },
                    quantity: 2,
                    priceAtPurchase: 5000 // 50 INR
                }
            ],
            totalAmount: 10000 // 100 INR
        };

        const result = EmailTemplates.orderConfirmation(order, user);

        expect(result).toContain('Charlie');
        expect(result).toContain('ord-456');
        expect(result).toContain('Shampoo (x2)');
        expect(result).toMatch(/50/);
        expect(result).toMatch(/100/);
        expect(result).toContain('/app/bookings');
    });
});
