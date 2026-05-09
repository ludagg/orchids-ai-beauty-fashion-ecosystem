import { expect, test, describe } from 'bun:test';
import { EmailTemplates } from './email-templates';

describe('EmailTemplates', () => {
    const mockUser = { name: 'John Doe' };

    test('bookingConfirmation generates correct HTML', () => {
        const mockBooking = {
            salon: { name: 'Test Salon' },
            service: { name: 'Haircut' },
            startTime: new Date('2024-01-01T10:00:00Z'),
            totalPrice: 1500
        };

        const html = EmailTemplates.bookingConfirmation(mockBooking, mockUser);

        expect(html).toContain('John Doe');
        expect(html).toContain('Test Salon');
        expect(html).toContain('Haircut');
        // Price should be formatted based on en-IN / INR
        expect(html).toContain('₹15.00');
    });

    test('bookingCancellation generates correct HTML', () => {
        const mockBooking = {
            salon: { id: 'salon-123', name: 'Test Salon' }
        };

        const html = EmailTemplates.bookingCancellation(mockBooking, mockUser);

        expect(html).toContain('John Doe');
        expect(html).toContain('Test Salon');
        expect(html).toContain('salon-123');
    });

    test('orderConfirmation generates correct HTML', () => {
        const mockOrder = {
            id: 'ORD-123',
            items: [
                { product: { name: 'Shampoo' }, quantity: 2, priceAtPurchase: 1000 },
                { product: { name: 'Conditioner' }, quantity: 1, priceAtPurchase: 1500 }
            ],
            totalAmount: 3500
        };

        const html = EmailTemplates.orderConfirmation(mockOrder, mockUser);

        expect(html).toContain('John Doe');
        expect(html).toContain('ORD-123');
        expect(html).toContain('Shampoo');
        expect(html).toContain('x2');
        expect(html).toContain('Conditioner');
        // Check for formatted total
        expect(html).toContain('₹35.00');
    });
});
