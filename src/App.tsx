import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ScrollToTop from "./components/ScrollToTop";
import Index from "./pages/Index";
import GlobalHealthSync from "./pages/GlobalHealthSync";
import NurseSync from "./pages/NurseSync";
import ConneqtCentral from "./pages/ConneqtCentral";
import IceSosLite from "./pages/IceSosLite";
import AiSpainHomes from "./pages/AiSpainHomes";
import TetherBand from "./pages/TetherBand";
import ForInvestors from "./pages/ForInvestors";
import ForSale from "./pages/ForSale";
import CustomBuilds from "./pages/CustomBuilds";
import Admin from "./pages/Admin";
import Auth from "./pages/Auth";
import AiAgents from "./pages/AiAgents";
import Contact from "./pages/Contact";
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
          <Route path="/global-health-sync" element={<GlobalHealthSync />} />
          <Route path="/nurse-sync" element={<NurseSync />} />
          <Route path="/conneqt-central" element={<ConneqtCentral />} />
          <Route path="/ice-sos-lite" element={<IceSosLite />} />
          <Route path="/ai-spain-homes" element={<AiSpainHomes />} />
          <Route path="/tether-band" element={<TetherBand />} />
          <Route path="/for-investors" element={<ForInvestors />} />
          <Route path="/for-sale" element={<ForSale />} />
          <Route path="/custom-builds" element={<CustomBuilds />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/ai-agents" element={<AiAgents />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
