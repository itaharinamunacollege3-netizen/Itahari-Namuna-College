import { lazy, Suspense } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "@/contexts/AuthContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { ProtectedRoute } from "@/routes/ProtectedRoute";
import { AdminLayout } from "@/components/layout/AdminLayout";

const LoginPage = lazy(() => import("@/pages/LoginPage"));
const DashboardPage = lazy(() => import("@/pages/DashboardPage"));
const AdmissionsPage = lazy(() => import("@/pages/AdmissionsPage"));
const ContactsPage = lazy(() => import("@/pages/ContactsPage"));
const NoticesPage = lazy(() => import("@/pages/NoticesPage"));
const ProgramsPage = lazy(() => import("@/pages/ProgramsPage"));
const GalleryPage = lazy(() => import("@/pages/GalleryPage"));
const FacultyPage = lazy(() => import("@/pages/FacultyPage"));
const StaffPage = lazy(() => import("@/pages/StaffPage"));
const CategoriesPage = lazy(() => import("@/pages/CategoriesPage"));
const BlogsPage = lazy(() => import("@/pages/BlogsPage"));
const JournalsPage = lazy(() => import("@/pages/JournalsPage"));
const NotificationsPage = lazy(() => import("@/pages/NotificationsPage"));
const SettingsPage = lazy(() => import("@/pages/SettingsPage"));

function PageLoader() {
  return (
    <div className="flex min-h-[40vh] items-center justify-center">
      <span className="loading loading-spinner loading-lg text-[var(--color-brand)]" />
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          <Toaster position="top-right" />
          <Suspense fallback={<PageLoader />}>
            <Routes>
              <Route path="/login" element={<LoginPage />} />
              <Route element={<ProtectedRoute />}>
                <Route element={<AdminLayout />}>
                  <Route index element={<Navigate to="/dashboard" replace />} />
                  <Route path="/dashboard" element={<DashboardPage />} />
                  <Route path="/admissions" element={<AdmissionsPage />} />
                  <Route path="/contacts" element={<ContactsPage />} />
                  <Route path="/notices" element={<NoticesPage />} />
                  <Route path="/programs" element={<ProgramsPage />} />
                  <Route path="/blogs" element={<BlogsPage />} />
                  <Route path="/journals" element={<JournalsPage />} />
                  <Route path="/gallery" element={<GalleryPage />} />
                  <Route path="/faculty" element={<FacultyPage />} />
                  <Route path="/staff" element={<StaffPage />} />
                  <Route path="/categories" element={<CategoriesPage />} />
                  <Route path="/notifications" element={<NotificationsPage />} />
                  <Route path="/settings" element={<SettingsPage />} />
                </Route>
              </Route>
              <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </Routes>
          </Suspense>
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
}
