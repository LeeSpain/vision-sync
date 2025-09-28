import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ScrollToTop from "./components/ScrollToTop";
import Index from "./pages/Index";
import Templates from "./pages/Templates";
import TemplateFinder from "./pages/TemplateFinder";
import TemplateRecommendations from "./pages/TemplateRecommendations";
import TemplatePreview from "./pages/TemplatePreview";
import DynamicProjectPage from "./components/DynamicProjectPage";
import Admin from "./pages/Admin";
import Auth from "./pages/Auth";
import AiAgents from "./pages/AiAgents";
import AiAgentQuestionnaire from "./pages/AiAgentQuestionnaire";
import Contact from "./pages/Contact";
import IceSosLite from "./pages/IceSosLite";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <ScrollToTop />
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/templates" element={<Templates />} />
          <Route path="/template-finder" element={<TemplateFinder />} />
          <Route path="/template-recommendations" element={<TemplateRecommendations />} />
          <Route path="/template-preview/:id" element={<TemplatePreview />} />
          
          {/* CRITICAL: Static admin and system pages MUST come before dynamic routes */}
          <Route path="/admin" element={<Admin />} />
          <Route path="/admin/*" element={<Admin />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/ai-agents" element={<AiAgents />} />
          <Route path="/ai-agent-questionnaire" element={<AiAgentQuestionnaire />} />
          <Route path="/contact" element={<Contact />} />
          
          {/* Specific known project routes */}
          <Route path="/global-health-sync" element={<DynamicProjectPage />} />
          <Route path="/nurse-sync" element={<DynamicProjectPage />} />
          <Route path="/conneqt-central" element={<DynamicProjectPage />} />
          <Route path="/ice-sos-lite" element={<IceSosLite />} />
          <Route path="/ai-spain-homes" element={<DynamicProjectPage />} />
          <Route path="/tether-band" element={<DynamicProjectPage />} />
          <Route path="/for-investors" element={<DynamicProjectPage />} />
          <Route path="/for-sale" element={<DynamicProjectPage />} />
          <Route path="/custom-builds" element={<DynamicProjectPage />} />
          
          {/* Catch-all dynamic route for any other project URLs - MUST be last */}
          <Route path="/:projectRoute" element={<DynamicProjectPage />} />
          
          {/* 404 fallback */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
