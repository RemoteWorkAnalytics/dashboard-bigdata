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
import { RefreshCw, Database, Activity, MapPin, TrendingUp } from 'lucide-react';

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
          { label: 'Increase', estimate: raw.prod_increased || 0, color: '#10b981' },
          { label: 'Decrease', estimate: raw.prod_decreased || 0, color: '#ef4444' },
          { label: 'No Change', estimate: raw.prod_stayed_same || 0, color: '#6366f1' },
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
      console.error("API Fetch Error:", err);
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
      <div className="flex flex-col items-center justify-center min-h-[400px] text-slate-500">
        <Activity className="animate-spin mb-4" size={48} />
        <p className="text-lg font-medium">Connecting to Spark Real-Time Engine...</p>
      </div>
    );
  }

  const totalEmployees = data.stressLevels.reduce((acc, curr) => acc + curr.estimate, 0);

  return (
    <div className="p-6 space-y-8 bg-slate-50 min-h-screen font-sans">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center bg-white p-6 rounded-2xl border border-slate-200 shadow-sm gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-3">
            <Database className="text-indigo-600" size={28} />
            Employee Analytics Dashboard
          </h2>
          <p className="text-slate-500">Real-time Count-Min Sketch Estimates from MongoDB</p>
        </div>

        <div className="flex items-center gap-4 bg-slate-50 p-3 rounded-xl border border-slate-100">
          <div className="flex items-center gap-2 px-3 border-r border-slate-200">
            <div className={`w-3 h-3 rounded-full ${isLive ? 'bg-emerald-500 animate-pulse' : 'bg-slate-300'}`} />
            <span className="text-sm font-bold text-slate-700">{isLive ? 'LIVE' : 'PAUSED'}</span>
          </div>
          <div className="flex items-center gap-2 px-3 text-sm font-semibold text-slate-600">
            <RefreshCw size={16} className={isLive ? 'animate-spin' : ''} />
            Next Sync: {countdown}s
          </div>
          <button
            onClick={() => setIsLive(!isLive)}
            className={`px-5 py-2 rounded-lg text-sm font-bold transition-all shadow-sm ${
              isLive ? 'bg-rose-50 text-rose-600 hover:bg-rose-100' : 'bg-indigo-600 text-white hover:bg-indigo-700'
            }`}
          >
            {isLive ? 'Stop Polling' : 'Start Polling'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Total Estimates</p>
          <h3 className="text-4xl font-black text-slate-900">{totalEmployees.toLocaleString()}</h3>
          <p className="text-xs text-slate-500 mt-2 italic">Based on CMS probability hashing</p>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Last Data Sync</p>
          <div className="flex items-center gap-2 text-indigo-600 mt-2">
             <Activity size={18} />
             <span className="text-sm font-bold">{data.lastUpdated}</span>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">On-site Presence</p>
          <h3 className="text-4xl font-black text-rose-500">{data.locations[1].estimate.toLocaleString()}</h3>
          <p className="text-xs text-slate-500 mt-2">Current office capacity estimate</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center gap-2 mb-6">
            <TrendingUp className="text-indigo-500" />
            <h3 className="text-lg font-bold text-slate-800">Stress Level Estimates</h3>
          </div>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.stressLevels} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                <XAxis type="number" hide />
                <YAxis dataKey="label" type="category" width={80} tick={{fill: '#64748b', fontWeight: 'bold'}} />
                <Tooltip 
                  cursor={{fill: '#f8fafc'}}
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                />
                <Bar dataKey="estimate" barSize={40} radius={[0, 8, 8, 0]}>
                  {data.stressLevels.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center gap-2 mb-6">
            <MapPin className="text-indigo-500" />
            <h3 className="text-lg font-bold text-slate-800">Work Location Distribution</h3>
          </div>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data.locations.map(l => ({ name: l.label, value: l.estimate }))}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={70}
                  outerRadius={100}
                  paddingAngle={5}
                >
                  {data.locations.map((entry, index) => (
                    <Cell key={`cell-loc-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend iconType="circle" wrapperStyle={{paddingTop: '20px'}} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm lg:col-span-2">
          <h3 className="text-lg font-bold text-slate-800 mb-6">Productivity Changes (Estimates)</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.productivityChanges}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="label" tick={{fill: '#64748b', fontWeight: 'bold'}} />
                <YAxis tick={{fill: '#64748b'}} />
                <Tooltip />
                <Bar dataKey="estimate" radius={[8, 8, 0, 0]} barSize={60}>
                  {data.productivityChanges.map((entry, index) => (
                    <Cell key={`cell-prod-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>
    </div>
  );
};

export default RealTimeStats;