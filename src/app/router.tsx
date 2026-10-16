import { createBrowserRouter } from 'react-router-dom';
import { PublicLayout } from '../layouts/PublicLayout';
import { AdminLayout } from '../layouts/AdminLayout';
import { ProtectedRoute } from '../components/auth/ProtectedRoute';
import { HomePage } from '../pages/HomePage';
import { WebsitesPage } from '../pages/WebsitesPage';
import { YouTubePage } from '../pages/YouTubePage';
import { TelegramPage } from '../pages/TelegramPage';
import { BooksPage } from '../pages/BooksPage';
import { MoviesPage } from '../pages/MoviesPage';
import { SearchPage } from '../pages/SearchPage';
import { NotFoundPage } from '../pages/NotFoundPage';
import { AdminLoginPage } from '../pages/admin/AdminLoginPage';
import { DashboardPage } from '../pages/admin/DashboardPage';
import { AdminResourcesPage } from '../pages/admin/AdminResourcesPage';
import { ResourceFormPage } from '../pages/admin/ResourceFormPage';
import { AdminCategoriesPage } from '../pages/admin/AdminCategoriesPage';
import { CategoryFormPage } from '../pages/admin/CategoryFormPage';
import { AdminTagsPage } from '../pages/admin/AdminTagsPage';
import { TagFormPage } from '../pages/admin/TagFormPage';
import { AdminSettingsPage } from '../pages/admin/AdminSettingsPage';

export const router = createBrowserRouter([
  {
    element: <PublicLayout />,
    children: [
      { path: '/', element: <HomePage /> },
      { path: '/websites', element: <WebsitesPage /> },
      { path: '/youtube', element: <YouTubePage /> },
      { path: '/telegram', element: <TelegramPage /> },
      { path: '/books', element: <BooksPage /> },
      { path: '/movies', element: <MoviesPage /> },
      { path: '/search', element: <SearchPage /> },
      { path: '*', element: <NotFoundPage /> },
    ],
  },
  { path: '/admin/login', element: <AdminLoginPage /> },
  {
    element: <ProtectedRoute />,
    children: [
      {
        path: '/admin',
        element: <AdminLayout />,
        children: [
          { index: true, element: <DashboardPage /> },
          { path: 'resources', element: <AdminResourcesPage /> },
          { path: 'resources/create', element: <ResourceFormPage /> },
          { path: 'resources/:id/edit', element: <ResourceFormPage /> },
          { path: 'categories', element: <AdminCategoriesPage /> },
          { path: 'categories/create', element: <CategoryFormPage /> },
          { path: 'categories/:id/edit', element: <CategoryFormPage /> },
          { path: 'tags', element: <AdminTagsPage /> },
          { path: 'tags/create', element: <TagFormPage /> },
          { path: 'tags/:id/edit', element: <TagFormPage /> },
          { path: 'settings', element: <AdminSettingsPage /> },
        ],
      },
    ],
  },
]);
