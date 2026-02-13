"use client";

import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useTheme } from "next-themes";

const data = [
  { name: 'Mon', views: 4000, likes: 2400 },
  { name: 'Tue', views: 3000, likes: 1398 },
  { name: 'Wed', views: 2000, likes: 9800 },
  { name: 'Thu', views: 2780, likes: 3908 },
  { name: 'Fri', views: 1890, likes: 4800 },
  { name: 'Sat', views: 2390, likes: 3800 },
  { name: 'Sun', views: 3490, likes: 4300 },
];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-card border border-border p-3 rounded-lg shadow-lg">
        <p className="text-sm font-bold mb-1">{label}</p>
        <p className="text-xs text-primary">
          Views: <span className="font-mono">{payload[0].value}</span>
        </p>
        <p className="text-xs text-muted-foreground">
          Likes: <span className="font-mono">{payload[1].value}</span>
        </p>
      </div>
    );
  }
  return null;
};

export default function AnalyticsChart() {
  const { theme } = useTheme();

  return (
    <div className="h-[300px] w-full bg-card rounded-2xl border border-border p-4 shadow-sm">
      <div className="flex items-center justify-between mb-4 px-2">
        <h3 className="font-bold text-lg">Channel Analytics</h3>
        <select className="bg-background border border-border rounded-lg text-sm px-2 py-1 outline-none focus:ring-2 focus:ring-primary/20">
            <option>Last 7 Days</option>
            <option>Last 30 Days</option>
            <option>Last 90 Days</option>
        </select>
      </div>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={data}
          margin={{
            top: 10,
            right: 10,
            left: 0,
            bottom: 0,
          }}
        >
          <defs>
            <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="var(--primary)" stopOpacity={0}/>
            </linearGradient>
            <linearGradient id="colorLikes" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="var(--secondary)" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="var(--secondary)" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
          <XAxis
            dataKey="name"
            stroke="var(--muted-foreground)"
            fontSize={12}
            tickLine={false}
            axisLine={false}
          />
          <YAxis
            stroke="var(--muted-foreground)"
            fontSize={12}
            tickLine={false}
            axisLine={false}
            tickFormatter={(value) => `${value / 1000}k`}
          />
          <Tooltip content={<CustomTooltip />} />
          <Area
            type="monotone"
            dataKey="views"
            stroke="var(--primary)"
            fillOpacity={1}
            fill="url(#colorViews)"
            strokeWidth={2}
          />
          <Area
            type="monotone"
            dataKey="likes"
            stroke="var(--foreground)"
            fillOpacity={1}
            fill="url(#colorLikes)"
            strokeWidth={2}
            strokeDasharray="5 5"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
