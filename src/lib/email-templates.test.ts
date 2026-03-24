import { test, expect, describe } from "bun:test";
import { EmailTemplates } from "./email-templates";

describe("EmailTemplates", () => {
    test("bookingConfirmation should generate HTML with correct data", () => {
        const mockBooking = {
            salon: { name: "Test Salon" },
            service: { name: "Test Service" },
            startTime: "2024-01-01T10:00:00Z",
            totalPrice: 15000 // 150 INR
        };
        const mockUser = { name: "John Doe" };

        const html = EmailTemplates.bookingConfirmation(mockBooking, mockUser);

        expect(html).toContain("John Doe");
        expect(html).toContain("Test Salon");
        expect(html).toContain("Test Service");
        expect(html).toContain("150.00");
    });

    test("orderConfirmation should generate HTML with correct data", () => {
        const mockOrder = {
            id: "ORDER-123",
            totalAmount: 50000, // 500 INR
            items: [
                { product: { name: "Shampoo" }, quantity: 2, priceAtPurchase: 25000 }
            ]
        };
        const mockUser = { name: "Jane Doe" };

        const html = EmailTemplates.orderConfirmation(mockOrder, mockUser);

        expect(html).toContain("Jane Doe");
        expect(html).toContain("ORDER-123");
        expect(html).toContain("Shampoo (x2)");
        expect(html).toContain("500.00");
    });
});
