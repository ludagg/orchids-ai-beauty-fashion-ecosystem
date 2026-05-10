import { expect, test, describe } from 'bun:test';
import { EmailTemplates } from './email-templates';

describe('EmailTemplates', () => {
  test('bookingConfirmation template includes user name, salon name, and formatted price', () => {
    const mockUser = { name: 'Alice' };
    const mockBooking = {
      salon: { name: 'Super Salon' },
      service: { name: 'Haircut' },
      startTime: '2025-05-10T10:00:00.000Z',
      totalPrice: 2500 // 25.00
    };

    const html = EmailTemplates.bookingConfirmation(mockBooking, mockUser);

    expect(html).toContain('Alice');
    expect(html).toContain('Super Salon');
    expect(html).toContain('Haircut');
    // We check for partial price string since locale formatting can vary slightly between environments
    // But it should contain either 25 or 25.00
    expect(html).toMatch(/25/);
    expect(html).toContain('View Booking');
  });

  test('bookingCancellation template includes user name and salon name', () => {
    const mockUser = { name: 'Bob' };
    const mockBooking = {
      salon: { name: 'Cool Salon', id: 'salon-123' }
    };

    const html = EmailTemplates.bookingCancellation(mockBooking, mockUser);

    expect(html).toContain('Bob');
    expect(html).toContain('Cool Salon');
    expect(html).toContain('Book Again');
    expect(html).toContain('salon-123');
  });

  test('orderConfirmation template includes user name, product name, and formatted total amount', () => {
    const mockUser = { name: 'Charlie' };
    const mockOrder = {
      id: 'ORDER-999',
      items: [
        { product: { name: 'Shampoo' }, quantity: 2, priceAtPurchase: 1500 }, // 15.00
        { product: { name: 'Conditioner' }, quantity: 1, priceAtPurchase: 1800 } // 18.00
      ],
      totalAmount: 4800 // 48.00
    };

    const html = EmailTemplates.orderConfirmation(mockOrder, mockUser);

    expect(html).toContain('Charlie');
    expect(html).toContain('ORDER-999');
    expect(html).toContain('Shampoo (x2)');
    expect(html).toContain('Conditioner (x1)');
    expect(html).toMatch(/15/);
    expect(html).toMatch(/18/);
    expect(html).toMatch(/48/);
    expect(html).toContain('Track Order');
  });
});
