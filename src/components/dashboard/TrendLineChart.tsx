import { motion } from "framer-motion";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart,
} from "recharts";

interface TrendData {
  day: number;
  completed: number;
  percentage: number;
}

interface TrendLineChartProps {
  data: TrendData[];
}

const TrendLineChart = ({ data }: TrendLineChartProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.2 }}
      className="glass-card p-6"
    >
      <h2 className="text-xl font-bold font-display mb-6">Daily Completion Trend</h2>
      
      <div className="h-[200px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="colorCompleted" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(160, 84%, 39%)" stopOpacity={0.4} />
                <stop offset="95%" stopColor="hsl(160, 84%, 39%)" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="lineGradient" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="hsl(160, 84%, 39%)" />
                <stop offset="100%" stopColor="hsl(180, 70%, 50%)" />
              </linearGradient>
            </defs>
            <CartesianGrid 
              strokeDasharray="3 3" 
              stroke="hsl(230, 40%, 18%)" 
              vertical={false}
            />
            <XAxis 
              dataKey="day" 
              stroke="hsl(215, 20%, 55%)"
              fontSize={11}
              tickLine={false}
              axisLine={false}
            />
            <YAxis 
              stroke="hsl(215, 20%, 55%)"
              fontSize={11}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => `${value}`}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(230, 60%, 8%)",
                border: "1px solid hsl(230, 40%, 18%)",
                borderRadius: "12px",
                boxShadow: "0 8px 32px hsl(228, 84%, 3%, 0.6)",
              }}
              labelStyle={{ color: "hsl(210, 40%, 98%)" }}
              itemStyle={{ color: "hsl(160, 84%, 39%)" }}
              formatter={(value: number) => [`${value} habits`, "Completed"]}
              labelFormatter={(label) => `Day ${label}`}
            />
            <Area
              type="monotone"
              dataKey="completed"
              stroke="url(#lineGradient)"
              strokeWidth={3}
              fill="url(#colorCompleted)"
              dot={false}
              activeDot={{
                r: 6,
                fill: "hsl(160, 84%, 39%)",
                stroke: "hsl(228, 84%, 5%)",
                strokeWidth: 2,
              }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
};

export default TrendLineChart;