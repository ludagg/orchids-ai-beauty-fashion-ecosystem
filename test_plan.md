1. **Fix AI Stylist Backend (`src/app/api/ai-stylist/chat/route.ts`)**
   - Update DB query conditions: replace `isActive` with `status = 'ACTIVE'` and `visibility = 'PUBLIC'`.
   - Update `category` column references to `mainCategory` and `subcategory`.

2. **Update Utilities (`src/lib/utils.ts`)**
   - Add `formatPrice` function as specified in the guidelines (`formatPrice(cents: number, locale = 'en-IN', currency = 'INR')`).

3. **Fix AI Stylist Frontend (`src/components/ai-stylist/AIStylistSheet.tsx`)**
   - Update product links from `/app/marketplace/[id]` to `/app/shop/product/[id]`.
   - Fix product image references from `images?.[0]` to `mainImageUrl`.
   - Fix price reference to use `product.salePrice ?? product.originalPrice` and format it using the new `formatPrice` utility.

4. **Add Unit Tests for AI Stylist API (`src/app/api/ai-stylist/chat/route.test.ts`)**
   - Mock `@/lib/db` and Drizzle ORM queries.
   - Mock `@google/generative-ai` to simulate LLM responses.
   - Test fallback keyword matching, AI extraction logic, and database query logic.

5. **Run Tests and verify build**
   - Execute `bun run test` to ensure new and existing tests pass.
   - Execute `bun run build` to verify there are no build errors.

6. **Generate mandatory Run Report**
   - Create `/reports/2026-07-12_00.md` detailing the actions taken, progress, and next steps in French.
   - Read the report file to verify its creation and contents.

7. **Complete pre-commit steps to ensure proper testing, verification, review, and reflection are done.**
   - Run `pre_commit_instructions` and follow them.

8. **Submit the changes**
   - Commit and push to a new branch for the AI Stylist feature completion.
