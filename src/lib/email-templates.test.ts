import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { EmailTemplates } from "./email-templates";

describe("Email Templates", () => {
    const originalEnv = process.env.NEXT_PUBLIC_APP_URL;

    beforeEach(() => {
        process.env.NEXT_PUBLIC_APP_URL = "http://localhost:3000";
    });

    afterEach(() => {
        process.env.NEXT_PUBLIC_APP_URL = originalEnv;
    });

    it("should generate a bookingConfirmation template correctly", () => {
        const user = { name: "John Doe" };
        const booking = {
            salon: { name: "Luxury Curls" },
            service: { name: "Haircut" },
            startTime: "2023-12-01T10:00:00Z",
            totalPrice: 2500, // 25.00
        };

        const html = EmailTemplates.bookingConfirmation(booking, user);

        expect(html).toContain("John Doe");
        expect(html).toContain("Luxury Curls");
        expect(html).toContain("Haircut");
        // Verify price format - 2500 paise -> ₹25.00
        expect(html).toContain("₹25.00");
        expect(html).toContain("http://localhost:3000/app/bookings");
    });

    it("should generate a bookingCancellation template correctly", () => {
        const user = { name: "Jane Smith" };
        const booking = {
            salon: { id: "salon-123", name: "Nail Spa" },
        };

        const html = EmailTemplates.bookingCancellation(booking, user);

        expect(html).toContain("Jane Smith");
        expect(html).toContain("Nail Spa");
        expect(html).toContain("http://localhost:3000/app/salons/salon-123");
    });

    it("should generate an orderConfirmation template correctly", () => {
        const user = { name: "Alice" };
        const order = {
            id: "ORD-999",
            totalAmount: 10500, // 105.00
            items: [
                {
                    product: { name: "Shampoo" },
                    quantity: 2,
                    priceAtPurchase: 2500, // 25.00
                },
                {
                    product: { name: "Conditioner" },
                    quantity: 1,
                    priceAtPurchase: 5500, // 55.00
                }
            ]
        };

        const html = EmailTemplates.orderConfirmation(order, user);

        expect(html).toContain("Alice");
        expect(html).toContain("ORD-999");
        expect(html).toContain("Shampoo (x2)");
        expect(html).toContain("Conditioner (x1)");
        expect(html).toContain("₹25.00");
        expect(html).toContain("₹55.00");
        expect(html).toContain("₹105.00");
        expect(html).toContain("http://localhost:3000/app/bookings");
    });
});
