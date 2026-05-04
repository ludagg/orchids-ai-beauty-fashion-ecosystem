import { describe, it, expect } from 'bun:test';
import { EmailTemplates } from './email-templates';

describe('EmailTemplates', () => {
    it('should generate bookingConfirmation correctly', () => {
        const booking = {
            salon: { name: 'Test Salon', id: 'salon_1' },
            service: { name: 'Haircut' },
            startTime: '2025-05-01T10:00:00Z',
            totalPrice: 2500, // in cents -> 25 INR
        };
        const user = { name: 'John Doe' };

        const html = EmailTemplates.bookingConfirmation(booking, user);

        expect(html).toContain('Booking Confirmed!');
        expect(html).toContain('Hi John Doe,');
        expect(html).toContain('Test Salon');
        expect(html).toContain('Haircut');
        // Price test
        expect(html).toContain('25.00');
    });

    it('should generate bookingCancellation correctly', () => {
        const booking = {
            salon: { name: 'Test Salon', id: 'salon_1' },
        };
        const user = { name: 'John Doe' };

        const html = EmailTemplates.bookingCancellation(booking, user);

        expect(html).toContain('Booking Cancelled');
        expect(html).toContain('Hi John Doe,');
        expect(html).toContain('Test Salon');
        expect(html).toContain('/app/salons/salon_1');
    });
});
