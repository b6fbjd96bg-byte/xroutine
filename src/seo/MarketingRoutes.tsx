// Route table for public pages, shared by the prerender (build-time) entry.
import { Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { TooltipProvider } from "@/components/ui/tooltip";
import Landing from "@/pages/Landing";
import Earn from "@/pages/Earn";
import Contact from "@/pages/Contact";
import { Terms, Privacy, Shipping, Refunds } from "@/pages/Legal";
import { PricingPage, FeaturesPage, AICoachPage, AboutPage, FAQPage, BlogIndexPage, BlogPostPage, ComparePage, UseCasePage } from "@/pages/marketing";

export const MarketingRoutes = () => (
  <AuthProvider>
    <TooltipProvider>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/pricing" element={<PricingPage />} />
        <Route path="/features" element={<FeaturesPage />} />
        <Route path="/ai-coach" element={<AICoachPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/faq" element={<FAQPage />} />
        <Route path="/blog" element={<BlogIndexPage />} />
        <Route path="/blog/:slug" element={<BlogPostPage />} />
        <Route path="/compare/:slug" element={<ComparePage />} />
        <Route path="/use-cases/:slug" element={<UseCasePage />} />
        <Route path="/earn" element={<Earn />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/shipping" element={<Shipping />} />
        <Route path="/refunds" element={<Refunds />} />
      </Routes>
    </TooltipProvider>
  </AuthProvider>
);
