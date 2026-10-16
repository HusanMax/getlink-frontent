import { api } from './client';
import type { AdminStats } from '../types';

export async function fetchStats(): Promise<AdminStats> {
  const { data } = await api.get<AdminStats>('/stats');
  return data;
}
