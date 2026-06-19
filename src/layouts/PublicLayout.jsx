import { Suspense } from "react";
import { Outlet } from "react-router-dom";
import Footer from "../components/common/Footer";
import Navbar from "../components/common/Navbar";
export default function PublicLayout() {
  return (
      <div className="min-h-screen flex flex-col bg-brand-gray text-brand-dark font-body">
        <Navbar />

        <main className="grow">
          <Suspense fallback={null}>
            <Outlet />
          </Suspense>
        </main>

        <Footer />
      </div>
  );
}
