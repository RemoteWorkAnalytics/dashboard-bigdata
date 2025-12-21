
import React, { useEffect, useState } from 'react';
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
} from 'recharts';

type ImpactData = {
  workLocation: string;
  totalEmployees: number;
  avgStress: number;
  overallWellbeing: number;
  remoteEffectiveness: number;
};

type CardProps = {
  title: string;
  value: number | string;
  color: string;
};

const StatCard: React.FC<CardProps> = ({ title, value, color }) => (
  <div className={`bg-white p-6 rounded-2xl border border-slate-200 shadow-sm`}>
    <h4 className={`text-sm font-medium text-${color}-600`}>{title}</h4>
    <p className="text-2xl font-bold text-slate-800">{value}</p>
  </div>
);

const COLORS = ['#6366f1', '#10b981', '#f59e0b'];

const WorkLocationDashboardd: React.FC = () => {
  const [data, setData] = useState<ImpactData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('http://localhost:5000/api/work-location-impact')
      .then(res => res.json())
      .then(result => {
        const formatted = result.map((d: any) => ({
          workLocation: d.workLocation,
          totalEmployees: Number(d.totalEmployees),
          avgStress: Number(d.avgStress),
          overallWellbeing: Number(d.overallWellbeing),
          remoteEffectiveness: Number(d.remoteEffectiveness)
        }));
        setData(formatted);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  if (loading)
    return (
      <div className="flex justify-center items-center h-64 text-slate-400">
        Loading data...
      </div>
    );

  const totalEmployees = data.reduce((acc, d) => acc + d.totalEmployees, 0);
  const avgStressOverall =
    data.reduce((acc, d) => acc + d.avgStress, 0) / data.length;
  const avgWellbeingOverall =
    data.reduce((acc, d) => acc + d.overallWellbeing, 0) / data.length;
  const avgEffectivenessOverall =
    data.reduce((acc, d) => acc + d.remoteEffectiveness, 0) / data.length;

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Total Employees" value={totalEmployees} color="indigo" />
        <StatCard title="Avg Stress" value={avgStressOverall.toFixed(2)} color="red" />
        <StatCard
          title="Overall Wellbeing"
          value={avgWellbeingOverall.toFixed(2)}
          color="green"
        />
        <StatCard
          title="Remote Effectiveness"
          value={avgEffectivenessOverall.toFixed(2)}
          color="blue"
        />
      </div>

      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <h3 className="text-lg font-bold text-slate-800 mb-4">Employees Distribution</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data.map(d => ({
                  name: d.workLocation,
                  value: d.totalEmployees
                }))}
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <p className="mt-2 text-sm text-slate-500 text-center">
          Total employees distributed by work location
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <BarChartCard
          data={data}
          dataKey="avgStress"
          title="Average Stress"
          color="#ef4444"
        />
        <BarChartCard
          data={data}
          dataKey="overallWellbeing"
          title="Overall Wellbeing"
          color="#10b981"
        />
        <BarChartCard
          data={data}
          dataKey="remoteEffectiveness"
          title="Remote Effectiveness"
          color="#6366f1"
        />

      </div>
    </div>
  );
};


type BarChartCardProps = {
  data: ImpactData[];
  dataKey: keyof ImpactData;
  title: string;
  color: string;
};

const BarChartCard: React.FC<BarChartCardProps> = ({ data, dataKey, title, color }) => (
  <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
    <h3 className="text-lg font-bold text-slate-800 mb-4">{title}</h3>
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis dataKey="workLocation" axisLine={false} tickLine={false} />
          <YAxis />
          <Tooltip />
          <Bar dataKey={dataKey} fill={color} radius={[6, 6, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
    <p className="mt-2 text-sm text-slate-500 text-center">
      {title} by work location
    </p>
  </div>
);

export default WorkLocationDashboardd;