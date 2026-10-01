import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface MonthSelectorProps {
  currentMonth: Date;
  onPrevMonth: () => void;
  onNextMonth: () => void;
  onChange?: (d: Date) => void;
}

const MONTHS = Array.from({ length: 12 }, (_, i) => new Date(2000, i, 1).toLocaleString("default", { month: "long" }));

const MonthSelector = ({ currentMonth, onPrevMonth, onNextMonth, onChange }: MonthSelectorProps) => {
  const year = currentMonth.getFullYear();
  const thisYear = new Date().getFullYear();
  const years = Array.from({ length: 6 }, (_, i) => thisYear - 4 + i);

  return (
    <div className="flex items-center gap-2">
      <Button variant="ghost" size="icon" onClick={onPrevMonth} aria-label="Previous month">
        <ChevronLeft className="w-5 h-5" />
      </Button>
      <Select value={String(currentMonth.getMonth())} onValueChange={(v) => onChange?.(new Date(year, Number(v), 1))}>
        <SelectTrigger className="w-[130px] font-display font-semibold"><SelectValue /></SelectTrigger>
        <SelectContent>{MONTHS.map((m, i) => <SelectItem key={m} value={String(i)}>{m}</SelectItem>)}</SelectContent>
      </Select>
      <Select value={String(year)} onValueChange={(v) => onChange?.(new Date(Number(v), currentMonth.getMonth(), 1))}>
        <SelectTrigger className="w-[95px] font-display font-semibold"><SelectValue /></SelectTrigger>
        <SelectContent>{years.map((y) => <SelectItem key={y} value={String(y)}>{y}</SelectItem>)}</SelectContent>
      </Select>
      <Button variant="ghost" size="icon" onClick={onNextMonth} aria-label="Next month">
        <ChevronRight className="w-5 h-5" />
      </Button>
    </div>
  );
};

export default MonthSelector;
