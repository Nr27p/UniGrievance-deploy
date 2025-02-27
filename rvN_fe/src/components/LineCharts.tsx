import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const data = [
  {
    name: 'Jan',
    'Traffic Department': 4000,
    'Water Department': 2400,
    'Fire Department': 3200,
    'Police Department': 1400,
    'PWD Department': 2300
  },
  {
    name: 'Feb',
    'Traffic Department': 3000,
    'Water Department': 1398,
    'Fire Department': 2800,
    'Police Department': 980,
    'PWD Department': 4000
  },
  {
    name: 'Mar',
    'Traffic Department': 2000,
    'Water Department': 3000,
    'Fire Department': 1800,
    'Police Department': 3900,
    'PWD Department': 3100
  },
  {
    name: 'Apr',
    'Traffic Department': 2780,
    'Water Department': 3908,
    'Fire Department': 2000,
    'Police Department': 5000,
    'PWD Department': 1800
  },
  {
    name: 'May',
    'Traffic Department': 1890,
    'Water Department': 9000,
    'Fire Department': 4000,
    'Police Department': 1000,
    'PWD Department': 1500
  },
  {
    name: 'Jun',
    'Traffic Department': 2390,
    'Water Department': 3800,
    'Fire Department': 2800,
    'Police Department': 3400,
    'PWD Department': 3200
  }
];

const LineCharts = () => {
  const departments = Object.keys(data[0]).filter(key => key !== 'name');

  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart
        width={1000}
        height={300}
        data={data}
        margin={{
          top: 5,
          right: 30,
          left: 20,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" tick={{ fill: 'white' }} />
        <YAxis tick={{ fill: 'white' }} />
        <Tooltip />
        <Legend />
        {departments.map(department => (
          <Line key={department} type="monotone" dataKey={department} stroke={`#${Math.floor(Math.random()*16777215).toString(16)}`} name={department} />
        ))}
      </LineChart>
    </ResponsiveContainer>
  );
};

export default LineCharts;
