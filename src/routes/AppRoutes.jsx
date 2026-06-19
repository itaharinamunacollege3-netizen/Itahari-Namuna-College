import { lazy } from 'react';
import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
import PublicLayout from '../layouts/PublicLayout';
import SmoothScrollProvider from '../components/common/SmoothScrollProvider';

const HomePage = lazy(() => import('../features/general_pages/HomePage'));
const AboutPage = lazy(() => import('../features/general_pages/AboutPage'));
const AcademicHubPage = lazy(() => import('../features/academics/pages/AcademicHubPage'));
const ProgramDetailPage = lazy(() => import('../features/academics/pages/ProgramDetailPage'));
const CellsHubPage = lazy(() => import('../features/cells_and_units/pages/CellsHubPage'));
const UnitDetailPage = lazy(() => import('../features/cells_and_units/pages/UnitDetailPage'));
const NoticeBoardPage = lazy(() => import('../features/notices/pages/NoticeBoardPage'));
const NoticeViewerPage = lazy(() => import('../features/notices/pages/NoticeViewerPage'));
const GalleryHubPage = lazy(() => import('../features/gallery/pages/GalleryHubPage'));
const CategoryGridPage = lazy(() => import('../features/gallery/pages/CategoryGridPage'));
const ContactPage = lazy(() => import('../features/general_pages/ContactPage'));


const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <SmoothScrollProvider>
        <PublicLayout />
      </SmoothScrollProvider>
    ),
    children: [
      { index: true, element: <HomePage /> },
      { path: 'about', element: <AboutPage /> },

      { path: 'academic', element: <AcademicHubPage /> },
      { path: 'academic/:id', element: <ProgramDetailPage /> },

      { path: 'cells-and-units', element: <CellsHubPage /> },
      { path: 'cells-and-units/:unitId', element: <UnitDetailPage /> },

      { path: 'notices', element: <NoticeBoardPage /> },
      { path: 'notices/:id', element: <NoticeViewerPage /> },

      { path: 'gallery', element: <GalleryHubPage /> },
      { path: 'gallery/:category', element: <CategoryGridPage /> },

      { path: 'contact', element: <ContactPage /> },

      { path: '*', element: <Navigate to="/" replace /> }
    ]
  }
]);

export default function AppRoutes() {
  return <RouterProvider router={router} />;
}