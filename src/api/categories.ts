import { api } from './client';
import type { Category, CategoryInput } from '../types';

export async function fetchCategories(params: { type?: string; q?: string } = {}): Promise<Category[]> {
  const { data } = await api.get<Category[]>('/categories', { params });
  return data;
}

export async function fetchCategory(id: string): Promise<Category> {
  const { data } = await api.get<Category>(`/categories/${id}`);
  return data;
}

export async function createCategory(input: CategoryInput): Promise<Category> {
  const { data } = await api.post<Category>('/categories', input);
  return data;
}

export async function updateCategory(id: string, input: Partial<CategoryInput>): Promise<Category> {
  const { data } = await api.patch<Category>(`/categories/${id}`, input);
  return data;
}

export async function deleteCategory(
  id: string,
  force = false,
): Promise<{ success: boolean; id: string; unassignedResources: number }> {
  const { data } = await api.delete(`/categories/${id}`, { params: { force } });
  return data;
}
