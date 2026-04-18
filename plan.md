1. **Apply missing configuration to Stripe Webhook endpoint**
   - File: `src/app/api/webhooks/stripe/route.ts`
   - Modify the webhook to check for `process.env.STRIPE_WEBHOOK_SECRET` existence before trying to construct the event. If missing, return `500` and use `pino` logger (`import { logger } from "@/lib/logger";`) to log configuration failure.
   - Replace `console.log` and `console.error` with `logger.info`, `logger.error`, `logger.warn`.
   - The file already reads `await req.text()` which complies with memory.

2. **Fix `products.stock` vs `products.totalStock` inconsistencies in `src/app/api/create-payment-intent/route.ts`**
   - File: `src/app/api/create-payment-intent/route.ts`
   - Memory notes that `totalStock` is used instead of `stock` and `salePrice`/`originalPrice` instead of `price`. Update `product.stock` to `product.totalStock` and `product.price` to `(product.salePrice ?? product.originalPrice)`.
   - Update `pino` logger usage over `console.error`.

3. **Batch inserts in `src/app/api/create-payment-intent/route.ts`**
   - File: `src/app/api/create-payment-intent/route.ts`
   - Map the `validatedItems` into an array of insert objects (`{ id, orderId, productId, quantity, priceAtPurchase }`), check if it's not empty, and perform a single `tx.insert(orderItems).values(batchItems)` instead of a `for` loop.

4. **Convert inner `Array.find()` to Map lookup in `src/app/api/create-payment-intent/route.ts`**
   - To adhere to the "In-Memory Optimization Standard", convert `dbProducts` array to a Map `new Map(dbProducts.map(p => [p.id, p]))` to avoid O(N*M) lookups inside the loop validating items.

5. **Fix Github CI Pipeline and dummy dependencies**
   - Review `.github/workflows/ci.yml` and ensure it runs perfectly. Currently tests and linting passed locally with the setup in step 1. No direct changes in `.github/workflows/ci.yml` but need to verify.

6. **Verify modifications**
   - Make sure no regressions are introduced using `bun run lint` and `bun test`. Use git status to check state. Check with `read_file`.

7. **Complete pre-commit steps to ensure proper testing, verification, review, and reflection are done.**

8. **Submit changes to `main` (or user branch) to finish the current execution cycle**
   - Provide a concise summary and commit.
