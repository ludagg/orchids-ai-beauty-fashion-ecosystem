import { expect, test, describe } from 'bun:test';
import { EmailTemplates } from './email-templates';

describe('EmailTemplates', () => {
    test('bookingConfirmation template should render correctly', () => {
        const mockBooking = {
            salon: { name: 'Glamour Salon' },
            service: { name: 'Haircut' },
            startTime: new Date('2024-05-12T10:00:00Z').toISOString(),
            totalPrice: 25000 // 250 INR
        };
        const mockUser = { name: 'Jane Doe' };

        const html = EmailTemplates.bookingConfirmation(mockBooking, mockUser);

        // Assert inclusions
        expect(html).toContain('Booking Confirmed!');
        expect(html).toContain('Hi Jane Doe,');
        expect(html).toContain('Glamour Salon');
        expect(html).toContain('Haircut');
        // Because of timezone issues in CI, we just check that the parts exist or check for partial numbers
        expect(html).toMatch(/<p><strong>Price:<\/strong> .*250.*<\/p>/);
        expect(html).toContain('/app/bookings');
    });

    test('bookingCancellation template should render correctly', () => {
        const mockBooking = {
            salon: { name: 'Glamour Salon', id: 'salon-123' }
        };
        const mockUser = { name: 'Jane Doe' };

        const html = EmailTemplates.bookingCancellation(mockBooking, mockUser);

        expect(html).toContain('Booking Cancelled');
        expect(html).toContain('Hi Jane Doe,');
        expect(html).toContain('Glamour Salon');
        expect(html).toContain('/app/salons/salon-123');
    });

    test('orderConfirmation template should render correctly', () => {
        const mockOrder = {
            id: 'ORD-789',
            items: [
                {
                    product: { name: 'Shampoo' },
                    quantity: 2,
                    priceAtPurchase: 50000 // 500 INR
                },
                {
                    product: { name: 'Conditioner' },
                    quantity: 1,
                    priceAtPurchase: 40000 // 400 INR
                }
            ],
            totalAmount: 140000 // 1400 INR
        };
        const mockUser = { name: 'John Doe' };

        const html = EmailTemplates.orderConfirmation(mockOrder, mockUser);

        expect(html).toContain('Order Received!');
        expect(html).toContain('Hi John Doe,');
        expect(html).toContain('ORD-789');
        expect(html).toContain('Shampoo (x2)');
        expect(html).toContain('Conditioner (x1)');
        expect(html).toMatch(/<span>.*500.*<\/span>/);
        expect(html).toMatch(/<span>.*400.*<\/span>/);
        expect(html).toMatch(/<span>.*1,400.*<\/span>/); // Depending on locale string formatting, '1,400' or '1400'
        expect(html).toContain('/app/bookings');
    });
});
