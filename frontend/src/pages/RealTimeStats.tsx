import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  BarChart,
  Bar,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Legend,
} from 'recharts';
import { RefreshCw, Database, Activity } from 'lucide-react';
 
interface FormattedData {
  stressLevels: { label: string; estimate: number; color: string }[];
  productivityChanges: { label: string; estimate: number; color: string }[];
  locations: { label: string; estimate: number; color: string }[];
  lastUpdated: string;
}

const RealTimeStats: React.FC = () => {
  const [data, setData] = useState<FormattedData | null>(null);
  const [isLive, setIsLive] = useState(true);
  const [countdown, setCountdown] = useState(10);

 
  const fetchRealTimeData = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/stats');
      const raw = response.data;
 
      const formatted: FormattedData = {
        stressLevels: [
          { label: 'High', estimate: raw.stress_high || 0, color: '#ef4444' },
          { label: 'Medium', estimate: raw.stress_medium || 0, color: '#f59e0b' },
          { label: 'Low', estimate: raw.stress_low || 0, color: '#10b981' },
        ],
        productivityChanges: [
          { label: 'Increased', estimate: raw.prod_increased || 0, color: '#10b981' },
          { label: 'Decreased', estimate: raw.prod_decreased || 0, color: '#ef4444' },
          { label: 'Same', estimate: raw.prod_stayed_same || 0, color: '#6366f1' },
        ],
        locations: [
          { label: 'Remote', estimate: raw.work_remote || 0, color: '#6366f1' },
          { label: 'On-site', estimate: raw.work_onsite || 0, color: '#f43f5e' },
          { label: 'Hybrid', estimate: raw.work_hybrid || 0, color: '#8b5cf6' },
        ],
        lastUpdated: raw.lastUpdated || 'N/A'
      };
      setData(formatted);
    } catch (err) {
      console.error("❌ Error fetching from API:", err);
    }
  };

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;

    if (isLive) {
     
      fetchRealTimeData();

      interval = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            fetchRealTimeData(); 
            return 10;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [isLive]);

  if (!data) {
    return (
      <div className="flex items-center justify-center h-64 text-slate-500 font-medium">
        <Activity className="animate-spin mr-2" />  
      </div>
    );
  }

  const totalStressEstimate = data.stressLevels.reduce((acc, curr) => acc + curr.estimate, 0);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center bg-white p-6 rounded-2xl border border-slate-200 shadow-sm gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <Database className="text-indigo-600" size={24} />
            Real-Time Employee Analytics (CMS)
          </h2>
          <p className="text-sm text-slate-500">Live Estimates from Spark Streaming & MongoDB</p>
        </div>

        <div className="flex items-center gap-4 bg-slate-50 p-2 rounded-xl border border-slate-100">
          <div className="flex items-center gap-2 px-3 border-r border-slate-200">
            <div className={`w-3 h-3 rounded-full ${isLive ? 'bg-emerald-500 animate-pulse' : 'bg-slate-300'}`} />
            <span className="text-sm font-semibold text-slate-700">{isLive ? 'Live Feed' : 'Paused'}</span>
          </div>
          <div className="flex items-center gap-2 px-3 text-sm font-medium text-slate-600">
            <RefreshCw size={16} className={isLive ? 'animate-spin' : ''} />
            Sync in: {countdown}s
          </div>
          <button
            onClick={() => setIsLive(!isLive)}
            className={`px-4 py-1.5 rounded-lg text-sm font-bold transition-all ${isLive ? 'bg-rose-50 text-rose-600 hover:bg-rose-100' : 'bg-indigo-600 text-white hover:bg-indigo-700'}`}
          >
            {isLive ? 'Stop Polling' : 'Start Polling'}
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl border shadow-sm">
          <p className="text-xs font-bold text-slate-400 uppercase mb-1">Total Estimated Count</p>
          <h3 className="text-3xl font-black text-slate-900">{totalStressEstimate.toLocaleString()}</h3>
          <div className="mt-2 flex items-center gap-1 text-emerald-600 text-xs font-bold">
            <Activity size={14} /> Last Update: {data.lastUpdated}
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border shadow-sm">
          <p className="text-xs font-bold text-slate-400 uppercase mb-1">Onsite/Hybrid Presence</p>
          <h3 className="text-3xl font-black text-indigo-600">
            {(data.locations[1].estimate + data.locations[2].estimate).toLocaleString()}
          </h3>
        </div>

        <div className="bg-white p-6 rounded-2xl border shadow-sm">
          <p className="text-xs font-bold text-slate-400 uppercase mb-1">Productivity Uplift (Increased)</p>
          <h3 className="text-3xl font-black text-emerald-600">{data.productivityChanges[0].estimate.toLocaleString()}</h3>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Stress Levels Bar Chart */}
        <div className="bg-white p-6 rounded-2xl border shadow-sm">
          <h3 className="text-lg font-bold mb-4">Stress Level Estimates</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.stressLevels} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                <XAxis type="number" hide />
                <YAxis dataKey="label" type="category" width={100} />
                <Tooltip formatter={(value) => [value, 'Count']} />
                <Bar dataKey="estimate" barSize={36}>
                  {data.stressLevels.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Productivity Bar Chart */}
        <div className="bg-white p-6 rounded-2xl border shadow-sm">
          <h3 className="text-lg font-bold mb-4">Productivity Changes</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.productivityChanges}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="label" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="estimate">
                  {data.productivityChanges.map((entry, index) => (
                    <Cell key={`cell-prod-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Location Pie Chart */}
        <div className="bg-white p-6 rounded-2xl border shadow-sm lg:col-span-2">
          <h3 className="text-lg font-bold mb-4">Work Location Distribution</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data.locations.map(l => ({ name: l.label, value: l.estimate, color: l.color }))}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={90}
                  label
                >
                  {data.locations.map((entry, index) => (
                    <Cell key={`cell-loc-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RealTimeStats;