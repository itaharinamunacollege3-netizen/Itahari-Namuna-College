import { Suspense } from "react";
import { Outlet } from "react-router-dom";
import Footer from "../components/common/Footer";
import Navbar from "../components/common/Navbar";
import Topbar from "../components/common/Topbar";
import FloatingNotice from "../components/common/FloatingNotice";
import ScrollToTop from "../components/common/ScrollToTop";
import NoticePopup from "../features/notices/components/NoticePopup";

export default function PublicLayout() {
  return (
      <div className="min-h-screen flex flex-col bg-brand-gray text-brand-dark font-body">
        <Topbar />
        <Navbar />

        <main className="grow">
          <Suspense fallback={null}>
            <Outlet />
          </Suspense>
        </main>

        <Footer />
        <FloatingNotice />
        <NoticePopup />
        <ScrollToTop />
      </div>
  );
}
