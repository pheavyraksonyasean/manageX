"use client";

import { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface TasksByStatus {
  todo: number;
  inProgress: number;
  completed: number;
}

export function AdminBarChart() {
  const [chartData, setChartData] = useState([
    { name: "To Do", value: 0 },
    { name: "In Progress", value: 0 },
    { name: "Completed", value: 0 },
  ]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/admin/dashboard");
        if (!response.ok) throw new Error("Failed to fetch data");

        const data = await response.json();
        if (data.success) {
          setChartData([
            { name: "To Do", value: data.tasksByStatus.todo },
            { name: "In Progress", value: data.tasksByStatus.inProgress },
            { name: "Completed", value: data.tasksByStatus.completed },
          ]);
        }
      } catch (error) {
        console.error("Error fetching chart data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="border border-border rounded-xl p-6 bg-secondary/40 mb-8">
        <h3 className="text-lg font-semibold mb-6">Tasks by Status</h3>
        <div className="h-[300px] bg-secondary/20 animate-pulse rounded-lg" />
      </div>
    );
  }

  return (
    <div className="border border-border rounded-xl p-6 bg-secondary/40 mb-8">
      <h3 className="text-lg font-semibold mb-6">Tasks by Status</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={chartData}>
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
