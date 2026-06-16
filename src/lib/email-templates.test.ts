import { test, expect, describe } from "bun:test";
import { EmailTemplates } from "./email-templates";

describe("EmailTemplates", () => {
    const mockUser = {
        name: "John Doe"
    };

    test("bookingConfirmation should generate HTML with booking details", () => {
        const mockBooking = {
            salon: { name: "Luxury Salon" },
            service: { name: "Haircut" },
            startTime: "2024-05-10T10:00:00Z",
            totalPrice: 15000 // 150.00
        };

        const html = EmailTemplates.bookingConfirmation(mockBooking, mockUser);

        expect(html).toContain("John Doe");
        expect(html).toContain("Luxury Salon");
        expect(html).toContain("Haircut");
        // Dates might format differently depending on the environment,
        // but we can check if the basic structure or the unformatted presence is somewhat there,
        // actually just checking the static parts and the easy variable parts is enough.
        expect(html).toMatch(/<h2[^>]*>Booking Confirmed!<\/h2>/);
        expect(html).toContain("/app/bookings");
    });

    test("bookingCancellation should generate HTML with cancellation details", () => {
        const mockBooking = {
            salon: {
                id: "salon_123",
                name: "Luxury Salon"
            }
        };

        const html = EmailTemplates.bookingCancellation(mockBooking, mockUser);

        expect(html).toContain("John Doe");
        expect(html).toContain("Luxury Salon");
        expect(html).toMatch(/<h2[^>]*>Booking Cancelled<\/h2>/);
        expect(html).toContain("/app/salons/salon_123");
    });

    test("orderConfirmation should generate HTML with order items and total", () => {
        const mockOrder = {
            id: "ORDER_999",
            items: [
                {
                    product: { name: "Shampoo" },
                    quantity: 2,
                    priceAtPurchase: 5000 // 50.00
                },
                {
                    product: { name: "Conditioner" },
                    quantity: 1,
                    priceAtPurchase: 6000 // 60.00
                }
            ],
            totalAmount: 16000 // 160.00
        };

        const html = EmailTemplates.orderConfirmation(mockOrder, mockUser);

        expect(html).toContain("John Doe");
        expect(html).toContain("ORDER_999");
        expect(html).toContain("Shampoo (x2)");
        expect(html).toContain("Conditioner (x1)");
        expect(html).toMatch(/<h2[^>]*>Order Received!<\/h2>/);
        expect(html).toContain("/app/bookings");
    });
});
