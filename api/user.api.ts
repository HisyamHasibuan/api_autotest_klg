import { APIRequestContext, APIResponse } from '@playwright/test';
import { User } from '../models/user.model';

export class UserApi {
  private request: APIRequestContext;
  private readonly baseUrl: string;

  constructor(request: APIRequestContext, baseUrl: string = 'https://petstore.swagger.io/v2') {
    this.request = request;
    this.baseUrl = baseUrl;
  }

  async createUser(user: User): Promise<APIResponse> {
    return await this.request.post(`${this.baseUrl}/user`, {
      data: user,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  async getUserByUsername(username: string): Promise<APIResponse> {
    return await this.request.get(`${this.baseUrl}/user/${username}`);
  }

  async updateUser(username: string, updatedUser: User): Promise<APIResponse> {
    return await this.request.put(`${this.baseUrl}/user/${username}`, {
      data: updatedUser,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  async deleteUser(username: string): Promise<APIResponse> {
    return await this.request.delete(`${this.baseUrl}/user/${username}`);
  }

  async login(username: string, password: string): Promise<APIResponse> {
    return await this.request.get(`${this.baseUrl}/user/login`, {
      params: { username, password },
    });
  }

  async logout(): Promise<APIResponse> {
    return await this.request.get(`${this.baseUrl}/user/logout`);
  }
}
