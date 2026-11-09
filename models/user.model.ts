export interface User {
  id: number;
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  password?: string;
  phone?: string;
  userStatus?: number;
}

export interface ApiResponse {
  code: number;
  type: string;
  message: string;
}
