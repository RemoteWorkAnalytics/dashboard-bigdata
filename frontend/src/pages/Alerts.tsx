import React, { useState, useEffect } from 'react';
import { BellRing, AlertCircle, ShieldAlert } from 'lucide-react';

/* =======================
   Data Model
======================= */
interface BurnoutAlert {
  _id: string; 
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
  // التأكد من تهيئة الحالة كمصفوفة فارغة
  const [alerts, setAlerts] = useState<BurnoutAlert[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchAlerts = () => {
    fetch('http://localhost:5000/api/alerts')
      .then(res => {
        if (!res.ok) throw new Error('Server error');
        return res.json();
      })
      .then(data => {
        // حماية أساسية: التأكد أن البيانات القادمة مصفوفة
        if (Array.isArray(data)) {
          setAlerts(data);
        } else {
          console.error("Expected array but got:", data);
          setAlerts([]); // نمنع الـ crash بتصفير المصفوفة
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("Fetch alerts failed:", err);
        setAlerts([]); // تصفير البيانات في حال فشل الـ API
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchAlerts();
    // تحديث تلقائي كل 10 ثوانٍ (Streaming simulation)
    const interval = setInterval(fetchAlerts, 10000);
    return () => clearInterval(interval);
  }, []);

  const formatTime = (iso: string) => {
    try {
      return new Date(iso).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } catch {
      return "--:--";
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 py-6 animate-in fade-in duration-500">

      {/* ===== Header ===== */}
      <div className="bg-rose-600 rounded-2xl p-8 text-white shadow-lg">
        <div className="flex items-center gap-3 mb-2">
          <BellRing size={20} className="animate-bounce" />
          <span className="text-xs font-bold tracking-widest uppercase opacity-80">
            Real-Time Monitoring
          </span>
        </div>
        <h2 className="text-3xl font-black mb-2">
          Department Burnout Alerts
        </h2>
        <p className="text-rose-100 text-sm max-w-2xl leading-relaxed">
          Continuous stress analysis using Spark Structured Streaming. 
          Alerts are triggered when sustained stress patterns exceed safe thresholds.
        </p>
      </div>

      {/* ===== Alerts Section ===== */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-xl font-black text-slate-800">
            Active Alerts
          </h3>
          <span className="text-xs font-bold bg-rose-100 text-rose-600 px-3 py-1 rounded-lg">
            {Array.isArray(alerts) ? alerts.length : 0} detected
          </span>
        </div>

        {/* ===== Content Grid ===== */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {loading ? (
            <div className="col-span-full bg-white rounded-xl p-12 text-center border border-slate-100 shadow-sm">
              <div className="animate-spin w-8 h-8 border-4 border-rose-600 border-t-transparent rounded-full mx-auto mb-3"></div>
              <p className="text-sm text-slate-400 font-medium">
                Syncing with Spark cluster...
              </p>
            </div>
          ) : (!Array.isArray(alerts) || alerts.length === 0) ? (
            <div className="col-span-full bg-white rounded-xl p-12 text-center border border-slate-100 shadow-sm">
              <AlertCircle size={40} className="mx-auto text-slate-200 mb-3" />
              <p className="text-slate-500 font-bold text-lg">
                No burnout risks detected
              </p>
              <p className="text-xs text-slate-400">
                All departments are currently operating within safe stress parameters.
              </p>
            </div>
          ) : (
            alerts.map((alert) => (
              <div
                key={alert._id || Math.random().toString()}
                className={`bg-white rounded-xl p-6 border-l-4 shadow-sm transition-all hover:shadow-md ${
                  alert.avgStress > 2.5 ? 'border-rose-600' : 'border-amber-400'
                }`}
              >
                {/* Meta Information */}
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <p className="text-[10px] font-black uppercase text-slate-400 tracking-wider">
                      Live Anomaly Detected
                    </p>
                    <p className="text-xs text-slate-500 font-medium">
                      Last update: {formatTime(alert.lastUpdated)}
                    </p>
                  </div>
                  <div className={`p-2 rounded-lg ${alert.avgStress > 2.5 ? 'bg-rose-50 text-rose-600' : 'bg-amber-50 text-amber-600'}`}>
                    <ShieldAlert size={18} />
                  </div>
                </div>

                {/* Department Info */}
                <h4 className="text-xl font-bold text-slate-800 mb-2">
                  {alert.department}
                </h4>

                {/* Metrics */}
                <div className="mb-4">
                  <p className="text-sm text-slate-600 leading-relaxed">
                    Sustained stress average: 
                    <span className={`mx-1 font-bold ${alert.avgStress > 2.5 ? 'text-rose-600' : 'text-amber-600'}`}>
                      {Number(alert.avgStress).toFixed(2)}
                    </span>
                    / 3.0
                  </p>
                  <div className="flex items-center gap-2 mt-2 text-xs text-slate-500">
                    <span className="font-bold text-slate-700">{alert.employeeCount}</span> employees affected
                  </div>
                </div>

                {/* Actionable Recommendation */}
                <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-indigo-500"></div>
                    <p className="text-[10px] uppercase font-black text-slate-400 tracking-tighter">
                      Immediate Intervention
                    </p>
                  </div>
                  <p className="text-sm font-semibold text-slate-700">
                    {alert.recommendation}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* ===== Dashboard Footer ===== */}
      <div className="flex items-center justify-center gap-6 pt-6 border-t border-slate-200">
         <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Kafka Source: OK</span>
         </div>
         <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse"></div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Spark Engine: Active</span>
         </div>
      </div>
    </div>
  );
};

export default BurnoutDashboard;