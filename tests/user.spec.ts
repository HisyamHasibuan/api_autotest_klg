import { test, expect } from '@playwright/test';
import { UserApi } from '../api/user.api';
import { User } from '../models/user.model';

test.describe('Petstore - User Module', () => {
  let userApi: UserApi;

  // Data test unik per running
  const testUser: User = {
    id: Math.floor(Math.random() * 900000) + 100000,
    username: `user_${Date.now()}`,
    firstName: 'Hisyam',
    lastName: 'Hasibuan',
    email: `hisyam_${Date.now()}@example.com`,
    password: 'Password123!',
    phone: '081234567890',
    userStatus: 1,
  };

  test.beforeEach(async ({ request }) => {
    userApi = new UserApi(request);
  });

  test('Harus berhasil create user baru', async () => {
    const response = await userApi.createUser(testUser);
    expect(response.status()).toBe(200);

    const body = await response.json();
    expect(body.code).toBe(200);
    expect(body.message).toBe(testUser.id.toString());
  });

  test('Harus berhasil get user by username', async () => {
    await userApi.createUser(testUser);

    const response = await userApi.getUserByUsername(testUser.username);
    expect(response.status()).toBe(200);

    const data: User = await response.json();
    expect(data.username).toBe(testUser.username);
    expect(data.email).toBe(testUser.email);
    expect(data.firstName).toBe(testUser.firstName);
  });

  test('Harus berhasil update user data', async () => {
    await userApi.createUser(testUser);

    const updatedUser: User = {
      ...testUser,
      firstName: 'Hisyam Updated',
      email: `hisyam_updated_${Date.now()}@example.com`,
    };

    const updateResponse = await userApi.updateUser(testUser.username, updatedUser);
    expect(updateResponse.status()).toBe(200);

    const getResponse = await userApi.getUserByUsername(testUser.username);
    const body: User = await getResponse.json();
    expect(body.firstName).toBe('Hisyam Updated');
  });

  test('Harus berhasil login user', async () => {
    await userApi.createUser(testUser);

    const response = await userApi.login(testUser.username, testUser.password!);
    expect(response.status()).toBe(200);

    const body = await response.json();
    expect(body.code).toBe(200);
    expect(body.message).toContain('logged in user session');
  });

  test('Harus berhasil logout user', async () => {
    const response = await userApi.logout();
    expect(response.status()).toBe(200);

    const body = await response.json();
    expect(body.code).toBe(200);
  });

  test('Harus berhasil delete user', async () => {
    await userApi.createUser(testUser);

    const deleteResponse = await userApi.deleteUser(testUser.username);
    expect(deleteResponse.status()).toBe(200);

    // Pastikan user sudah terhapus
    const getResponse = await userApi.getUserByUsername(testUser.username);
    expect(getResponse.status()).toBe(404);
  });

  test('Negative: Get user yang tidak ada harus 404', async () => {
    const randomUser = `random_user_${Date.now()}`;
    const response = await userApi.getUserByUsername(randomUser);
    expect(response.status()).toBe(404);
  });
});
