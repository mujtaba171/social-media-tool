
import React, { useState, useEffect } from 'react';
import LeadDashboard from './components/LeadDashboard';
import WorkflowDesigner from './components/WorkflowDesigner';
import IntegrationGuide from './components/IntegrationGuide';
import LeadTable from './components/LeadTable';
import AIStrategyModal from './components/AIStrategyModal';
import SimulateLeadModal from './components/SimulateLeadModal';
import { Lead, LeadStatus, Platform } from './types';
import { supabase } from './supabaseClient';

const MOCK_LEADS: Lead[] = [
  {
    id: '1',
    name: 'Sarah Jenkins',
    username: '@sarah_j',
    profileLink: 'https://instagram.com/sarah_j',
    keyword: 'INFO',
    contact: 'sarah@example.com',
    phone: '+15551234567',
    platform: Platform.INSTAGRAM,
    status: LeadStatus.NEW,
    createdAt: new Date(Date.now() - 3600000).toISOString(),
    lastFollowUp: null,
    nextFollowUp: new Date(Date.now() + 86400000).toISOString(),
    notes: 'Inquired via DM about pricing.',
    score: 85,
    conversionProbability: 72,
    aiSummary: 'High-intent lead interested in the growth package.'
  },
  {
    id: '2',
    name: 'Michael Chen',
    username: 'mchen_fb',
    profileLink: 'https://facebook.com/mchen',
    keyword: 'DEMO',
    contact: '+1 555-0102',
    phone: '+15559876543',
    platform: Platform.FACEBOOK,
    status: LeadStatus.QUALIFIED,
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    lastFollowUp: new Date(Date.now() - 10000000).toISOString(),
    nextFollowUp: new Date(Date.now() + 172800000).toISOString(),
    notes: 'Facebook lead ad submission.',
    score: 92,
    conversionProbability: 88,
    aiSummary: 'Interested in enterprise-level automation scaling.'
  }
];

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'leads' | 'workflow' | 'guide'>('dashboard');
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedLeadForAI, setSelectedLeadForAI] = useState<Lead | null>(null);
  const [showSimulateModal, setShowSimulateModal] = useState(false);
  const [notifications, setNotifications] = useState<{id: string, text: string, time: string, isRead: boolean}[]>([]);
  const [showNotifications, setShowNotifications] = useState(false);

  const fetchLeads = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('leads')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      if (data && data.length > 0) {
        const mappedLeads: Lead[] = data.map((item: any) => ({
          id: item.id,
          name: item.name,
          username: item.username,
          profileLink: item.profile_link || item.profileLink || '',
          keyword: item.keyword,
          contact: item.contact,
          phone: item.phone,
          platform: item.platform as Platform,
          status: item.status as LeadStatus,
          createdAt: item.created_at || item.createdAt,
          lastFollowUp: item.last_follow_up || item.lastFollowUp,
          nextFollowUp: item.next_follow_up || item.nextFollowUp,
          notes: item.notes,
          score: item.score || 0,
          conversionProbability: item.conversion_probability || Math.floor(Math.random() * 100),
          aiSummary: item.ai_summary || item.aiSummary
        }));
        setLeads(mappedLeads);
      } else {
        setLeads(MOCK_LEADS);
      }
    } catch (err) {
      setLeads(MOCK_LEADS);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeads();
  }, []);

  const addNotification = (text: string) => {
    setNotifications(prev => [{
      id: Math.random().toString(),
      text,
      time: 'Just now',
      isRead: false
    }, ...prev]);
  };

  const handleLeadCreated = (newLead: Lead) => {
    setLeads(prev => [newLead, ...prev]);
    addNotification(`High-value lead detected: ${newLead.name} (${newLead.conversionProbability}% probability)`);
    setShowSimulateModal(false);
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="bg-blue-600 p-2 rounded-lg">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">LeadFlow AI</h1>
          </div>
          
          <nav className="hidden md:flex space-x-6">
            {['dashboard', 'leads', 'workflow', 'guide'].map((tab) => (
              <button 
                key={tab}
                onClick={() => setActiveTab(tab as any)}
                className={`text-sm font-semibold transition-colors capitalize ${activeTab === tab ? 'text-blue-600 border-b-2 border-blue-600 pb-5 -mb-5' : 'text-slate-500 hover:text-slate-900'}`}
              >
                {tab === 'workflow' ? 'Automation Flow' : tab}
              </button>
            ))}
          </nav>

          <div className="flex items-center space-x-4">
            <button 
              onClick={() => setShowSimulateModal(true)}
              className="bg-slate-900 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-slate-800 transition-all shadow-sm flex items-center space-x-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
              <span>Mock Webhook</span>
            </button>
            
            <div className="relative">
              <button onClick={() => setShowNotifications(!showNotifications)} className="p-2 text-slate-400 hover:text-slate-600 relative">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
                {unreadCount > 0 && <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-red-500 border-2 border-white rounded-full text-[10px] text-white flex items-center justify-center font-bold">{unreadCount}</span>}
              </button>
              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 bg-white border border-slate-200 rounded-xl shadow-xl z-[70] overflow-hidden">
                  <div className="p-4 border-b border-slate-100 flex justify-between bg-slate-50 items-center">
                    <h4 className="font-bold text-slate-800 text-sm">Real-time Alerts</h4>
                    <button onClick={() => setNotifications([])} className="text-[10px] text-blue-600 font-bold uppercase">Clear</button>
                  </div>
                  <div className="max-h-64 overflow-y-auto">
                    {notifications.length === 0 ? <div className="p-8 text-center text-slate-400 text-xs italic">All systems green.</div> : notifications.map(n => (
                      <div key={n.id} className="p-4 border-b border-slate-50 hover:bg-blue-50/30 transition-colors">
                        <p className="text-sm text-slate-700">{n.text}</p>
                        <span className="text-[10px] text-slate-400">{n.time}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
            <div className="w-8 h-8 rounded-full bg-slate-200 border border-slate-200 overflow-hidden shadow-sm">
               <img src="https://picsum.photos/32/32" alt="Avatar" />
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
        {loading ? (
          <div className="flex flex-col items-center justify-center h-64 space-y-4">
            <div className="animate-spin rounded-full h-10 w-10 border-4 border-blue-600 border-t-transparent"></div>
            <p className="text-slate-400 text-sm font-medium">Synchronizing Lead Data...</p>
          </div>
        ) : (
          <>
            {activeTab === 'dashboard' && <LeadDashboard leads={leads} />}
            {activeTab === 'leads' && <LeadTable leads={leads} onOpenAI={(lead) => setSelectedLeadForAI(lead)} />}
            {activeTab === 'workflow' && <WorkflowDesigner />}
            {activeTab === 'guide' && <IntegrationGuide />}
          </>
        )}
      </main>

      {selectedLeadForAI && <AIStrategyModal lead={selectedLeadForAI} onClose={() => setSelectedLeadForAI(null)} />}
      {showSimulateModal && <SimulateLeadModal onClose={() => setShowSimulateModal(false)} onSuccess={handleLeadCreated} />}
    </div>
  );
};

export default App;
