import { api } from './client';
import type { Admin, AdminStats, Paginated, Resource, ResourceInput, ResourceQuery } from '../types';

export async function fetchResources(query: ResourceQuery = {}): Promise<Paginated<Resource>> {
  const { data } = await api.get<Paginated<Resource>>('/resources', { params: query });
  return data;
}

export async function fetchResource(id: string): Promise<Resource> {
  const { data } = await api.get<Resource>(`/resources/${id}`);
  return data;
}

export async function createResource(input: ResourceInput): Promise<Resource> {
  const { data } = await api.post<Resource>('/resources', input);
  return data;
}

export async function updateResource(id: string, input: Partial<ResourceInput>): Promise<Resource> {
  const { data } = await api.patch<Resource>(`/resources/${id}`, input);
  return data;
}

export async function deleteResource(id: string): Promise<{ success: boolean; id: string }> {
  const { data } = await api.delete(`/resources/${id}`);
  return data;
}

// ---- Admin resource endpoints ----
export async function fetchAdminResources(query: ResourceQuery = {}): Promise<Paginated<Resource>> {
  const { data } = await api.get<Paginated<Resource>>('/admin/resources', { params: query });
  return data;
}

export async function fetchAdminResource(id: string): Promise<Resource> {
  const { data } = await api.get<Resource>(`/admin/resources/${id}`);
  return data;
}

export async function toggleResourceField(
  id: string,
  field: 'feature' | 'publish',
): Promise<Resource> {
  const { data } = await api.post<Resource>(`/admin/resources/${id}/${field}`);
  return data;
}

export async function fetchAdminStats(): Promise<AdminStats> {
  const { data } = await api.get<AdminStats>('/admin/stats');
  return data;
}

export async function fetchProfile(): Promise<Admin> {
  const { data } = await api.get<Admin>('/admin/profile');
  return data;
}

export async function changePassword(input: {
  currentPassword: string;
  newPassword: string;
}): Promise<{ success: boolean }> {
  const { data } = await api.patch('/admin/password', input);
  return data;
}
