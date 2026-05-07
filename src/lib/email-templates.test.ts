import { expect, test, describe } from "bun:test";
import { EmailTemplates } from "./email-templates";

describe("EmailTemplates", () => {
  const mockUser = { name: "Alice" };

  test("bookingConfirmation should include user name and salon name", () => {
    const mockBooking = {
      salon: { name: "Style Studio" },
      service: { name: "Haircut" },
      startTime: new Date("2024-05-15T10:00:00Z"),
      totalPrice: 150000 // 1500 INR
    };

    const html = EmailTemplates.bookingConfirmation(mockBooking, mockUser);

    expect(html).toContain("Alice");
    expect(html).toContain("Style Studio");
    expect(html).toContain("Haircut");
    expect(html).toContain("₹1,500.00");
  });

  test("bookingCancellation should include user name and salon name", () => {
    const mockBooking = {
      salon: { name: "Style Studio", id: "salon_123" }
    };

    const html = EmailTemplates.bookingCancellation(mockBooking, mockUser);

    expect(html).toContain("Alice");
    expect(html).toContain("Style Studio");
    expect(html).toContain("salon_123");
  });

  test("orderConfirmation should list items and total", () => {
    const mockOrder = {
      id: "order_123",
      items: [
        { product: { name: "Shampoo" }, quantity: 2, priceAtPurchase: 50000 } // 500 INR each
      ],
      totalAmount: 100000 // 1000 INR
    };

    const html = EmailTemplates.orderConfirmation(mockOrder, mockUser);

    expect(html).toContain("Alice");
    expect(html).toContain("order_123");
    expect(html).toContain("Shampoo");
    expect(html).toContain("₹500.00");
    expect(html).toContain("₹1,000.00");
  });
});
