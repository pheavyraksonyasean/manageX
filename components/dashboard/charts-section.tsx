"use client";

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
} from "recharts";

const barChartData = [
  { name: "High", value: 2 },
  { name: "Medium", value: 1 },
  { name: "Low", value: 1 },
];

const pieChartData = [
  { name: "To Do", value: 2, color: "#77ABAE" },
  { name: "In Progress", value: 1, color: "#31363F" },
  { name: "Completed", value: 1, color: "#77ABAE" },
];

export function ChartsSection() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
      {/* Bar Chart */}
      <div className="border border-border rounded-xl p-6 bg-secondary/40">
        <h3 className="text-lg font-semibold mb-6">Tasks by priorities</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={barChartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#31363F" />
            <XAxis dataKey="name" stroke="#EEEEEE" />
            <YAxis stroke="#EEEEEE" />
            <Tooltip
              contentStyle={{
                backgroundColor: "#222831",
                border: "1px solid #31363F",
                borderRadius: "8px",
              }}
              labelStyle={{ color: "#EEEEEE" }}
            />
            <Bar dataKey="value" fill="#77ABAE" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Pie Chart */}
      <div className="border border-border rounded-xl p-6 bg-secondary/40">
        <h3 className="text-lg font-semibold mb-6">Tasks by priorities</h3>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={pieChartData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, value }) => `${name}: ${value}`}
              outerRadius={80}
              fill="#77ABAE"
              dataKey="value"
            >
              {pieChartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: "#222831",
                border: "1px solid #31363F",
                borderRadius: "8px",
              }}
              labelStyle={{ color: "#EEEEEE" }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
