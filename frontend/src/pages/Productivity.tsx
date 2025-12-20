
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ScatterChart, Scatter, ZAxis } from 'recharts';
import { PERFORMANCE_DATA, SCATTER_PERFORMANCE } from '../mockData';

const Productivity: React.FC = () => {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div className="mb-6">
            <h3 className="text-lg font-bold text-slate-800">Productivity vs. Sleep Quality</h3>
            <p className="text-sm text-slate-500">Impact of restorative sleep on daily output</p>
          </div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={PERFORMANCE_DATA}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="sleepQuality" axisLine={false} tickLine={false} tick={{fill: '#64748b'}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b'}} />
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                />
                <Legend iconType="circle" />
                <Bar name="Productivity Score" dataKey="productivityScore" fill="#6366f1" radius={[4, 4, 0, 0]} />
                <Bar name="Burnout Score" dataKey="burnoutScore" fill="#fb7185" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div className="mb-6">
            <h3 className="text-lg font-bold text-slate-800">Meetings vs. Burnout</h3>
            <p className="text-sm text-slate-500">Correlation between virtual meeting load and stress</p>
          </div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis type="number" dataKey="meetings" name="Virtual Meetings" unit=" mtgs" axisLine={false} tickLine={false} />
                <YAxis type="number" dataKey="burnout" name="Burnout Risk" unit="%" axisLine={false} tickLine={false} />
                <ZAxis type="number" dataKey="productivity" range={[40, 400]} name="Productivity" />
                <Tooltip 
                  cursor={{ strokeDasharray: '3 3' }}
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                />
                <Scatter name="Employee Sample" data={SCATTER_PERFORMANCE} fill="#818cf8" fillOpacity={0.6} />
              </ScatterChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 bg-indigo-600 rounded-2xl text-white shadow-lg shadow-indigo-100">
          <h4 className="font-bold mb-2">Hypothesis Confirmed</h4>
          <p className="text-sm text-indigo-100 opacity-90">
            Employees with &gt;5 daily meetings show 45% higher burnout rates than their peers, regardless of work location.
          </p>
        </div>
        <div className="p-6 bg-white border border-slate-200 rounded-2xl">
          <h4 className="font-bold text-slate-800 mb-2">Sleep Factor</h4>
          <p className="text-sm text-slate-500">
            A shift from 'Fair' to 'Good' sleep results in a 31% increase in complex task completion rates.
          </p>
        </div>
        <div className="p-6 bg-white border border-slate-200 rounded-2xl">
          <h4 className="font-bold text-slate-800 mb-2">Recommendation</h4>
          <p className="text-sm text-slate-500">
            Implement 'No-Meeting Wednesdays' to alleviate zoom fatigue and improve deep work focus.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Productivity;
