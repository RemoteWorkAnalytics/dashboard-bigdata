
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
  Radio
} from 'lucide-react';

import Overview from './pages/Overview';
import MentalHealth from './pages/MentalHealth';
import Productivity from './pages/Productivity';
// import RiskAssessment from './pages/RiskAssessment';
import RealTimeStats from './pages/RealTimeStats';

const SidebarLink = ({ to, icon: Icon, label, active }: { to: string, icon: any, label: string, active: boolean }) => (
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

const AppLayout = ({ children }: { children?: React.ReactNode }) => {
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const location = useLocation();

  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* Mobile Toggle */}
      <button 
        onClick={() => setSidebarOpen(!isSidebarOpen)}
        className="lg:hidden fixed bottom-6 right-6 z-50 p-4 bg-indigo-600 text-white rounded-full shadow-xl"
      >
        {isSidebarOpen ? <X /> : <Menu />}
      </button>

      {/* Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 z-40 w-64 bg-white border-r border-slate-200 transform transition-transform duration-300 ease-in-out
        lg:translate-x-0 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="flex flex-col h-full p-6">
          <div className="flex items-center gap-2 mb-10">
            <div className="p-2 bg-indigo-600 rounded-lg text-white">
              <Activity size={24} />
            </div>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">WellbeingStream</h1>
          </div>

          <nav className="flex-1 space-y-2">
            <SidebarLink to="/" icon={LayoutDashboard} label="Executive Overview" active={location.pathname === '/'} />
            <SidebarLink to="/real-time" icon={Radio} label="Real-time (CMS)" active={location.pathname === '/real-time'} />
            <SidebarLink to="/mental-health" icon={BrainCircuit} label="Mental Health" active={location.pathname === '/mental-health'} />
            <SidebarLink to="/productivity" icon={TrendingUp} label="Productivity" active={location.pathname === '/productivity'} />
            <SidebarLink to="/risk" icon={ShieldAlert} label="Risk Assessment" active={location.pathname === '/risk'} />
          </nav>

          <div className="mt-auto p-4 bg-indigo-50 rounded-xl">
            <div className="flex items-center gap-2 text-indigo-700 font-semibold text-sm mb-1">
              <AlertTriangle size={16} />
              Live Feed
            </div>
            <p className="text-xs text-indigo-600 leading-relaxed">
              Spark cluster is processing 1.2k events/min. Next sync in 5s.
            </p>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className={`flex-1 transition-all duration-300 ${isSidebarOpen ? 'lg:ml-64' : ''}`}>
        <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-slate-200 px-8 py-4 flex justify-between items-center">
          <h2 className="text-lg font-semibold text-slate-800">
            {location.pathname === '/' && 'Executive Overview'}
            {location.pathname === '/real-time' && 'Real-time Analytics - Count-Min Sketch'}
            {location.pathname === '/mental-health' && 'Mental Health Analytics'}
            {location.pathname === '/productivity' && 'Productivity & Performance'}
            {location.pathname === '/risk' && 'Predictive Risk Model'}
          </h2>
          <div className="flex items-center gap-4">
            <div className="flex -space-x-2">
              <img src="https://picsum.photos/32/32?random=1" alt="Member 1" className="w-8 h-8 rounded-full border-2 border-white" />
              <img src="https://picsum.photos/32/32?random=2" alt="Member 2" className="w-8 h-8 rounded-full border-2 border-white" />
              <img src="https://picsum.photos/32/32?random=3" alt="Member 3" className="w-8 h-8 rounded-full border-2 border-white" />
            </div>
            <div className="h-8 w-px bg-slate-200 mx-2" />
            <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors">
              Export Report
            </button>
          </div>
        </header>
        
        <div className="p-8 max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
};

export default function App() {
  return (
    <Router>
      <AppLayout>
        <Routes>
          <Route path="/" element={<Overview />} />
          <Route path="/real-time" element={<RealTimeStats />} />
          <Route path="/mental-health" element={<MentalHealth />} />
          <Route path="/productivity" element={<Productivity />} />
          {/* <Route path="/risk" element={<RiskAssessment />} /> */}
        </Routes>
      </AppLayout>
    </Router>
  );
}
