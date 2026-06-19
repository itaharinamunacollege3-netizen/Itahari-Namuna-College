import React from 'react';
import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
import PublicLayout from '../layouts/PublicLayout';
import HomePage from '../features/general_pages/HomePage';
import AboutPage from '../features/general_pages/AboutPage';
import AcademicHubPage from '../features/academics/pages/AcademicHubPage';
import ProgramDetailPage from '../features/academics/pages/ProgramDetailPage';
import CellsHubPage from '../features/cells_and_units/pages/CellsHubPage';
import UnitDetailPage from '../features/cells_and_units/pages/UnitDetailPage';
import NoticeBoardPage from '../features/notices/pages/NoticeBoardPage';
import NoticeViewerPage from '../features/notices/pages/NoticeViewerPage';
import GalleryHubPage from '../features/gallery/pages/GalleryHubPage';
import CategoryGridPage from '../features/gallery/pages/CategoryGridPage';
import ContactPage from '../features/general_pages/ContactPage';
import SmoothScrollProvider from '../components/common/SmoothScrollProvider';
import FacilitiesPage from '../features/facilities/pages/FacilitiesPage';


//router configuration
const router = createBrowserRouter([
  {
    path: '/',
    element:
      <SmoothScrollProvider>
      <PublicLayout />,// Wraps the entire application structure
     </SmoothScrollProvider>, 
    children: [
      { index: true, element: <HomePage /> },
      { path: 'about', element: <AboutPage /> },

      // Academics Section
      { path: 'academic', element: <AcademicHubPage /> },
      { path: 'academic/:id', element: <ProgramDetailPage /> },

      // Organizational Units
      { path: 'cells-and-units', element: <CellsHubPage /> },
      { path: 'cells-and-units/:unitId', element: <UnitDetailPage /> },

      // Notice Suite
      { path: 'notices', element: <NoticeBoardPage /> },
      { path: 'notices/:id', element: <NoticeViewerPage /> },

      // Media Folders
      { path: 'gallery', element: <GalleryHubPage /> },
      { path: 'gallery/:category', element: <CategoryGridPage /> },

      // Communication Hub
      { path: 'contact', element: <ContactPage /> },

      // Fallback Route: Redirects any typos back to Home
      { path: '*', element: <Navigate to="/" replace /> },

      // facilities page
      {path:'facilities', element: <FacilitiesPage /> }
    ]
  }
]);

export default function AppRoutes() {
  return <RouterProvider router={router} />;
}