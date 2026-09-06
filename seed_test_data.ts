import { db } from "./src/lib/db";
import { products } from "./src/db/schema/commerce";
import { users } from "./src/db/schema/auth";

async function seed() {
    try {
        console.log("Seeding test user...");
        await db.insert(users).values({
            id: "test-user-id",
            name: "Test User",
            email: "test@example.com",
            role: "user",
            height: "175cm",
            weight: "70kg",
            bodyType: "athletic"
        }).onConflictDoNothing();

        console.log("Seeding test product...");
        await db.insert(products).values({
            id: "test-product-id",
            salonId: null as any,
            name: "Test Shirt",
            brand: "RareBrand",
            description: "A cool test shirt",
            mainCategory: "clothes",
            subcategory: "shirts",
            originalPrice: 2000,
            salePrice: 1500,
            totalStock: 10,
            sizes: [{ name: "S" }, { name: "M" }, { name: "L" }],
            colors: [{ name: "Red", hex: "#ff0000" }],
            mainImageUrl: "https://via.placeholder.com/300",
            galleryUrls: [],
            slug: "test-shirt-123",
            visibility: "PUBLIC",
            status: "ACTIVE"
        }).onConflictDoNothing();

        console.log("Seeding complete.");
    } catch (e) {
        console.error(e);
    }
}

seed();
