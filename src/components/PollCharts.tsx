import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Legend,
} from 'recharts';
import { PollResponse } from '../types';
import { format, parseISO } from 'date-fns';

const COLORS = ['#141414', '#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

interface ChartProps {
  data: PollResponse[];
}

export const PreferredToolChart: React.FC<ChartProps> = ({ data }) => {
  const chartData = React.useMemo(() => {
    const counts: Record<string, number> = {};
    data.forEach((r) => {
      counts[r.preferredTool] = (counts[r.preferredTool] || 0) + 1;
    });
    return Object.entries(counts)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);
  }, [data]);

  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
          <XAxis 
            dataKey="name" 
            axisLine={false} 
            tickLine={false} 
            tick={{ fontSize: 11, fontFamily: 'JetBrains Mono' }}
          />
          <YAxis 
            axisLine={false} 
            tickLine={false} 
            tick={{ fontSize: 11, fontFamily: 'JetBrains Mono' }}
          />
          <Tooltip 
            contentStyle={{ borderRadius: '0px', border: '1px solid #141414', fontFamily: 'JetBrains Mono', fontSize: '12px' }}
          />
          <Bar dataKey="value" fill="#141414" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export const PreferencePieChart: React.FC<ChartProps> = ({ data }) => {
  const chartData = React.useMemo(() => {
    const counts: Record<string, number> = {};
    data.forEach((r) => {
      counts[r.preferredTool] = (counts[r.preferredTool] || 0) + 1;
    });
    return Object.entries(counts).map(([name, value]) => ({ name, value }));
  }, [data]);

  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={80}
            paddingAngle={5}
            dataKey="value"
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip 
            contentStyle={{ borderRadius: '0px', border: '1px solid #141414', fontFamily: 'JetBrains Mono', fontSize: '12px' }}
          />
          <Legend wrapperStyle={{ fontSize: '11px', fontFamily: 'JetBrains Mono' }} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export const SatisfactionChart: React.FC<ChartProps> = ({ data }) => {
  const chartData = React.useMemo(() => {
    const counts: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    data.forEach((r) => {
      counts[r.satisfaction] = (counts[r.satisfaction] || 0) + 1;
    });
    return Object.entries(counts).map(([name, value]) => ({ name: `Star ${name}`, value }));
  }, [data]);

  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData} layout="vertical">
          <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#e5e7eb" />
          <XAxis type="number" hide />
          <YAxis 
            dataKey="name" 
            type="category" 
            axisLine={false} 
            tickLine={false} 
            tick={{ fontSize: 11, fontFamily: 'JetBrains Mono' }}
          />
          <Tooltip 
            cursor={{ fill: 'transparent' }}
            contentStyle={{ borderRadius: '0px', border: '1px solid #141414', fontFamily: 'JetBrains Mono', fontSize: '12px' }}
          />
          <Bar dataKey="value" fill="#3b82f6" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export const TrendLineChart: React.FC<ChartProps> = ({ data }) => {
  const chartData = React.useMemo(() => {
    const days: Record<string, number> = {};
    data.forEach((r) => {
      const d = format(parseISO(r.timestamp), 'MMM dd');
      days[d] = (days[d] || 0) + 1;
    });
    return Object.entries(days)
      .map(([date, count]) => ({ date, count }))
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }, [data]);

  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
          <XAxis 
            dataKey="date" 
            axisLine={false} 
            tickLine={false} 
            tick={{ fontSize: 10, fontFamily: 'JetBrains Mono' }}
          />
          <YAxis 
            axisLine={false} 
            tickLine={false} 
            tick={{ fontSize: 11, fontFamily: 'JetBrains Mono' }}
          />
          <Tooltip 
            contentStyle={{ borderRadius: '0px', border: '1px solid #141414', fontFamily: 'JetBrains Mono', fontSize: '12px' }}
          />
          <Line type="monotone" dataKey="count" stroke="#141414" strokeWidth={2} dot={{ r: 3 }} activeDot={{ r: 5 }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export const RegionStackedChart: React.FC<ChartProps> = ({ data }) => {
  const chartData = React.useMemo(() => {
    const regions: Record<string, Record<string, number>> = {};
    const tools = Array.from(new Set(data.map(d => d.preferredTool)));
    
    data.forEach((r) => {
      if (!regions[r.region]) regions[r.region] = {};
      regions[r.region][r.preferredTool] = (regions[r.region][r.preferredTool] || 0) + 1;
    });

    return Object.entries(regions).map(([name, toolCounts]) => ({
      name,
      ...toolCounts
    }));
  }, [data]);

  const tools = Array.from(new Set(data.map(d => d.preferredTool)));

  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
          <XAxis 
            dataKey="name" 
            axisLine={false} 
            tickLine={false} 
            tick={{ fontSize: 11, fontFamily: 'JetBrains Mono' }}
          />
          <YAxis 
            axisLine={false} 
            tickLine={false} 
            tick={{ fontSize: 11, fontFamily: 'JetBrains Mono' }}
          />
          <Tooltip 
            contentStyle={{ borderRadius: '0px', border: '1px solid #141414', fontFamily: 'JetBrains Mono', fontSize: '12px' }}
          />
          <Legend wrapperStyle={{ fontSize: '11px', fontFamily: 'JetBrains Mono' }} />
          {tools.map((tool, index) => (
            <Bar key={tool as string} dataKey={tool as string} stackId="a" fill={COLORS[index % COLORS.length]} />
          ))}
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};
