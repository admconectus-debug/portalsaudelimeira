import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Clinics from "./pages/Clinics";
import ClinicDetail from "./pages/ClinicDetail";
import Professionals from "./pages/Professionals";
import ProfessionalProfile from "./pages/ProfessionalProfile";
import Specialties from "./pages/Specialties";
import SpecialtyProfessionals from "./pages/SpecialtyProfessionals";
import Contact from "./pages/Contact";
import Auth from "./pages/Auth";
import Admin from "./pages/Admin";
import News from "./pages/News";
import NewsDetail from "./pages/NewsDetail";
import Hospitals from "./pages/Hospitals";
import ModalityPage, { MODALITY_CONFIGS } from "./pages/ModalityPage";
import EstablishmentDetail from "./pages/EstablishmentDetail";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/clinicas" element={<Clinics />} />
          <Route path="/clinicas/:slug" element={<ClinicDetail />} />
          <Route path="/profissionais" element={<Professionals />} />
          <Route path="/profissionais/:id" element={<ProfessionalProfile />} />
          <Route path="/especialidades" element={<Specialties />} />
          <Route path="/especialidades/:id" element={<SpecialtyProfessionals />} />
          <Route path="/contato" element={<Contact />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/noticias" element={<News />} />
          <Route path="/noticias/:slug" element={<NewsDetail />} />
          <Route path="/hospitais" element={<Hospitals />} />
          <Route path="/planos-medicos" element={<ModalityPage config={MODALITY_CONFIGS["planos-medicos"]} />} />
          <Route path="/planos-medicos/:slug" element={<EstablishmentDetail category="planos-medicos" />} />
          <Route path="/servicos-24h" element={<ModalityPage config={MODALITY_CONFIGS["servicos-24h"]} />} />
          <Route path="/servicos-24h/:slug" element={<EstablishmentDetail category="servicos-24h" />} />
          <Route path="/laboratorios" element={<ModalityPage config={MODALITY_CONFIGS["laboratorios"]} />} />
          <Route path="/laboratorios/:slug" element={<EstablishmentDetail category="laboratorios" />} />
          <Route path="/farmacias" element={<ModalityPage config={MODALITY_CONFIGS["farmacias"]} />} />
          <Route path="/farmacias/:slug" element={<EstablishmentDetail category="farmacias" />} />
          <Route path="/saude-beleza" element={<ModalityPage config={MODALITY_CONFIGS["saude-beleza"]} />} />
          <Route path="/saude-beleza/:slug" element={<EstablishmentDetail category="saude-beleza" />} />
          <Route path="/saude-pets" element={<ModalityPage config={MODALITY_CONFIGS["saude-pets"]} />} />
          <Route path="/saude-pets/:slug" element={<EstablishmentDetail category="saude-pets" />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
