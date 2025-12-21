import React, { useEffect, useState } from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell
} from "recharts";

/* =========================
   Types
   ========================= */
type ImpactData = {
  workLocation: string;
  totalEmployees: number;
  avgStress: number;
  overallWellbeing: number;
  remoteEffectiveness: number;
};

/* =========================
   Card
   ========================= */
const StatCard = ({ title, value }: { title: string; value: number | string }) => (
  <div className="bg-white p-6 rounded-xl border shadow-sm">
    <h4 className="text-sm text-slate-500">{title}</h4>
    <p className="text-2xl font-bold mt-1">{value}</p>
  </div>
);

const COLORS = ["#6366f1", "#10b981", "#f59e0b"];

/* =========================
   Component
   ========================= */
const WorkLocationImpact: React.FC = () => {
  const [data, setData] = useState<ImpactData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:5000/api/work-location-impact")
      .then(res => res.json())
      .then(result => {
        setData(
          result.map((d: any) => ({
            workLocation: d.workLocation,
            totalEmployees: Number(d.totalEmployees),
            avgStress: Number(d.avgStress),
            overallWellbeing: Number(d.overallWellbeing),
            remoteEffectiveness: Number(d.remoteEffectiveness)
          }))
        );
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) return <div>Loading...</div>;

  const totalEmployees = data.reduce((s, d) => s + d.totalEmployees, 0);

  return (
    <div className="space-y-8">

      {/* Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatCard title="Total Employees" value={totalEmployees} />
        <StatCard
          title="Avg Stress"
          value={(data.reduce((s, d) => s + d.avgStress, 0) / data.length).toFixed(2)}
        />
        <StatCard
          title="Wellbeing"
          value={(data.reduce((s, d) => s + d.overallWellbeing, 0) / data.length).toFixed(2)}
        />
        <StatCard
          title="Effectiveness"
          value={(data.reduce((s, d) => s + d.remoteEffectiveness, 0) / data.length).toFixed(2)}
        />
      </div>

      {/* Pie Chart */}
      <div className="bg-white p-6 rounded-xl border h-80">
        <ResponsiveContainer>
          <PieChart>
            <Pie
              data={data}
              dataKey="totalEmployees"
              nameKey="workLocation"
              outerRadius={90}
            >
              {data.map((_, i) => (
                <Cell key={i} fill={COLORS[i % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Bar Chart */}
      <div className="bg-white p-6 rounded-xl border h-80">
        <ResponsiveContainer>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="workLocation" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="avgStress" fill="#ef4444" />
            <Bar dataKey="overallWellbeing" fill="#10b981" />
            <Bar dataKey="remoteEffectiveness" fill="#6366f1" />
          </BarChart>
        </ResponsiveContainer>
      </div>

    </div>
  );
};

export default WorkLocationImpact;
