import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { useEffect } from "react";
import analyticsTracking from "./utils/analytics";
import { AuthProvider } from "@/contexts/AuthContext";
import ScrollToTop from "./components/ScrollToTop";
import { analytics } from "@/utils/analytics";
import Index from "./pages/Index";
import Platform from "./pages/Platform";
import Solutions from "./pages/Solutions";
import Modules from "./pages/Modules";
import Pricing from "./pages/Pricing";
import DynamicProjectPage from "./components/DynamicProjectPage";
import Admin from "./pages/Admin";
import AuthPage from "./pages/AuthPage";
import { AdminRoute } from "./components/AdminRoute";
import Contact from "./pages/Contact";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <ScrollToTop />
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/platform" element={<Platform />} />
            <Route path="/solutions" element={<Solutions />} />
            <Route path="/modules" element={<Modules />} />
            <Route path="/pricing" element={<Pricing />} />
            <Route path="/contact" element={<Contact />} />

            {/* CRITICAL: Static admin and system pages MUST come before dynamic routes */}
            <Route path="/admin" element={
              <AdminRoute>
                <Admin />
              </AdminRoute>
            } />
            <Route path="/admin/*" element={
              <AdminRoute>
                <Admin />
              </AdminRoute>
            } />
            <Route path="/auth" element={<AuthPage />} />

            {/* Catch-all dynamic route for any other project URLs - MUST be last */}
            <Route path="/:projectRoute" element={<DynamicProjectPage />} />

            {/* 404 fallback */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
