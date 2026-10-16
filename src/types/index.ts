export type ResourceType = 'website' | 'youtube' | 'telegram' | 'book' | 'movie';

export const RESOURCE_TYPES: ResourceType[] = ['website', 'youtube', 'telegram', 'book', 'movie'];

export interface Tag {
  id: string;
  name: string;
  slug: string;
  resourceCount?: number;
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  type: string;
  description?: string | null;
  icon?: string | null;
  resourceCount?: number;
  createdAt: string;
  updatedAt: string;
}

export interface ResourceMetadata {
  reason?: string;
  [key: string]: unknown;
}

export interface Resource {
  id: string;
  title: string;
  description: string;
  url: string;
  image?: string | null;
  type: string;
  categoryId?: string | null;
  category?: Pick<Category, 'id' | 'name' | 'slug' | 'type' | 'icon'> | null;
  featured: boolean;
  published: boolean;
  author?: string | null;
  year?: number | null;
  metadata?: ResourceMetadata | null;
  tags: Pick<Tag, 'id' | 'name' | 'slug'>[];
  createdAt: string;
  updatedAt: string;
}

export interface Paginated<T> {
  items: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface Admin {
  id: string;
  username: string;
  createdAt: string;
  updatedAt?: string;
}

export interface AdminStats {
  resources: {
    total: number;
    published: number;
    unpublished: number;
    featured: number;
  };
  byType: Record<string, number>;
  categories: number;
  tags: number;
}

export interface ResourceQuery {
  page?: number;
  limit?: number;
  q?: string;
  type?: string;
  categoryId?: string;
  category?: string;
  tag?: string;
  featured?: boolean;
  published?: boolean;
  sort?: 'newest' | 'oldest' | 'title' | 'featured';
}

export interface ResourceInput {
  title: string;
  description: string;
  url: string;
  image?: string;
  type: string;
  categoryId?: string;
  featured?: boolean;
  published?: boolean;
  author?: string;
  year?: number;
  metadata?: ResourceMetadata;
  tagIds?: string[];
}

export interface CategoryInput {
  name: string;
  slug?: string;
  type: string;
  description?: string;
  icon?: string;
}

export interface TagInput {
  name: string;
  slug?: string;
}
