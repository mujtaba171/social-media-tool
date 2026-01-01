
import React from 'react';
import { Lead, LeadStatus, Platform } from '../types';
import { Icons } from '../constants';

interface LeadTableProps {
  leads: Lead[];
  onOpenAI: (lead: Lead) => void;
}

const LeadTable: React.FC<LeadTableProps> = ({ leads, onOpenAI }) => {
  const getStatusStyle = (status: LeadStatus) => {
    switch (status) {
      case LeadStatus.NEW: return 'bg-slate-100 text-slate-600 border-slate-200';
      case LeadStatus.QUALIFIED: return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      case LeadStatus.CLOSED: return 'bg-indigo-100 text-indigo-700 border-indigo-200';
      default: return 'bg-slate-50 text-slate-400 border-slate-100';
    }
  };

  const getProbColor = (prob: number) => {
    if (prob > 75) return 'text-emerald-600';
    if (prob > 40) return 'text-amber-600';
    return 'text-slate-400';
  };

  const handleWhatsApp = (lead: Lead) => {
    const text = encodeURIComponent(`Hi ${lead.name}, thanks for reaching out on ${lead.platform}!`);
    window.open(`https://wa.me/${lead.phone || '15551234567'}?text=${text}`, '_blank');
  };

  const handleVoiceSim = (lead: Lead) => {
    alert(`Triggering n8n Voice Node... \n\nInitiating AI outbound call to ${lead.name} at ${lead.phone || 'N/A'}. \n\nScript: 'Introduction & ${lead.keyword} qualification'`);
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="p-8 border-b border-slate-100 flex flex-wrap items-center justify-between gap-6 bg-slate-50/30">
        <div>
          <h3 className="text-2xl font-black text-slate-900 tracking-tighter">Unified Pipeline</h3>
          <p className="text-sm font-medium text-slate-400 mt-1">Multi-channel leads with real-time conversion probability</p>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-slate-50 text-[10px] font-black text-slate-400 uppercase tracking-widest">
            <tr>
              <th className="px-8 py-6">Lead</th>
              <th className="px-8 py-6">Status/Stage</th>
              <th className="px-8 py-6">Prob.</th>
              <th className="px-8 py-6">Score</th>
              <th className="px-8 py-6">Bridge Connect</th>
              <th className="px-8 py-6 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {leads.map((lead) => (
              <tr key={lead.id} className="hover:bg-slate-50/50 transition-colors">
                <td className="px-8 py-6">
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 rounded-xl bg-slate-900 flex items-center justify-center text-white">
                       {lead.platform === Platform.INSTAGRAM ? <Icons.Instagram /> : <Icons.Facebook />}
                    </div>
                    <div>
                      <div className="text-sm font-black text-slate-900">{lead.name}</div>
                      <div className="text-[10px] text-slate-400 font-bold uppercase">{lead.keyword}</div>
                    </div>
                  </div>
                </td>
                <td className="px-8 py-6">
                  <span className={`px-4 py-1.5 rounded-xl text-[10px] font-black border uppercase tracking-widest ${getStatusStyle(lead.status)}`}>
                    {lead.status}
                  </span>
                </td>
                <td className="px-8 py-6">
                  <span className={`text-sm font-black ${getProbColor(lead.conversionProbability)}`}>
                    {lead.conversionProbability}%
                  </span>
                </td>
                <td className="px-8 py-6">
                  <div className="w-16 h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-600 rounded-full" style={{ width: `${lead.score}%` }}></div>
                  </div>
                </td>
                <td className="px-8 py-6">
                  <div className="flex space-x-2">
                    <button onClick={() => handleWhatsApp(lead)} className="p-2 bg-emerald-100 text-emerald-600 rounded-lg hover:bg-emerald-200 transition-colors" title="Bridge to WhatsApp">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.025 3.12l-1.02 3.731 3.834-1.005c.801.514 1.236.806 2.047.806 9.74 0 14.312-12.418 7.425-18.188-2.072-1.737-4.735-2.696-7.543-2.696v.03z"/></svg>
                    </button>
                    <button onClick={() => handleVoiceSim(lead)} className="p-2 bg-indigo-100 text-indigo-600 rounded-lg hover:bg-indigo-200 transition-colors" title="Trigger Voice Automation">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/></svg>
                    </button>
                  </div>
                </td>
                <td className="px-8 py-6 text-right">
                  <button onClick={() => onOpenAI(lead)} className="px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-black shadow-lg hover:bg-blue-600 transition-all">
                    Launch AI
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default LeadTable;
