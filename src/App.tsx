import { lazy, Suspense } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { NoIndex } from "@/seo/Seo";
import { AuthProvider } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import ReferralCapture from "@/components/referral/ReferralCapture";
import { usePageTracking } from "@/hooks/usePageTracking";
import Index from "./pages/Index";
const Login = lazy(() => import("./pages/Login"));
const Signup = lazy(() => import("./pages/Signup"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const NotFound = lazy(() => import("./pages/NotFound"));
const Analytics = lazy(() => import("./pages/Analytics"));
const CalendarPage = lazy(() => import("./pages/CalendarPage"));
const Settings = lazy(() => import("./pages/Settings"));
const TodoCalendar = lazy(() => import("./pages/TodoCalendar"));
const ReferEarn = lazy(() => import("./pages/ReferEarn"));
const ForgotPassword = lazy(() => import("./pages/ForgotPassword"));
const ResetPassword = lazy(() => import("./pages/ResetPassword"));
const AdminDashboard = lazy(() => import("./pages/AdminDashboard"));
const M = () => import("./pages/marketing");
const PricingPage = lazy(() => M().then((m) => ({ default: m.PricingPage })));
const FeaturesPage = lazy(() => M().then((m) => ({ default: m.FeaturesPage })));
const AICoachPage = lazy(() => M().then((m) => ({ default: m.AICoachPage })));
const About = lazy(() => M().then((m) => ({ default: m.AboutPage })));
const FAQPage = lazy(() => M().then((m) => ({ default: m.FAQPage })));
const BlogIndexPage = lazy(() => M().then((m) => ({ default: m.BlogIndexPage })));
const BlogPostPage = lazy(() => M().then((m) => ({ default: m.BlogPostPage })));
const ComparePage = lazy(() => M().then((m) => ({ default: m.ComparePage })));
const UseCasePage = lazy(() => M().then((m) => ({ default: m.UseCasePage })));
const Contact = lazy(() => import("./pages/Contact"));
const Routines = lazy(() => import("./pages/Routines"));
const Learn = lazy(() => import("./pages/Learn"));
const Notifications = lazy(() => import("./pages/Notifications"));
const Earn = lazy(() => import("./pages/Earn"));
const GoogleCallback = lazy(() => import("./pages/GoogleCallback"));
const AICoach = lazy(() => import("./pages/AICoach"));
const Terms = lazy(() => import("./pages/Legal").then((m) => ({ default: m.Terms })));
const Privacy = lazy(() => import("./pages/Legal").then((m) => ({ default: m.Privacy })));
const Shipping = lazy(() => import("./pages/Legal").then((m) => ({ default: m.Shipping })));
const Refunds = lazy(() => import("./pages/Legal").then((m) => ({ default: m.Refunds })));

const queryClient = new QueryClient({ defaultOptions: { queries: { staleTime: 60_000, refetchOnWindowFocus: false } } });

const PageLoader = () => (
  <div className="min-h-screen bg-background flex items-center justify-center">
    <div className="h-8 w-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
  </div>
);

const PRIVATE = ["/dashboard", "/login", "/signup", "/forgot-password", "/reset-password", "/RajputAdMin", "/auth", "/app"];
const PageTracker = () => {
  usePageTracking();
  const { pathname } = useLocation();
  return PRIVATE.some((p) => pathname.startsWith(p)) ? <NoIndex /> : null;
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
          <Suspense fallback={<PageLoader />}>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/earn" element={<Earn />} />
            <Route path="/auth/google" element={<GoogleCallback />} />
            <Route path="/about" element={<About />} />
            <Route path="/pricing" element={<PricingPage />} />
            <Route path="/features" element={<FeaturesPage />} />
            <Route path="/ai-coach" element={<AICoachPage />} />
            <Route path="/faq" element={<FAQPage />} />
            <Route path="/blog" element={<BlogIndexPage />} />
            <Route path="/blog/:slug" element={<BlogPostPage />} />
            <Route path="/compare/:slug" element={<ComparePage />} />
            <Route path="/use-cases/:slug" element={<UseCasePage />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/shipping" element={<Shipping />} />
            <Route path="/refunds" element={<Refunds />} />
            <Route path="/RajputAdMin" element={<AdminDashboard />} />
            <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/dashboard/analytics" element={<ProtectedRoute><Analytics /></ProtectedRoute>} />
            <Route path="/dashboard/calendar" element={<ProtectedRoute><CalendarPage /></ProtectedRoute>} />
            <Route path="/dashboard/coach" element={<ProtectedRoute><AICoach /></ProtectedRoute>} />
            <Route path="/dashboard/routines" element={<ProtectedRoute><Routines /></ProtectedRoute>} />
            <Route path="/dashboard/learn" element={<ProtectedRoute><Learn /></ProtectedRoute>} />
            <Route path="/dashboard/notifications" element={<ProtectedRoute><Notifications /></ProtectedRoute>} />
            <Route path="/dashboard/todos" element={<ProtectedRoute><TodoCalendar /></ProtectedRoute>} />
            <Route path="/dashboard/refer" element={<ProtectedRoute><ReferEarn /></ProtectedRoute>} />
            <Route path="/dashboard/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
            <Route path="*" element={<NotFound />} />
          </Routes>
          </Suspense>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
