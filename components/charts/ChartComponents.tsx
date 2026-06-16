'use client';

import React from 'react';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { useTheme } from '@mui/material';

interface ChartProps {
  data: any[];
  height?: number;
  margin?: { top?: number; right?: number; bottom?: number; left?: number };
}

export function LineChartComponent({ data, height = 300, margin }: ChartProps) {
  const theme = useTheme();

  return (
    <ResponsiveContainer width="100%" height={height}>
      <LineChart data={data} margin={margin || { top: 5, right: 20, bottom: 5, left: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke={theme.palette.divider} />
        <XAxis stroke={theme.palette.text.secondary} style={{ fontSize: '0.875rem' }} />
        <YAxis stroke={theme.palette.text.secondary} style={{ fontSize: '0.875rem' }} />
        <Tooltip
          contentStyle={{
            backgroundColor: theme.palette.background.paper,
            border: `1px solid ${theme.palette.divider}`,
          }}
        />
        <Legend />
        <Line
          type="monotone"
          dataKey="value"
          stroke={theme.palette.primary.main}
          strokeWidth={2}
          dot={{ fill: theme.palette.primary.main, r: 4 }}
          activeDot={{ r: 6 }}
        />
        {data[0]?.value2 && (
          <Line
            type="monotone"
            dataKey="value2"
            stroke={theme.palette.secondary.main}
            strokeWidth={2}
            dot={{ fill: theme.palette.secondary.main, r: 4 }}
            activeDot={{ r: 6 }}
          />
        )}
      </LineChart>
    </ResponsiveContainer>
  );
}

export function AreaChartComponent({ data, height = 300, margin }: ChartProps) {
  const theme = useTheme();

  return (
    <ResponsiveContainer width="100%" height={height}>
      <AreaChart data={data} margin={margin || { top: 5, right: 20, bottom: 5, left: 0 }}>
        <defs>
          <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor={theme.palette.primary.main} stopOpacity={0.8} />
            <stop offset="95%" stopColor={theme.palette.primary.main} stopOpacity={0.1} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke={theme.palette.divider} />
        <XAxis stroke={theme.palette.text.secondary} style={{ fontSize: '0.875rem' }} />
        <YAxis stroke={theme.palette.text.secondary} style={{ fontSize: '0.875rem' }} />
        <Tooltip
          contentStyle={{
            backgroundColor: theme.palette.background.paper,
            border: `1px solid ${theme.palette.divider}`,
          }}
        />
        <Area
          type="monotone"
          dataKey="value"
          stroke={theme.palette.primary.main}
          fillOpacity={1}
          fill="url(#colorValue)"
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}

export function BarChartComponent({ data, height = 300, margin }: ChartProps) {
  const theme = useTheme();

  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart data={data} margin={margin || { top: 5, right: 20, bottom: 5, left: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke={theme.palette.divider} />
        <XAxis stroke={theme.palette.text.secondary} style={{ fontSize: '0.875rem' }} />
        <YAxis stroke={theme.palette.text.secondary} style={{ fontSize: '0.875rem' }} />
        <Tooltip
          contentStyle={{
            backgroundColor: theme.palette.background.paper,
            border: `1px solid ${theme.palette.divider}`,
          }}
        />
        <Legend />
        <Bar dataKey="entries" fill={theme.palette.success.main} />
        <Bar dataKey="exits" fill={theme.palette.warning.main} />
      </BarChart>
    </ResponsiveContainer>
  );
}
