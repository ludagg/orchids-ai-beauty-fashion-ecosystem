# Testing Instructions for Business Features

## 1. Business Landing Page
- Navigate to `/business`.
- Verify the page loads with the correct "Power your Business" hero section.
- Verify "Join as Partner" button links to `/business/register`.
- Verify "Sign In" button links to `/business/auth/login`.

## 2. Navigation
- On the main landing page (`/`), verify the "For Business" link appears in the navbar (desktop only).
- In the App Dashboard (`/app`), verify the "For Partners" link appears in the sidebar (desktop and mobile menu).

## 3. Business Registration (Strict Mode)
- Navigate to `/business/register`.
- You should see two large cards: "Service Provider" (Salon) and "Retailer" (Shop).
- Verify there is NO "Both" option.
- Select "Service Provider". The form should appear.
- Fill in details and submit.
- Verify the API call sends `type: "SALON"`.
- Repeat for "Retailer" -> `type: "BOUTIQUE"`.

## 4. API Validation
- Use Postman or curl to try creating a salon with `type: "BOTH"`.
- **Expected Result:** 400 Bad Request (Invalid data).

```bash
curl -X POST http://localhost:3000/api/salons \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test Both",
    "description": "This should fail",
    "address": "123 Test St",
    "city": "Test City",
    "zipCode": "12345",
    "type": "BOTH"
  }'
```

- Try with valid type:

```bash
curl -X POST http://localhost:3000/api/salons \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test Salon",
    "description": "Valid salon description",
    "address": "123 Test St",
    "city": "Test City",
    "zipCode": "12345",
    "type": "SALON"
  }'
```

## 5. Creator Studio Refactor
- Navigate to `/app/creator-studio`.
- If not a partner, click "Become a Partner".
- Verify it redirects to `/business/register` instead of opening a modal.
