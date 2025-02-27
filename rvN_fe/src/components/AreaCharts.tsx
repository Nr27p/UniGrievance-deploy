import React from 'react';
import { AreaChart, Area, ResponsiveContainer, YAxis, XAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

const productdata = [
  {
    name: 'Jan',
    thisYear: 4000, // This year's data
    previousYear: 2400, // Previous year's data
  },
  {
    name: 'Feb',
    thisYear: 3000,
    previousYear: 2210,
  },
  {
    name: 'Mar',
    thisYear: 2000,
    previousYear: 2290,
  },
  {
    name: 'Apr',
    thisYear: 2780,
    previousYear: 2000,
  },
  {
    name: 'May',
    thisYear: 1890,
    previousYear: 2181,
  },
  {
    name: 'Jun',
    thisYear: 2390,
    previousYear: 2500,
  },
];

const AreaCharts = ({data}) => {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart
        width={400}
        height={300}
        data={productdata}
        margin={{ right: 30 }}
      >
        <YAxis tick={{ fill: 'white' }} />
        <XAxis dataKey="name" tick={{ fill: 'white' }} />
        <CartesianGrid strokeDasharray="5 5" />
        <Tooltip />
        <Legend />

        <Area
          type="monotone"
          dataKey="thisYear" // Use thisYear for the current year's data
          stroke="#2563eb"
          fill="#3b82f6"
          stackId="1"
        />

        <Area
          type="monotone"
          dataKey="previousYear" // Use previousYear for the previous year's data
          stroke="#7c3aed"
          fill="#8b5cf6"
          stackId="1"
        />
      </AreaChart>
    </ResponsiveContainer>
  );
};

export default AreaCharts;
