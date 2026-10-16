import { api } from './client';
import type { Tag, TagInput } from '../types';

export async function fetchTags(params: { q?: string } = {}): Promise<Tag[]> {
  const { data } = await api.get<Tag[]>('/tags', { params });
  return data;
}

export async function createTag(input: TagInput): Promise<Tag> {
  const { data } = await api.post<Tag>('/tags', input);
  return data;
}

export async function updateTag(id: string, input: Partial<TagInput>): Promise<Tag> {
  const { data } = await api.patch<Tag>(`/tags/${id}`, input);
  return data;
}

export async function deleteTag(id: string): Promise<{ success: boolean; id: string }> {
  const { data } = await api.delete(`/tags/${id}`);
  return data;
}
