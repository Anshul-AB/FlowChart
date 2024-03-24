import React from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Label } from "recharts";

const Info = () => {
  // Dummy data for the pie chart
  const pieChartData = [
    { name: "Category A", value: 400 },
    { name: "Category B", value: 300 },
    { name: "Category C", value: 300 },
    { name: "Category D", value: 200 },
  ];

  return (
    <div className="info-chart">
      <h4>Pie Chart</h4>
      <ResponsiveContainer width="100%" height={160}>
        <PieChart>
          <Pie
            data={pieChartData}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
            Label
          >
            {pieChartData.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={`#${Math.floor(Math.random() * 16777215).toString(16)}`}
              />
            ))}
            <Label valueKey={pieChartData.name} position="inside" />
          </Pie>
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default Info;
