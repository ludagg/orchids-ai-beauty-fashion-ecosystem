import { describe, it, expect } from 'vitest';
import { EmailTemplates } from './email-templates';

describe('EmailTemplates', () => {

  it('generates bookingConfirmation template with formatted price', () => {
    const user = { name: 'Alice' };
    const booking = {
        salon: { name: 'Glow Beauty' },
        service: { name: 'Haircut' },
        startTime: new Date('2025-05-01T10:00:00Z').toISOString(),
        totalPrice: 4500 // In cents -> 45.00
    };

    const html = EmailTemplates.bookingConfirmation(booking, user);

    // Verify key elements are in output
    expect(html).toContain('Alice');
    expect(html).toContain('Glow Beauty');
    expect(html).toContain('Haircut');
    expect(html).toContain('₹45.00'); // Based on en-IN formatting
    expect(html).toContain('/app/bookings');
  });

  it('generates bookingCancellation template correctly', () => {
    const user = { name: 'Alice' };
    const booking = {
        salon: { id: 'salon-123', name: 'Glow Beauty' },
    };

    const html = EmailTemplates.bookingCancellation(booking, user);

    expect(html).toContain('Alice');
    expect(html).toContain('Glow Beauty');
    expect(html).toContain('/app/salons/salon-123');
  });

  it('generates orderConfirmation template with formatted price', () => {
    const user = { name: 'Bob' };
    const order = {
        id: 'order-789',
        items: [
            { product: { name: 'Shampoo' }, quantity: 2, priceAtPurchase: 1500 } // 15.00
        ],
        totalAmount: 3000 // 30.00
    };

    const html = EmailTemplates.orderConfirmation(order, user);

    expect(html).toContain('Bob');
    expect(html).toContain('order-789');
    expect(html).toContain('Shampoo');
    expect(html).toContain('₹15.00');
    expect(html).toContain('₹30.00');
    expect(html).toContain('/app/bookings'); // from memory notes "often include hardcoded internal links (e.g., /app/bookings) even for order confirmations"
  });

});
