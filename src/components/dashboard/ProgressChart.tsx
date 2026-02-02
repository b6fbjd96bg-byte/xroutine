import { motion } from "framer-motion";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";

interface ProgressChartProps {
  completed: number;
  total: number;
}

const ProgressChart = ({ completed, total }: ProgressChartProps) => {
  const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;
  const remaining = total - completed;

  const data = [
    { name: "Completed", value: completed },
    { name: "Remaining", value: remaining > 0 ? remaining : 0 },
  ];

  const COLORS = ["hsl(168, 76%, 42%)", "hsl(217, 33%, 17%)"];

  return (
    <div className="glass-card p-6">
      <h2 className="text-xl font-bold font-display mb-6 text-center">Overall Daily Progress</h2>
      
      <div className="relative w-48 h-48 mx-auto">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={80}
              startAngle={90}
              endAngle={-270}
              paddingAngle={2}
              dataKey="value"
            >
              {data.map((_, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
        
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          className="absolute inset-0 flex items-center justify-center"
        >
          <div className="text-center">
            <div className="text-3xl font-bold text-primary">{percentage}%</div>
          </div>
        </motion.div>
      </div>

      <div className="flex justify-center gap-6 mt-6">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-primary" />
          <span className="text-sm text-muted-foreground">Completed</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-secondary" />
          <span className="text-sm text-muted-foreground">Remaining</span>
        </div>
      </div>
    </div>
  );
};

export default ProgressChart;