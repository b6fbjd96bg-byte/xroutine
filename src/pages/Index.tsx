import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import Landing from "./Landing";

const Index = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  // After returning from Google sign-in, continue to the dashboard
  useEffect(() => {
    if (loading || !user) return;
    const next = sessionStorage.getItem("post_auth_redirect");
    if (next) {
      sessionStorage.removeItem("post_auth_redirect");
      navigate(next, { replace: true });
    }
  }, [user, loading, navigate]);

  return <Landing />;
};

export default Index;
