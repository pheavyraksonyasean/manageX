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
  PieChart,
  Pie,
  Cell,
} from "recharts";

export function ChartsSection() {
  const [barChartData, setBarChartData] = useState([
    { name: "High", value: 0 },
    { name: "Medium", value: 0 },
    { name: "Low", value: 0 },
  ]);
  const [pieChartData, setPieChartData] = useState([
    { name: "To Do", value: 0, color: "#77ABAE" },
    { name: "In Progress", value: 0, color: "#31363F" },
    { name: "Completed", value: 0, color: "#77ABAE" },
  ]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchChartData();
  }, []);

  const fetchChartData = async () => {
    try {
      const response = await fetch("/api/user/dashboard/stats");
      const data = await response.json();

      if (response.ok) {
        // Update bar chart data (priority)
        setBarChartData([
          { name: "High", value: data.priorityStats.high },
          { name: "Medium", value: data.priorityStats.medium },
          { name: "Low", value: data.priorityStats.low },
        ]);

        // Update pie chart data (status)
        setPieChartData([
          { name: "To Do", value: data.statusStats.todo, color: "#77ABAE" },
          {
            name: "In Progress",
            value: data.statusStats.inProgress,
            color: "#FFC107",
          },
          {
            name: "Completed",
            value: data.statusStats.completed,
            color: "#4CAF50",
          },
        ]);
      } else {
        console.error("Failed to fetch chart data:", data.error);
      }
    } catch (error) {
      console.error("Error fetching chart data:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {[...Array(2)].map((_, i) => (
          <div
            key={i}
            className="border border-border rounded-xl p-6 bg-secondary/40 animate-pulse"
          >
            <div className="h-80"></div>
          </div>
        ))}
      </div>
    );
  }

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

      {/* Pie Chart */}
      <div className="border border-border rounded-xl p-6 bg-secondary/40">
        <h3 className="text-lg font-semibold mb-6">Tasks by status</h3>
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
                backgroundColor: "#31363F",
                border: "1px solid #77ABAE",
                borderRadius: "8px",
                boxShadow: "0 4px 12px rgba(0, 0, 0, 0.3)",
              }}
              labelStyle={{ color: "#77ABAE", fontWeight: 600 }}
              itemStyle={{ color: "#EEEEEE" }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
