import { test, expect } from '@playwright/test';
import { UserApi } from '../api/user.api';
import { User } from '../models/user.model';

function buildUser(overrides: Partial<User> = {}): User {
  const stamp = Date.now();
  return {
    id: Math.floor(Math.random() * 900000) + 100000,
    username: `user_${stamp}`,
    firstName: 'Hisyam',
    lastName: 'Hasibuan',
    email: `hisyam_${stamp}@example.com`,
    password: 'Password123!',
    phone: '081234567890',
    userStatus: 1,
    ...overrides,
  };
}

test.describe('Petstore - User Module', () => {
  let userApi: UserApi;

  test.beforeEach(async ({ request }) => {
    userApi = new UserApi(request);
  });

  // ------------------------------------------------------------
  // POST /user - Create user (2 positive, 2 negative)
  // ------------------------------------------------------------
  test.describe('POST /user - Create user', () => {
    test('Positive: should create user with valid required data', async () => {
      const user = buildUser();

      const response = await userApi.createUser(user);
      expect(response.status()).toBe(200);

      const body = await response.json();
      expect(body.code).toBe(200);
      expect(body.message).toBe(user.id.toString());
    });

    test('Positive: should create user with complete data and verify by GET', async () => {
      const user = buildUser();

      const createResponse = await userApi.createUser(user);
      expect(createResponse.status()).toBe(200);

      const getResponse = await userApi.getUserByUsername(user.username);
      expect(getResponse.status()).toBe(200);

      const data: User = await getResponse.json();
      expect(data.username).toBe(user.username);
      expect(data.email).toBe(user.email);
      expect(data.firstName).toBe(user.firstName);
      expect(data.lastName).toBe(user.lastName);
    });

    test('Negative: should reject create user when body is an array', async () => {
      const response = await userApi.createUserRaw('[]');
      expect(response.status()).toBe(500);
    });

    test('Negative: should reject create user with invalid JSON body', async () => {
      const response = await userApi.createUserRaw('{invalid-json');
      expect([400, 415, 500]).toContain(response.status());
    });
  });

  // ------------------------------------------------------------
  // GET /user/{username} - Get user by username (2 positive, 2 negative)
  // ------------------------------------------------------------
  test.describe('GET /user/{username} - Get user by username', () => {
    test('Positive: should get existing user by username', async () => {
      const user = buildUser();
      await userApi.createUser(user);

      const response = await userApi.getUserByUsername(user.username);
      expect(response.status()).toBe(200);

      const data: User = await response.json();
      expect(data.username).toBe(user.username);
    });

    test('Positive: should return correct user detail fields', async () => {
      const user = buildUser();
      await userApi.createUser(user);

      const response = await userApi.getUserByUsername(user.username);
      expect(response.status()).toBe(200);

      const data: User = await response.json();
      expect(data.id).toBe(user.id);
      expect(data.username).toBe(user.username);
      expect(data.firstName).toBe(user.firstName);
      expect(data.email).toBe(user.email);
      expect(data.phone).toBe(user.phone);
    });

    test('Negative: should return 404 when username does not exist', async () => {
      const response = await userApi.getUserByUsername(`missing_user_${Date.now()}`);
      expect(response.status()).toBe(404);
    });

    test('Negative: should fail when username path is empty', async () => {
      const response = await userApi.getUserByUsername('');
      // Empty path hits /user/ which is not a valid get-by-username call
      expect([404, 405]).toContain(response.status());
    });
  });

  // ------------------------------------------------------------
  // PUT /user/{username} - Update user (2 positive, 2 negative)
  // ------------------------------------------------------------
  test.describe('PUT /user/{username} - Update user', () => {
    test('Positive: should update existing user data', async () => {
      const user = buildUser();
      await userApi.createUser(user);

      const updatedUser: User = {
        ...user,
        firstName: 'Hisyam Updated',
        email: `hisyam_updated_${Date.now()}@example.com`,
      };

      const response = await userApi.updateUser(user.username, updatedUser);
      expect(response.status()).toBe(200);

      const body = await response.json();
      expect(body.code).toBe(200);
    });

    test('Positive: should persist updated user data after GET', async () => {
      const user = buildUser();
      await userApi.createUser(user);

      const updatedUser: User = {
        ...user,
        firstName: 'Updated Name',
        lastName: 'Updated Last',
        email: `updated_${Date.now()}@example.com`,
        phone: '089999999999',
      };

      const updateResponse = await userApi.updateUser(user.username, updatedUser);
      expect(updateResponse.status()).toBe(200);

      const getResponse = await userApi.getUserByUsername(user.username);
      expect(getResponse.status()).toBe(200);

      const data: User = await getResponse.json();
      expect(data.firstName).toBe(updatedUser.firstName);
      expect(data.lastName).toBe(updatedUser.lastName);
      expect(data.email).toBe(updatedUser.email);
      expect(data.phone).toBe(updatedUser.phone);
    });

    test('Negative: should fail when update username path is empty', async () => {
      const payload = buildUser();
      const response = await userApi.updateUser('', payload);
      expect([404, 405]).toContain(response.status());
    });

    test('Negative: should reject update user with invalid JSON body', async () => {
      const user = buildUser();
      await userApi.createUser(user);

      const response = await userApi.updateUserRaw(user.username, '{invalid-json');
      expect([400, 415, 500]).toContain(response.status());
    });
  });
});
