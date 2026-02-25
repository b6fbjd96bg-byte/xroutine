import { useState } from "react";
import { Crown, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSubscription } from "@/hooks/useSubscription";
import UpgradePrompt from "./UpgradePrompt";

interface PremiumGateProps {
  children: React.ReactNode;
  feature: string;
  featureLabel?: string;
  inline?: boolean; // If true, show inline badge instead of overlay
}

const PremiumGate = ({ children, feature, featureLabel, inline = false }: PremiumGateProps) => {
  const { isPremium, loading } = useSubscription();
  const [showUpgrade, setShowUpgrade] = useState(false);

  if (loading || isPremium) return <>{children}</>;

  if (inline) {
    return (
      <>
        <div className="relative">
          {children}
          <button
            onClick={() => setShowUpgrade(true)}
            className="absolute inset-0 flex items-center justify-center bg-background/60 backdrop-blur-sm rounded-2xl cursor-pointer group transition-all"
          >
            <div className="flex flex-col items-center gap-2 p-4">
              <Lock className="w-6 h-6 text-chart-yellow group-hover:scale-110 transition-transform" />
              <span className="text-sm font-medium text-chart-yellow">Premium Feature</span>
              <Button variant="outline" size="sm" className="gap-1 border-chart-yellow/30 text-chart-yellow hover:bg-chart-yellow/10">
                <Crown className="w-3.5 h-3.5" />
                Unlock
              </Button>
            </div>
          </button>
        </div>
        <UpgradePrompt open={showUpgrade} onOpenChange={setShowUpgrade} feature={featureLabel || feature} />
      </>
    );
  }

  return (
    <>
      <button
        onClick={() => setShowUpgrade(true)}
        className="w-full text-left cursor-pointer"
      >
        <div className="relative opacity-50 pointer-events-none">
          {children}
        </div>
        <div className="flex items-center gap-2 mt-2 text-sm text-chart-yellow">
          <Crown className="w-4 h-4" />
          <span>Premium — Upgrade to unlock</span>
        </div>
      </button>
      <UpgradePrompt open={showUpgrade} onOpenChange={setShowUpgrade} feature={featureLabel || feature} />
    </>
  );
};

export default PremiumGate;
