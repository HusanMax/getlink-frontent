import { api } from './client';
import type { Admin } from '../types';

export interface LoginResponse {
  accessToken: string;
  admin: Pick<Admin, 'id' | 'username'>;
}

export async function login(username: string, password: string): Promise<LoginResponse> {
  const { data } = await api.post<LoginResponse>('/auth/login', { username, password });
  return data;
}

export async function me(): Promise<Admin> {
  const { data } = await api.get<Admin>('/auth/me');
  return data;
}
