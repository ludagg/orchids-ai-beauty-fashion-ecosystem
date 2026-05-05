import { describe, it, expect } from 'vitest';
import { EmailTemplates } from './email-templates';

describe('EmailTemplates', () => {
    describe('bookingConfirmation', () => {
        it('should generate a confirmation email with user and booking details', () => {
            const user = { name: 'John Doe' };
            const date = new Date('2024-05-15T10:00:00Z');
            const booking = {
                salon: { name: 'Super Salon' },
                service: { name: 'Haircut' },
                startTime: date.toISOString(),
                totalPrice: 2500 // 25.00
            };

            const html = EmailTemplates.bookingConfirmation(booking, user);

            expect(html).toContain('John Doe');
            expect(html).toContain('Super Salon');
            expect(html).toContain('Haircut');
            expect(html).toContain('25'); // Partial match for price to avoid locale issues
            expect(html).toContain(date.toLocaleDateString());
            expect(html).toContain('/app/bookings');
        });
    });

    describe('bookingCancellation', () => {
        it('should generate a cancellation email with user and salon details', () => {
            const user = { name: 'Jane Smith' };
            const booking = {
                salon: { id: 'salon-123', name: 'Beauty Spa' }
            };

            const html = EmailTemplates.bookingCancellation(booking, user);

            expect(html).toContain('Jane Smith');
            expect(html).toContain('Beauty Spa');
            expect(html).toContain('/app/salons/salon-123');
        });
    });

    describe('orderConfirmation', () => {
        it('should generate an order confirmation email with user and order details', () => {
            const user = { name: 'Alice Walker' };
            const order = {
                id: 'ord-456',
                totalAmount: 5000, // 50.00
                items: [
                    {
                        product: { name: 'Shampoo' },
                        quantity: 2,
                        priceAtPurchase: 1500 // 15.00
                    },
                    {
                        product: { name: 'Conditioner' },
                        quantity: 1,
                        priceAtPurchase: 2000 // 20.00
                    }
                ]
            };

            const html = EmailTemplates.orderConfirmation(order, user);

            expect(html).toContain('Alice Walker');
            expect(html).toContain('ord-456');
            expect(html).toContain('Shampoo');
            expect(html).toContain('(x2)');
            expect(html).toContain('Conditioner');
            expect(html).toContain('(x1)');
            expect(html).toContain('50'); // Partial match for total amount
            expect(html).toContain('/app/bookings'); // Action URL check
        });
    });
});
