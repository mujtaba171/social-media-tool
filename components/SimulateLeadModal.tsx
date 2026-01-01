
import React, { useState } from 'react';
import { supabase } from '../supabaseClient';
import { Lead, Platform, LeadStatus } from '../types';

interface SimulateLeadModalProps {
  onClose: () => void;
  onSuccess: (lead: Lead) => void;
}

const SimulateLeadModal: React.FC<SimulateLeadModalProps> = ({ onClose, onSuccess }) => {
  const [platform, setPlatform] = useState<Platform>(Platform.INSTAGRAM);
  const [keyword, setKeyword] = useState('INFO');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const randomName = ['Alex Rivera', 'Jordan Smith', 'Taylor Black', 'Casey Jones', 'Morgan Lee'][Math.floor(Math.random() * 5)];
    const username = `@${randomName.toLowerCase().replace(' ', '_')}`;
    const score = Math.floor(Math.random() * 60) + 40;
    const probability = Math.floor(Math.random() * 50) + (keyword === 'DEMO' ? 40 : 10);
    const phone = `+1${Math.floor(Math.random() * 9000000000) + 1000000000}`;

    const newLead = {
      name: randomName,
      username: username,
      platform: platform,
      keyword: keyword,
      contact: `${username.substring(1)}@example.com`,
      phone: phone,
      status: LeadStatus.NEW,
      notes: `Captured via webhook. Intent Category: ${keyword}`,
      score: score,
      conversion_probability: probability,
      profile_link: `https://${platform.toLowerCase()}.com/${username.substring(1)}`,
      created_at: new Date().toISOString(),
      last_follow_up: null,
      next_follow_up: null
    };

    try {
      const { data, error } = await supabase.from('leads').insert([newLead]).select();
      if (error) throw error;
      
      const res = data?.[0] || newLead;
      onSuccess({
        id: res.id || Math.random().toString(),
        name: res.name,
        username: res.username,
        platform: res.platform as Platform,
        keyword: res.keyword,
        contact: res.contact,
        phone: res.phone,
        status: res.status as LeadStatus,
        notes: res.notes,
        score: res.score,
        conversionProbability: res.conversion_probability || probability,
        profileLink: res.profile_link || res.profileLink,
        createdAt: res.created_at || res.createdAt,
        lastFollowUp: null,
        nextFollowUp: null
      });
    } catch (err) {
      onSuccess({
        id: Math.random().toString(),
        ...newLead,
        conversionProbability: probability,
        profileLink: newLead.profile_link,
        createdAt: newLead.created_at,
        lastFollowUp: null,
        nextFollowUp: null
      } as Lead);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in fade-in duration-300">
        <div className="p-8">
          <div className="flex items-center space-x-4 mb-6">
            <div className="bg-slate-100 p-3 rounded-2xl">⚡</div>
            <div>
              <h3 className="text-2xl font-black text-slate-900">Inject Mock Webhook</h3>
              <p className="text-sm text-slate-500 font-medium">Simulate incoming Lead Event</p>
            </div>
          </div>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Platform</label>
              <div className="grid grid-cols-2 gap-3">
                {[Platform.INSTAGRAM, Platform.FACEBOOK].map(p => (
                  <button key={p} type="button" onClick={() => setPlatform(p)} className={`py-3 rounded-xl text-sm font-bold border-2 transition-all ${platform === p ? 'border-blue-600 bg-blue-50 text-blue-700' : 'border-slate-100 text-slate-400'}`}>
                    {p}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Trigger Intent</label>
              <select value={keyword} onChange={(e) => setKeyword(e.target.value)} className="w-full bg-slate-50 border-2 border-slate-100 rounded-xl px-4 py-3 text-sm font-bold">
                <option value="INFO">Information Query</option>
                <option value="DEMO">Demo Request (High Intent)</option>
                <option value="START">Getting Started</option>
              </select>
            </div>
            <div className="pt-4 flex space-x-3">
              <button type="button" onClick={onClose} className="flex-1 py-4 text-sm font-bold text-slate-400">Cancel</button>
              <button type="submit" disabled={loading} className="flex-1 py-4 bg-blue-600 text-white rounded-2xl text-sm font-black shadow-lg">
                {loading ? 'Processing...' : 'Send Event'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SimulateLeadModal;
