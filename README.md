# api_autotest_klg

API test automation for Swagger Petstore (User module) using **Playwright** and **TypeScript** with the **Page Object Model (POM)** pattern.

**Author:** Hisyam Hasibuan


---

## How to Run

### 1. Install dependencies
```bash
npm install
```

### 2. Install Playwright browser / dependencies
```bash
npx playwright install
```

### 3. Run tests
```bash
# Run all tests
npm test

# Or run only the user tests
npm run test:user
```

### 4. Open report
```bash
npm run show-report
```

---

## Test Cases Covered

### POST /user - Create user
1. Positive: create user with valid required data
2. Positive: create user with complete data and verify by GET
3. Negative: create user when body is an array
4. Negative: create user with invalid JSON body

### GET /user/{username} - Get user by username
5. Positive: get existing user by username
6. Positive: return correct user detail fields
7. Negative: get non-existing username returns 404
8. Negative: get with empty username path fails

### PUT /user/{username} - Update user
9. Positive: update existing user data
10. Positive: persist updated user data after GET
11. Negative: update with empty username path fails
12. Negative: update user with invalid JSON body
