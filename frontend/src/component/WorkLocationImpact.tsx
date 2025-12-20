import React, { useEffect, useState } from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from 'recharts';

type ImpactData = {
  workLocation: string;
  avgStress: number;
  overallWellbeing: number;
  remoteEffectiveness: number;
};

const WorkLocationImpact: React.FC = () => {
  const [data, setData] = useState<ImpactData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('http://localhost:5000/api/work-location-impact')
      .then(res => res.json())
      .then(result => {
        setData(result);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
      <h3 className="text-lg font-bold text-slate-800 mb-6">
        Work Location Impact
      </h3>

      <div className="h-80">
        {loading ? (
          <div className="h-full flex items-center justify-center text-slate-400">
            Loading analytics...
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis
                dataKey="workLocation"
                axisLine={false}
                tickLine={false}
              />
              <YAxis />
              <Tooltip />
              <Legend />

              <Bar
                dataKey="avgStress"
                name="Avg Stress"
                fill="#ef4444"
                radius={[6, 6, 0, 0]}
              />
              <Bar
                dataKey="overallWellbeing"
                name="Wellbeing"
                fill="#10b981"
                radius={[6, 6, 0, 0]}
              />
              <Bar
                dataKey="remoteEffectiveness"
                name="Effectiveness"
                fill="#6366f1"
                radius={[6, 6, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>

      <p className="mt-4 text-sm text-slate-500 text-center">
        Aggregated from Kafka → Spark Streaming → MongoDB
      </p>
    </div>
  );
};

export default WorkLocationImpact;
