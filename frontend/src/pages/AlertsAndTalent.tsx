import React, { useState, useEffect } from 'react';
import { BellRing, AlertCircle, ShieldAlert } from 'lucide-react';

/* =======================
   Data Model
======================= */
interface BurnoutAlert {
  _id: string; // department as _id
  department: string;
  avgStress: number;
  employeeCount: number;
  lastUpdated: string;
  recommendation: string;
}

/* =======================
   Component
======================= */
const BurnoutDashboard: React.FC = () => {
  const [alerts, setAlerts] = useState<BurnoutAlert[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchAlerts = () => {
    fetch('http://localhost:5000/api/alerts')  
      .then(res => res.json())
      .then(data => {
        setAlerts(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  useEffect(() => {
    fetchAlerts();
    const interval = setInterval(fetchAlerts, 10000);  
    return () => clearInterval(interval);
  }, []);

  const formatTime = (iso: string) =>
    new Date(iso).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  return (
    <div className="max-w-6xl mx-auto space-y-6 py-6">

      {/* ===== Header ===== */}
      <div className="bg-rose-600 rounded-2xl p-8 text-white shadow-lg">
        <div className="flex items-center gap-3 mb-2">
          <BellRing size={20} />
          <span className="text-xs font-bold tracking-widest uppercase opacity-80">
            Real-Time Monitoring
          </span>
        </div>
        <h2 className="text-3xl font-black mb-2">
          Department Burnout Alerts
        </h2>
        <p className="text-rose-100 text-sm max-w-2xl">
          Continuous stress analysis using Spark Structured Streaming.
          Alerts are generated when sustained stress patterns exceed safe thresholds.
        </p>
      </div>

      {/* ===== Alerts Section ===== */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-xl font-black text-slate-800">
            Active Alerts
          </h3>
          <span className="text-xs font-bold bg-rose-100 text-rose-600 px-3 py-1 rounded-lg">
            {alerts.length} detected
          </span>
        </div>

        {/* ===== Content ===== */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {loading ? (
            <div className="col-span-full bg-white rounded-xl p-12 text-center">
              <div className="animate-spin w-6 h-6 border-4 border-rose-600 border-t-transparent rounded-full mx-auto mb-3"></div>
              <p className="text-sm text-slate-400 font-medium">
                Loading streaming insights...
              </p>
            </div>
          ) : alerts.length === 0 ? (
            <div className="col-span-full bg-white rounded-xl p-12 text-center">
              <AlertCircle size={36} className="mx-auto text-slate-300 mb-3" />
              <p className="text-slate-500 font-medium">
                No burnout risks detected
              </p>
              <p className="text-xs text-slate-400">
                All departments are currently within normal stress levels.
              </p>
            </div>
          ) : (
            alerts.map(alert => (
              <div
                key={alert._id}
                className={`bg-white rounded-xl p-6 border-l-4 shadow-sm ${
                  alert.avgStress > 2 ? 'border-rose-500' : 'border-amber-400'
                }`}
              >
                {/* Meta */}
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <p className="text-xs font-bold uppercase text-slate-400">
                      Burnout Alert
                    </p>
                    <p className="text-xs text-slate-400">
                      {formatTime(alert.lastUpdated)}
                    </p>
                  </div>
                  <ShieldAlert
                    size={20}
                    className={alert.avgStress > 2 ? 'text-rose-500' : 'text-amber-400'}
                  />
                </div>

                {/* Department */}
                <h4 className="text-lg font-black text-slate-800 mb-2">
                  {alert.department}
                </h4>

                {/* Insight */}
                <p className="text-sm text-slate-600 leading-relaxed mb-4">
                  Sustained moderate-to-high stress detected
                  (average score{' '}
                  <span className="font-bold text-rose-600">
                    {alert.avgStress.toFixed(2)}
                  </span>{' '}
                  / 3) across{' '}
                  <span className="font-bold text-slate-800">
                    {alert.employeeCount}
                  </span>{' '}
                  employees in this department.
                </p>

                {/* Recommendation */}
                <div className="bg-slate-50 rounded-lg p-4">
                  <p className="text-xs uppercase font-bold text-slate-400 mb-1">
                    Recommended Action
                  </p>
                  <p className="text-sm font-medium text-slate-700">
                    {alert.recommendation}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* ===== Footer ===== */}
      <div className="text-center text-xs text-slate-400 pt-4">
        Streaming Source: Kafka • Processing: Spark • Storage: MongoDB
      </div>
    </div>
  );
};

export default BurnoutDashboard;
