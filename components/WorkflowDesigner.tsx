
import React, { useState } from 'react';

const WorkflowDesigner: React.FC = () => {
  const [steps, setSteps] = useState([
    { id: '1', type: 'trigger', icon: '🔌', title: 'Webhook Trigger', desc: 'Incoming DM, Lead Ad, or Comment' },
    { id: '2', type: 'action', icon: '📝', title: 'Database Insert', desc: 'Add lead to Supabase/Airtable' },
    { id: 'ai-1', type: 'ai', icon: '🧠', title: 'Gemini Scorer', desc: 'Assess intent and assign lead score' },
    { id: '3', type: 'action', icon: '✉️', title: 'AI Welcome', desc: 'Send context-aware automated reply' },
    { id: '4', type: 'delay', icon: '⏳', title: 'Wait 24 Hours', desc: 'Allow organic conversion time' },
    { id: '6', type: 'action', icon: '🔔', title: 'Smart Follow-up', desc: 'Trigger round #2 based on behavioral score' }
  ]);

  return (
    <div className="space-y-6">
      <div className="bg-blue-600 rounded-xl p-8 text-white">
        <h2 className="text-2xl font-bold mb-2">Workflow Architecture</h2>
        <p className="text-blue-100 max-w-2xl">
          Visualizing your AI-powered lead pipeline. Every interaction is scored and optimized for conversion.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 relative">
        {steps.map((step, index) => (
          <div key={step.id} className="relative group">
            <div className={`bg-white border p-5 rounded-xl shadow-sm transition-all z-10 relative
              ${step.type === 'ai' ? 'border-indigo-400 ring-2 ring-indigo-50' : 'border-slate-200'}`}>
              <div className="flex items-center space-x-4">
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center text-2xl
                  ${step.type === 'trigger' ? 'bg-amber-100' : 
                    step.type === 'action' ? 'bg-blue-100' : 
                    step.type === 'ai' ? 'bg-indigo-100 animate-pulse' : 'bg-slate-100'}`}>
                  {step.icon}
                </div>
                <div>
                  <h4 className="font-bold text-slate-900">{step.title}</h4>
                  <p className="text-[10px] text-slate-500 uppercase tracking-wide font-bold mt-1">
                    {step.type === 'ai' ? 'AI Processing' : step.type}
                  </p>
                </div>
              </div>
              <p className="mt-4 text-sm text-slate-600 leading-relaxed italic">
                {step.desc}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-slate-900 text-white p-6 rounded-xl overflow-hidden mt-10">
        <div className="flex justify-between items-center mb-4">
          <h4 className="text-sm font-mono text-slate-400">ENHANCED_SCHEMA_PREVIEW</h4>
          <span className="text-[10px] bg-indigo-500 px-2 py-0.5 rounded uppercase font-bold">AI Ready</span>
        </div>
        <pre className="text-sm font-mono text-blue-400 overflow-x-auto whitespace-pre-wrap">
{`{
  "table_name": "leads_registry",
  "columns": {
    "lead_score": "integer check (0-100)",
    "ai_intent_summary": "text",
    "suggested_reply": "text",
    "last_nurture_at": "timestamp",
    "sentiment": "enum('positive', 'neutral', 'negative')"
  }
}`}
        </pre>
      </div>
    </div>
  );
};

export default WorkflowDesigner;
