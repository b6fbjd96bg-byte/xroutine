import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import ReferralCapture from "@/components/referral/ReferralCapture";
import { usePageTracking } from "@/hooks/usePageTracking";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import NotFound from "./pages/NotFound";
import Analytics from "./pages/Analytics";
import CalendarPage from "./pages/CalendarPage";
import Settings from "./pages/Settings";
import TodoCalendar from "./pages/TodoCalendar";
import ReferEarn from "./pages/ReferEarn";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import AdminDashboard from "./pages/AdminDashboard";
import About from "./pages/About";
import Contact from "./pages/Contact";
import { Terms, Privacy, Shipping, Refunds } from "./pages/Legal";

const queryClient = new QueryClient();

const PageTracker = () => {
  usePageTracking();
  return null;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <PageTracker />
          <ReferralCapture />
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/shipping" element={<Shipping />} />
            <Route path="/refunds" element={<Refunds />} />
            <Route path="/RajputAdMin" element={<AdminDashboard />} />
            <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/dashboard/analytics" element={<ProtectedRoute><Analytics /></ProtectedRoute>} />
            <Route path="/dashboard/calendar" element={<ProtectedRoute><CalendarPage /></ProtectedRoute>} />
            <Route path="/dashboard/todos" element={<ProtectedRoute><TodoCalendar /></ProtectedRoute>} />
            <Route path="/dashboard/refer" element={<ProtectedRoute><ReferEarn /></ProtectedRoute>} />
            <Route path="/dashboard/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
