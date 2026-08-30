1. **Implement `AI Fit Check` features.**
   - Create the `PATCH /api/users/profile/measurements/route.ts` API endpoint to handle user profile measurement updates.
   - Create the `POST /api/ai-fit/route.ts` API endpoint. Use GoogleGenerativeAI to analyse fit based on user measurement inputs and a product. Include a fallback recommendation algorithm as defined in memory.
   - Update `src/app/app/shop/product/[id]/page.tsx` to handle dynamic AI recommendations, capturing user data if empty.
2. **Implement `AR Try-On` features.**
   - Create `src/components/shop/ai/ARTryOn.tsx` client component that utilizes the device camera via `<video>` and `navigator.mediaDevices.getUserMedia`.
   - Update `src/app/app/shop/product/[id]/page.tsx` to integrate the ARTryOn component into the UI. Ensure a button toggles its view.
3. **Write tests for new components and API endpoints.**
   - `vitest` tests for `ARTryOn` component handling the webcam initialization.
   - `vitest` tests for the new `ai-fit` and `measurements` API routes mocking the Database and GenerativeAI.
4. **Complete pre-commit steps to ensure proper testing, verification, review, and reflection are done.**
   - Run the pre-commit checks as per memory guidelines.
   - Save report in `/reports/YYYY-MM-DD_HH.md`.
5. **Submit the changes.**
   - Use `submit` to push branch and save work.
