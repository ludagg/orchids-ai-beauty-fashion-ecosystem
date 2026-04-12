import { describe, expect, test } from 'bun:test';
import { EmailTemplates } from './email-templates';

describe('EmailTemplates', () => {
  const mockUser = {
    name: 'Jane Doe',
    email: 'jane@example.com',
  };

  describe('bookingConfirmation', () => {
    test('should generate HTML with correct user, salon, and pricing data', () => {
      const mockBooking = {
        salon: { name: 'Glow Up Studio' },
        service: { name: 'Haircut & Styling' },
        startTime: new Date('2026-05-10T10:00:00Z'),
        totalPrice: 4500, // 45.00
      };

      const html = EmailTemplates.bookingConfirmation(mockBooking, mockUser);

      // Check user details
      expect(html).toContain('Hi Jane Doe,');
      // Check salon details
      expect(html).toContain('Glow Up Studio');
      // Check service
      expect(html).toContain('Haircut & Styling');
      // Check pricing - 4500 -> 45.00
      expect(html).toContain('₹45.00'); // Assuming en-IN locale
    });
  });

  describe('bookingCancellation', () => {
    test('should generate HTML with correct user and salon data', () => {
      const mockBooking = {
        salon: { id: 'salon_123', name: 'Glow Up Studio' },
      };

      const html = EmailTemplates.bookingCancellation(mockBooking, mockUser);

      // Check user details
      expect(html).toContain('Hi Jane Doe,');
      // Check salon details
      expect(html).toContain('Glow Up Studio');
      // Check salon URL
      expect(html).toContain('/app/salons/salon_123');
    });
  });

  describe('orderConfirmation', () => {
    test('should generate HTML with correct order, items, and total data', () => {
      const mockOrder = {
        id: 'ord_987',
        items: [
          { product: { name: 'Shampoo' }, quantity: 2, priceAtPurchase: 1500 }, // 15.00 each
          { product: { name: 'Conditioner' }, quantity: 1, priceAtPurchase: 2000 }, // 20.00 each
        ],
        totalAmount: 5000, // Total 50.00
      };

      const html = EmailTemplates.orderConfirmation(mockOrder, mockUser);

      // Check user details
      expect(html).toContain('Hi Jane Doe,');
      // Check order ID
      expect(html).toContain('ord_987');
      // Check item 1
      expect(html).toContain('Shampoo (x2)');
      expect(html).toContain('₹15.00');
      // Check item 2
      expect(html).toContain('Conditioner (x1)');
      expect(html).toContain('₹20.00');
      // Check total
      expect(html).toContain('₹50.00');
    });
  });
});
