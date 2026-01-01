
import React, { useState, useEffect } from 'react';
import { GoogleGenAI } from '@google/genai';
import { Lead } from '../types';

interface AIStrategyModalProps {
  lead: Lead;
  onClose: () => void;
}

const AIStrategyModal: React.FC<AIStrategyModalProps> = ({ lead, onClose }) => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<{
    sentiment: string, 
    summary: string, 
    tactics: string[], 
    reply: string,
    objections: {objection: string, rebuttal: string}[]
  } | null>(null);

  useEffect(() => {
    const analyzeLead = async () => {
      setLoading(true);
      try {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        const prompt = `Analyze this lead for conversion optimization:
        Name: ${lead.name} | Keyword: ${lead.keyword} | Probability: ${lead.conversionProbability}%
        Context: ${lead.notes}

        Return JSON format with:
        1. "sentiment": (One word)
        2. "summary": (20 words)
        3. "tactics": (Array of 3 strings)
        4. "reply": (Personalized first response)
        5. "objections": (Array of 2 objects with "objection" and "rebuttal") 
        
        Focus on overcoming high-ticket sales objections. Return ONLY valid JSON.`;

        const response = await ai.models.generateContent({
          model: 'gemini-3-flash-preview',
          contents: prompt,
          config: { responseMimeType: 'application/json' }
        });

        const parsed = JSON.parse(response.text || '{}');
        setData(parsed);
      } catch (error) {
        console.error('AI Error:', error);
      } finally {
        setLoading(false);
      }
    };

    analyzeLead();
  }, [lead]);

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md">
      <div className="bg-white rounded-[2rem] shadow-2xl w-full max-w-2xl overflow-hidden animate-in zoom-in slide-in-from-bottom-8 duration-500">
        <div className="p-10">
          <div className="flex items-start justify-between mb-8">
            <div className="flex items-center space-x-6">
              <div className="w-16 h-16 rounded-2xl bg-indigo-600 flex items-center justify-center text-3xl shadow-lg text-white">
                ✨
              </div>
              <div>
                <h3 className="text-3xl font-black text-slate-900 tracking-tighter">{lead.name}</h3>
                <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">{lead.platform} · AI Strategy Session</p>
              </div>
            </div>
            <button onClick={onClose} className="p-3 bg-slate-50 text-slate-400 hover:text-slate-900 rounded-full transition-all hover:rotate-90">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>

          {loading ? (
            <div className="space-y-6">
              <div className="h-4 bg-slate-50 rounded w-1/2 animate-pulse"></div>
              <div className="h-32 bg-slate-50 rounded-3xl animate-pulse"></div>
              <div className="h-48 bg-slate-900/5 rounded-3xl animate-pulse"></div>
            </div>
          ) : data ? (
            <div className="space-y-6 max-h-[60vh] overflow-y-auto pr-2">
              <div className="grid grid-cols-2 gap-4">
                <div className="p-5 bg-indigo-50 border border-indigo-100 rounded-3xl">
                  <span className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">Sentiment</span>
                  <p className="text-xl font-black text-indigo-700 mt-1">{data.sentiment}</p>
                </div>
                <div className="p-5 bg-emerald-50 border border-emerald-100 rounded-3xl">
                  <span className="text-[10px] font-black text-emerald-400 uppercase tracking-widest">AI Prediction</span>
                  <p className="text-xl font-black text-emerald-700 mt-1">{lead.conversionProbability}% Probable</p>
                </div>
              </div>

              <div className="bg-slate-900 rounded-[2rem] p-8 text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-10">
                   <svg className="w-24 h-24" fill="currentColor" viewBox="0 0 24 24"><path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z" /></svg>
                </div>
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Suggested AI Reply</span>
                <p className="text-lg text-blue-100 font-medium leading-relaxed mt-3 mb-6 italic">"{data.reply}"</p>
                <button className="w-full py-4 bg-blue-600 text-white rounded-2xl text-sm font-black hover:bg-blue-700 transition-all flex items-center justify-center space-x-2">
                   <span>Copy and Send</span>
                </button>
              </div>

              <div>
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-4">Predicted Objections & Rebuttals</span>
                <div className="space-y-4">
                  {data.objections.map((obj, i) => (
                    <div key={i} className="p-5 bg-slate-50 rounded-2xl border border-slate-100">
                      <p className="text-sm font-black text-red-500 uppercase tracking-tighter mb-2">Possible Objection: "{obj.objection}"</p>
                      <p className="text-sm text-slate-600 italic">" {obj.rebuttal} "</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default AIStrategyModal;
