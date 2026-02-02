import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface MonthSelectorProps {
  currentMonth: Date;
  onPrevMonth: () => void;
  onNextMonth: () => void;
}

const MonthSelector = ({ currentMonth, onPrevMonth, onNextMonth }: MonthSelectorProps) => {
  const monthName = currentMonth.toLocaleString("default", { month: "long" });
  const year = currentMonth.getFullYear();

  return (
    <div className="flex items-center gap-4">
      <Button variant="ghost" size="icon" onClick={onPrevMonth}>
        <ChevronLeft className="w-5 h-5" />
      </Button>
      <div className="text-xl font-bold font-display min-w-[180px] text-center">
        {monthName} {year}
      </div>
      <Button variant="ghost" size="icon" onClick={onNextMonth}>
        <ChevronRight className="w-5 h-5" />
      </Button>
    </div>
  );
};

export default MonthSelector;