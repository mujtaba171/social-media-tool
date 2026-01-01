
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, PieChart, Pie, AreaChart, Area, ComposedChart, Line } from 'recharts';
import { Lead, Platform, LeadStatus } from '../types';
import { COLORS } from '../constants';

interface LeadDashboardProps {
  leads: Lead[];
}

const LeadDashboard: React.FC<LeadDashboardProps> = ({ leads }) => {
  const platformStats = [
    { name: 'Instagram', value: leads.filter(l => l.platform === Platform.INSTAGRAM).length, color: COLORS.instagram },
    { name: 'Facebook', value: leads.filter(l => l.platform === Platform.FACEBOOK).length, color: COLORS.facebook },
    { name: 'Web', value: leads.filter(l => l.platform === Platform.WEB_FORM).length, color: COLORS.primary },
  ];

  // Feature D: Funnel Calculation
  const funnelData = [
    { stage: 'New', count: leads.length, color: '#94a3b8' },
    { stage: 'Contacted', count: leads.filter(l => l.status !== LeadStatus.NEW).length, color: '#60a5fa' },
    { stage: 'Qualified', count: leads.filter(l => l.status === LeadStatus.QUALIFIED || l.status === LeadStatus.CLOSED).length, color: '#34d399' },
    { stage: 'Closed', count: leads.filter(l => l.status === LeadStatus.CLOSED).length, color: '#818cf8' },
  ];

  const scoreData = leads.map(l => ({ name: l.name, score: l.score })).sort((a, b) => b.score - a.score);

  const stats = [
    { label: 'Total Leads', value: leads.length, change: '+12%', color: 'blue' },
    { label: 'Avg Lead Score', value: Math.round(leads.reduce((acc, l) => acc + l.score, 0) / (leads.length || 1)), change: '+5.4', color: 'emerald' },
    { label: 'Conversion Rate', value: `${Math.round((leads.filter(l => l.status === LeadStatus.CLOSED).length / (leads.length || 1)) * 100)}%`, change: '+2%', color: 'amber' },
    { label: 'AI Optimized', value: '100%', change: 'Active', color: 'indigo' },
  ];

  return (
    <div className="space-y-8">
      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow group">
            <p className="text-sm font-bold text-slate-500 uppercase tracking-tight">{stat.label}</p>
            <div className="mt-2 flex items-baseline justify-between">
              <h3 className="text-3xl font-black text-slate-900 tracking-tighter">{stat.value}</h3>
              <span className={`text-xs font-bold px-2 py-1 rounded-full ${stat.change.toString().startsWith('+') ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}`}>
                {stat.change}
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Funnel Chart */}
        <div className="lg:col-span-2 bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <h4 className="text-lg font-black text-slate-900">Conversion Funnel</h4>
            <span className="text-xs font-bold text-slate-400">REAL-TIME TRACKING</span>
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={funnelData} layout="vertical" margin={{ left: 20 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#f1f5f9" />
                <XAxis type="number" hide />
                <YAxis dataKey="stage" type="category" axisLine={false} tickLine={false} tick={{ fontSize: 13, fontWeight: 700, fill: '#64748b' }} />
                <Tooltip 
                  cursor={{ fill: 'transparent' }}
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                />
                <Bar dataKey="count" radius={[0, 8, 8, 0]} barSize={40}>
                  {funnelData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Channels Breakdown */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col">
          <h4 className="text-lg font-black text-slate-900 mb-6">Traffic Sources</h4>
          <div className="flex-1 h-48">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={platformStats}
                  innerRadius={65}
                  outerRadius={90}
                  paddingAngle={8}
                  dataKey="value"
                >
                  {platformStats.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-6 space-y-3">
            {platformStats.map((item, i) => (
              <div key={i} className="flex items-center justify-between p-2.5 bg-slate-50 rounded-xl border border-slate-100">
                <div className="flex items-center space-x-3">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }}></div>
                  <span className="text-sm font-bold text-slate-600">{item.name}</span>
                </div>
                <span className="text-sm font-black text-slate-900">{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Heatmap/Score distribution */}
      <div className="bg-white p-8 rounded-xl border border-slate-200 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <h4 className="text-lg font-black text-slate-900">Lead Engagement Velocity</h4>
          <div className="flex space-x-2">
            <span className="w-3 h-3 bg-blue-500 rounded-full"></span>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Active Leads</span>
          </div>
        </div>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={scoreData}>
              <defs>
                <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4}/>
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#cbd5e1' }} />
              <YAxis axisLine={false} tickLine={false} hide />
              <Tooltip />
              <Area type="monotone" dataKey="score" stroke="#2563eb" strokeWidth={3} fillOpacity={1} fill="url(#colorScore)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default LeadDashboard;
