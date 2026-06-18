import React from "react";
import { Outlet } from "react-router-dom";
import Footer from "../components/common/Footer";
import Navbar from "../components/common/Navbar";
export default function PublicLayout() {
  return (
      <div className="min-h-screen flex flex-col bg-brand-gray text-brand-dark font-body">
        <Navbar />

        {/* DYNAMIC VIEWPORT CONTENT: This renders whichever page route is active */}
        <main className="grow">
          <Outlet />
        </main>

        <Footer />
      </div>
  );
}
