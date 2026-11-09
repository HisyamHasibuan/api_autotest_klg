# api_autotest_klg

Proyek otomasi pengujian API Swagger Petstore (Module User) menggunakan **Playwright** dan **TypeScript** dengan konsep **Page Object Model (POM)**.

**Author:** Hisyam Hasibuan

---

## Struktur Folder

```text
api_autotest_klg/
├── api/
│   └── user.api.ts         # Class POM UserApi
├── models/
│   └── user.model.ts       # Interface User
├── tests/
│   └── user.spec.ts        # Test cases module User
├── playwright.config.ts    # Konfigurasi Playwright
├── package.json
└── README.md
```

---

## Cara Menjalankan

### 1. Install dependencies
```bash
npm install
```

### 2. Install Playwright browser / dependencies
```bash
npx playwright install
```

### 3. Run test
```bash
# Jalankan seluruh test
npm test

# Atau jalankan khusus file user
npm run test:user
```

### 4. Buka report
```bash
npm run show-report
```

---

## Test Cases yang Dicakup

1. `POST /user` - Create user baru
2. `GET /user/{username}` - Get data user by username
3. `PUT /user/{username}` - Update data user
4. `GET /user/login` - Login user
5. `GET /user/logout` - Logout user
6. `DELETE /user/{username}` - Hapus user dan validasi 404
7. `GET /user/{random}` - Negative test user not found (404)
