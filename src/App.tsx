import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation, Navigate } from "react-router-dom";
import { useEffect } from "react";
import { AuthProvider } from "@/contexts/AuthContext";
import ScrollToTop from "./components/ScrollToTop";
import Index from "./pages/Index";
import Platform from "./pages/Platform";
import Solutions from "./pages/Solutions";
import ModulePicker from './pages/ModulePicker';
import QuotePortal from './pages/QuotePortal';
import Modules from "./pages/Modules";
import Pricing from "./pages/Pricing";
import DynamicProjectPage from "./components/DynamicProjectDetail";
import Admin from "./pages/Admin";
import AuthPage from "./pages/AuthPage";
import { AdminRoute } from "./components/AdminRoute";
import Contact from "./pages/Contact";
import NotFound from "./pages/NotFound";

import { SalesDashboardLayout } from "./components/sales-dashboard/layout/SalesDashboardLayout";
import DashboardOverview from "./pages/SalesDashboard/DashboardOverview";
import ProspectFinder from "./pages/SalesDashboard/ProspectFinder";
import LeadsManagement from "./pages/SalesDashboard/LeadsManagement";
import SalesPipeline from "./pages/SalesDashboard/SalesPipeline";
import DealRooms from "./pages/SalesDashboard/DealRooms";
import DemoGenerator from "./pages/SalesDashboard/DemoGenerator";
import Quotes from "./pages/SalesDashboard/Quotes";
import Contracts from "./pages/SalesDashboard/Contracts";
import Payments from "./pages/SalesDashboard/Payments";
import Analytics from "./pages/SalesDashboard/Analytics";
import SalesCopilot from "./pages/SalesDashboard/SalesCopilot";

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
            <Route path="/solutions" element={<Navigate to="/#industries" replace />} />
            <Route path="/solutions/:industrySlug" element={<Solutions />} />
            <Route path="/solutions/:industrySlug/build" element={<ModulePicker />} />
            <Route path="/quote/:quoteReference" element={<QuotePortal />} />
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

            {/* Sales Dashboard Routes */}
            <Route path="/sales-dashboard" element={<AdminRoute><SalesDashboardLayout><DashboardOverview /></SalesDashboardLayout></AdminRoute>} />
            <Route path="/sales-dashboard/prospects" element={<AdminRoute><SalesDashboardLayout><ProspectFinder /></SalesDashboardLayout></AdminRoute>} />
            <Route path="/sales-dashboard/leads" element={<AdminRoute><SalesDashboardLayout><LeadsManagement /></SalesDashboardLayout></AdminRoute>} />
            <Route path="/sales-dashboard/pipeline" element={<AdminRoute><SalesDashboardLayout><SalesPipeline /></SalesDashboardLayout></AdminRoute>} />
            <Route path="/sales-dashboard/deals" element={<AdminRoute><SalesDashboardLayout><DealRooms /></SalesDashboardLayout></AdminRoute>} />
            <Route path="/sales-dashboard/deals/:id" element={<AdminRoute><SalesDashboardLayout><DealRooms /></SalesDashboardLayout></AdminRoute>} />
            <Route path="/sales-dashboard/demos" element={<AdminRoute><SalesDashboardLayout><DemoGenerator /></SalesDashboardLayout></AdminRoute>} />
            <Route path="/sales-dashboard/quotes" element={<AdminRoute><SalesDashboardLayout><Quotes /></SalesDashboardLayout></AdminRoute>} />
            <Route path="/sales-dashboard/contracts" element={<AdminRoute><SalesDashboardLayout><Contracts /></SalesDashboardLayout></AdminRoute>} />
            <Route path="/sales-dashboard/payments" element={<AdminRoute><SalesDashboardLayout><Payments /></SalesDashboardLayout></AdminRoute>} />
            <Route path="/sales-dashboard/analytics" element={<AdminRoute><SalesDashboardLayout><Analytics /></SalesDashboardLayout></AdminRoute>} />
            <Route path="/sales-dashboard/copilot" element={<AdminRoute><SalesDashboardLayout><SalesCopilot /></SalesDashboardLayout></AdminRoute>} />

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
