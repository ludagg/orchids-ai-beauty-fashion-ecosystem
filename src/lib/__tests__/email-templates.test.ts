import { expect, test, describe } from 'bun:test';
import { EmailTemplates } from '../email-templates';

describe('EmailTemplates', () => {
  test('bookingConfirmation', () => {
    const html = EmailTemplates.bookingConfirmation(
      {
        salon: { name: 'Test Salon' },
        service: { name: 'Test Service' },
        startTime: '2026-05-13T10:00:00Z',
        totalPrice: 10000
      },
      { name: 'Test User' }
    );
    expect(html).toContain('Test User');
    expect(html).toContain('Test Salon');
    expect(html).toContain('Test Service');
    expect(html).toContain('₹100.00'); // Check price formatting
  });

  test('bookingCancellation', () => {
    const html = EmailTemplates.bookingCancellation(
      {
        salon: { name: 'Test Salon', id: 'salon-123' }
      },
      { name: 'Test User' }
    );
    expect(html).toContain('Test User');
    expect(html).toContain('Test Salon');
    expect(html).toContain('/app/salons/salon-123');
  });

  test('orderConfirmation', () => {
    const html = EmailTemplates.orderConfirmation(
      {
        id: 'order-123',
        items: [
          { product: { name: 'Test Product 1' }, quantity: 2, priceAtPurchase: 5000 }
        ],
        totalAmount: 10000
      },
      { name: 'Test User' }
    );
    expect(html).toContain('Test User');
    expect(html).toContain('order-123');
    expect(html).toContain('Test Product 1');
    expect(html).toContain('₹50.00'); // Item price
    expect(html).toContain('₹100.00'); // Total price
  });
});
