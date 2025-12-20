
import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Cell } from 'recharts';
import { TREND_DATA, STRESS_BY_LOCATION } from '../mockData';

const COLORS = ['#818cf8', '#6366f1', '#4f46e5'];

const MentalHealth: React.FC = () => {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="text-lg font-bold text-slate-800">Daily Stress Trends</h3>
              <p className="text-sm text-slate-500">Historical burnout risk reports (last 7 days)</p>
            </div>
            <div className="flex gap-2">
              <span className="flex items-center gap-1 text-xs text-slate-500">
                <div className="w-2 h-2 rounded-full bg-indigo-500" />
                Reports
              </span>
            </div>
          </div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={TREND_DATA}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis 
                  dataKey="date" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{fill: '#64748b', fontSize: 12}} 
                  dy={10}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{fill: '#64748b', fontSize: 12}}
                />
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                />
                <Line 
                  type="monotone" 
                  dataKey="highStressCount" 
                  stroke="#6366f1" 
                  strokeWidth={4} 
                  dot={{r: 4, strokeWidth: 2, fill: '#fff'}}
                  activeDot={{r: 6, strokeWidth: 0}}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <h3 className="text-lg font-bold text-slate-800 mb-6">Stress by Location</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={STRESS_BY_LOCATION} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                <XAxis type="number" hide />
                <YAxis 
                  dataKey="location" 
                  type="category" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{fill: '#1e293b', fontWeight: 500}} 
                  width={80}
                />
                <Tooltip 
                  cursor={{fill: 'transparent'}}
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                />
                <Bar dataKey="stressScore" barSize={32} radius={[0, 8, 8, 0]}>
                  {STRESS_BY_LOCATION.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="p-4 bg-slate-50 rounded-xl mt-4 border border-slate-100">
            <p className="text-xs text-slate-600 leading-relaxed italic">
              "Remote work shows significantly lower stress scores, but higher isolation keywords in NLP analysis."
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
        <h3 className="text-lg font-bold text-slate-800 mb-6 text-center">Trending Sentiment Keywords</h3>
        <div className="flex flex-wrap justify-center gap-4">
          {[
            { word: 'Isolation', size: 'text-4xl', color: 'text-indigo-600' },
            { word: 'Deadlines', size: 'text-5xl', color: 'text-rose-500 font-bold' },
            { word: 'Flexible', size: 'text-3xl', color: 'text-emerald-500' },
            { word: 'Meetings', size: 'text-4xl', color: 'text-amber-500' },
            { word: 'Work-life', size: 'text-2xl', color: 'text-slate-400' },
            { word: 'Growth', size: 'text-3xl', color: 'text-indigo-400' },
            { word: 'Burnout', size: 'text-5xl', color: 'text-rose-600 font-extrabold' },
            { word: 'Async', size: 'text-2xl', color: 'text-slate-500' },
          ].map((item, idx) => (
            <span key={idx} className={`${item.size} ${item.color} transition-transform hover:scale-110 cursor-default p-2`}>
              {item.word}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MentalHealth;
