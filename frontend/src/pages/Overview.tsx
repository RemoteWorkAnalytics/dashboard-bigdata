
import React from 'react';
import { Users, Heart, Zap, AlertCircle } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import DashboardCard from '../component/DashboardCard';
import { OVERVIEW_STATS, TREND_DATA } from '../mockData';

const COLORS = ['#6366f1', '#10b981', '#f59e0b'];

const Overview: React.FC = () => {
  const distributionData = [
    { name: 'Remote', value: TREND_DATA[6].remoteEmployees },
    { name: 'Hybrid', value: TREND_DATA[6].hybridEmployees },
    { name: 'Onsite', value: TREND_DATA[6].onsiteEmployees },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <DashboardCard 
          title="Total Employees" 
          value={OVERVIEW_STATS.totalEmployees} 
          icon={Users} 
          trend="+12% vs last mo" 
          trendType="up"
          color="indigo"
        />
        <DashboardCard 
          title="Mental Health Score" 
          value={`${OVERVIEW_STATS.avgMentalHealth}/10`} 
          icon={Heart} 
          trend="+0.4 pts" 
          trendType="up"
          color="emerald"
        />
        <DashboardCard 
          title="Avg Productivity" 
          value={`${OVERVIEW_STATS.avgProductivity}/10`} 
          icon={Zap} 
          trend="-2% vs last wk" 
          trendType="down"
          color="amber"
        />
        <DashboardCard 
          title="High Burnout Risk" 
          value={OVERVIEW_STATS.burnoutRiskCount} 
          icon={AlertCircle} 
          trend="+5 reports today" 
          trendType="down"
          color="rose"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <h3 className="text-lg font-bold text-slate-800 mb-6">Work Mode Distribution</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={distributionData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {distributionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                />
                <Legend iconType="circle" />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <p className="mt-4 text-sm text-slate-500 text-center leading-relaxed">
            The company remains <strong>mostly remote (51%)</strong>. Hybrid model adoption is growing steadily at 5% month-over-month.
          </p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <h3 className="text-lg font-bold text-slate-800 mb-6">Productivity Snapshot</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={TREND_DATA}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                <YAxis hide />
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                  cursor={{fill: '#f8fafc'}}
                />
                <Bar dataKey="productivity" fill="#6366f1" radius={[4, 4, 0, 0]} barSize={30} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="flex items-center gap-3 p-4 bg-emerald-50 rounded-xl mt-4 border border-emerald-100">
            <Zap className="text-emerald-600" size={20} />
            <p className="text-sm text-emerald-800">
              Productivity peaked on Dec 21st, coinciding with the launch of Flexible Fridays.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Overview;
