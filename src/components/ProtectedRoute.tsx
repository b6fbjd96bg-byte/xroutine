import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useSubscription } from "@/hooks/useSubscription";
import TrialPaywall from "@/components/premium/TrialPaywall";

const Loader = () => (
  <div className="min-h-screen bg-background flex items-center justify-center">
    <div className="h-8 w-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
  </div>
);

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();
  const { trialExpired, loading: subLoading } = useSubscription();

  if (loading) return <Loader />;
  if (!user) return <Navigate to="/login" replace />;
  if (subLoading) return <Loader />;
  if (trialExpired) return <TrialPaywall />;

  return <>{children}</>;
};

export default ProtectedRoute;
