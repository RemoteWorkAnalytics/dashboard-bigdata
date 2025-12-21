import React, { useState } from 'react';
import { HashRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  BrainCircuit,
  Activity,
  ShieldAlert,
  Menu,
  X,
  TrendingUp,
  AlertTriangle,
  Radio,
  CalendarDays,
  BellRing,
  Users
} from 'lucide-react';

import RealTimeStats from './pages/RealTimeStats';
import BurnoutDashboard from './pages/Alerts';
import WorkLocationDashboard from './pages/WorkLocationDashboard';
import WorkLocationImpact from './pages/WorkLocationDashboard';

/* =========================
   Sidebar Link
   ========================= */
const SidebarLink = ({
  to,
  icon: Icon,
  label,
  active
}: {
  to: string;
  icon: any;
  label: string;
  active: boolean;
}) => (
  <Link
    to={to}
    className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
      active
        ? 'bg-indigo-600 text-white shadow-md shadow-indigo-200'
        : 'text-slate-600 hover:bg-indigo-50 hover:text-indigo-600'
    }`}
  >
    <Icon size={20} />
    <span className="font-medium">{label}</span>
  </Link>
);

/* =========================
   Layout
   ========================= */
const AppLayout = ({ children }: { children?: React.ReactNode }) => {
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const location = useLocation();

  return (
    <div className="flex min-h-screen bg-slate-50">
      <button
        onClick={() => setSidebarOpen(!isSidebarOpen)}
        className="lg:hidden fixed bottom-6 right-6 z-50 p-4 bg-indigo-600 text-white rounded-full shadow-xl"
      >
        {isSidebarOpen ? <X /> : <Menu />}
      </button>

      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 bg-white border-r border-slate-200 transform transition-transform duration-300
        lg:translate-x-0 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}
      >
        <div className="flex flex-col h-full p-6">
          <div className="flex items-center gap-2 mb-10">
            <div className="p-2 bg-indigo-600 rounded-lg text-white">
              <Activity size={24} />
            </div>
            <h1 className="text-xl font-bold text-slate-900">WellbeingStream</h1>
          </div>

          <nav className="flex-1 space-y-2">
            <SidebarLink to="/" icon={LayoutDashboard} label="Overview" active={location.pathname === '/'} />
            <SidebarLink to="/real-time" icon={Radio} label="Real-time (CMS)" active={location.pathname === '/real-time'} />
            <SidebarLink to="/alerts" icon={BellRing} label="Alerts" active={location.pathname === '/alerts'} />
          
          </nav>

          <div className="mt-auto p-4 bg-indigo-50 rounded-xl">
            <div className="flex items-center gap-2 text-indigo-700 font-semibold text-sm mb-1">
              <AlertTriangle size={16} />
              Live Feed
            </div>
            <p className="text-xs text-indigo-600">
              Spark cluster is processing events...
            </p>
          </div>
        </div>
      </aside>

      <main className={`flex-1 transition-all duration-300 ${isSidebarOpen ? 'lg:ml-64' : ''}`}>
        <header className="sticky top-0 bg-white border-b border-slate-200 px-8 py-4">
          <h2 className="text-lg font-semibold text-slate-800">
            {location.pathname === '/work-location' && 'Work Location Impact'}
          </h2>
        </header>

        <div className="p-8 max-w-7xl mx-auto">{children}</div>
      </main>
    </div>
  );
};

/* =========================
   App
   ========================= */
export default function App() {
  return (
    <Router>
      <AppLayout>
        <Routes>
          <Route path="/" element={<WorkLocationImpact />} />
          <Route path="/alerts" element={<BurnoutDashboard />} />
          <Route path="/real-time" element={<RealTimeStats />} />
        </Routes>
      </AppLayout>
    </Router>
  );
}
