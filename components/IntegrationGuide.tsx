
import React from 'react';

const IntegrationGuide: React.FC = () => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
      <div className="lg:col-span-8 space-y-8">
        <section className="bg-white p-10 rounded-[2.5rem] border border-slate-200 shadow-sm">
          <h2 className="text-3xl font-black text-slate-900 mb-8 tracking-tighter">Roadmap to Full Autonomy</h2>
          <div className="space-y-6">
            {[
              { 
                title: 'AI Reply Integration (Workable)', 
                desc: 'Gemini 3 Flash analyzes incoming DMs. In n8n, use the HTTP Request node to call Gemini API, passing the lead context to generate responses.',
                status: 'READY'
              },
              { 
                title: 'WhatsApp Bridge', 
                desc: 'Uses wa.me dynamic links to transition leads from DMs to instant messaging. Higher conversion rates observed with 90%+ open rates.',
                status: 'LIVE'
              },
              { 
                title: 'Voice Automation (v3.0)', 
                desc: 'Integrate Twilio or Vapi.ai with n8n. Trigger an automated outbound call for any lead scoring above 90% within 5 minutes of capture.',
                status: 'BETA'
              },
              { 
                title: 'Predictive Lead Scoring', 
                desc: 'Neural scoring based on interaction depth and keyword analysis. Probability is updated in Supabase after every AI strategy refresh.',
                status: 'ACTIVE'
              }
            ].map((item, i) => (
              <div key={i} className="p-6 bg-slate-50 rounded-3xl border border-slate-100 flex items-start space-x-6">
                <div className="w-12 h-12 bg-white rounded-2xl shadow-sm flex items-center justify-center font-black text-blue-600">
                  {i + 1}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h5 className="font-black text-slate-900 text-lg">{item.title}</h5>
                    <span className="text-[10px] font-black px-2 py-0.5 bg-blue-100 text-blue-600 rounded uppercase">{item.status}</span>
                  </div>
                  <p className="text-sm text-slate-500 mt-2 leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
      <div className="lg:col-span-4">
        <div className="bg-slate-900 text-white p-8 rounded-[2rem] sticky top-24">
          <h4 className="text-xl font-black mb-6 tracking-tighter">n8n Logic Architecture</h4>
          <div className="space-y-4 text-sm text-slate-400">
            <p className="font-mono text-xs bg-slate-800 p-4 rounded-xl text-blue-400 border border-slate-700">
              Trigger: Webhook<br/>
              ↓<br/>
              Action: Gemini Analysis<br/>
              ↓<br/>
              Filter: Prob > 70%?<br/>
              ↓<br/>
              Yes: Bridge to WhatsApp<br/>
              No: Email Nurture Sequence
            </p>
            <button className="w-full py-4 bg-white text-slate-900 rounded-2xl font-black hover:bg-blue-50 transition-all mt-4">
               Copy n8n Blueprint
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IntegrationGuide;
