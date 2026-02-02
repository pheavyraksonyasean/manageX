"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const barChartData = [
  { name: "To Do", value: 0.5 },
  { name: "In Progress", value: 2 },
  { name: "Completed", value: 1 },
];

export function AdminBarChart() {
  return (
    <div className="border border-border rounded-xl p-6 bg-secondary/40 mb-8">
      <h3 className="text-lg font-semibold mb-6">Tasks by priorities</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={barChartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#31363F" />
          <XAxis dataKey="name" stroke="#EEEEEE" />
          <YAxis stroke="#EEEEEE" />
          <Tooltip
            contentStyle={{
              backgroundColor: "#31363F",
              border: "1px solid #77ABAE",
              borderRadius: "8px",
              boxShadow: "0 4px 12px rgba(0, 0, 0, 0.3)",
            }}
            labelStyle={{ color: "#77ABAE", fontWeight: 600 }}
            itemStyle={{ color: "#EEEEEE" }}
            cursor={{ fill: "rgba(119, 171, 174, 0.1)" }}
          />
          <Bar dataKey="value" fill="#77ABAE" radius={[8, 8, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
