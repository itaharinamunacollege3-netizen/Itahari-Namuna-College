import React from "react";
import AppRoutes from "./routes/AppRoutes";
import SmoothScrollProvider from "./components/common/SmoothScrollProvider";
import { BrowserRouter } from "react-router-dom";

export default function App() {
  return (
      <AppRoutes />
  );
}
