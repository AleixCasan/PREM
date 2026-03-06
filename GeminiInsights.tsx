
import React, { useState, useEffect } from 'react';
import { Quote, RefreshCw, Trophy, Sparkles } from 'lucide-react';
import { GoogleGenAI } from "@google/genai";
import { User } from '../types';

interface GeminiInsightsProps {
  user: User;
}

const GeminiInsights: React.FC<GeminiInsightsProps> = ({ user }) => {
  const [insight, setInsight] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);

  const fetchInsight = async (retryCount = 0) => {
    if (retryCount === 0) setLoading(true);
    
    // SAFETY CHECK: Si no hay API KEY configurada, usamos contenido fallback sin intentar conectar
    if (!process.env.API_KEY || process.env.API_KEY === 'YOUR_API_KEY_HERE') {
      setInsight('"La consistencia es lo que separa a los buenos de los mejores. Sigue entrenando fuerte."');
      setLoading(false);
      return;
    }

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Actúa como el Analista Táctico Jefe de PREM ACADEMY. 
        Analiza a este jugador: 
        Nombre: ${user.name}
        Nivel: ${user.level}
        Habilidades: Técnica ${user.skills.tecnica}%, Táctica ${user.skills.tactica}%, Física ${user.skills.fisico}%.
        
        Proporciona un consejo de entrenamiento profesional personalizado y MUY BREVE (máximo 20 palabras).
        Debe ser inspirador, directo y usar terminología de fútbol profesional.
        En español.`,
      });
      
      setInsight(response.text || '"Tu técnica es tu lenguaje en el campo. Perfecciónala cada día."');
      setLoading(false);
    } catch (error: any) {
      console.warn("Gemini Insight notice (handled): API limited or unavailable.");
      
      // Robust error checking for 429/Quota limits/Resource Exhausted
      const errorMsg = error?.message || error?.toString() || '';
      const isQuotaError = 
        error?.status === 429 || 
        error?.error?.code === 429 || 
        error?.error?.status === 'RESOURCE_EXHAUSTED' ||
        errorMsg.includes('429') || 
        errorMsg.includes('RESOURCE_EXHAUSTED') || 
        errorMsg.includes('quota');
      
      if (isQuotaError && retryCount < 1) {
        // En caso de quota, esperamos un poco antes de un último reintento o fallback
        setTimeout(() => fetchInsight(retryCount + 1), 3000);
      } else {
        // Fallback robusto para evitar bloqueos de la UI
        setInsight('"La consistencia es lo que separa a los buenos de los mejores. Enfócate en la repetición de calidad."');
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    fetchInsight();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="bg-white rounded-[24px] md:rounded-[40px] p-6 md:p-10 shadow-xl border border-gray-100 relative overflow-hidden group card-shadow">
      {/* Background Decor */}
      <div className="absolute -top-10 -right-10 opacity-[0.03] pointer-events-none transform rotate-12 group-hover:scale-110 transition-transform duration-700">
        <Trophy size={200} className="text-prem-gold md:w-[300px] md:h-[300px]" />
      </div>

      <div className="relative z-10">
        <div className="flex items-center justify-between mb-6 md:mb-8">
          <div className="flex items-center gap-3 md:gap-4">
            <div className="p-3 md:p-4 gold-gradient rounded-2xl md:rounded-3xl shadow-xl border-2 border-white animate-pulse">
              <Sparkles size={20} md:size={24} className="text-white" />
            </div>
            <div>
              <h3 className="text-prem-gold font-black tracking-widest uppercase text-[10px] md:text-xs">Anàlisi d'IA Prem</h3>
              <p className="text-gray-300 text-[8px] md:text-[10px] font-bold uppercase tracking-widest">Personal Performance Analyst</p>
            </div>
          </div>
          <button 
            onClick={() => fetchInsight(0)}
            disabled={loading}
            className="text-gray-200 hover:text-prem-gold transition-all p-2 md:p-3 rounded-full hover:bg-gray-50 active:rotate-180 duration-500"
          >
            <RefreshCw size={16} md:size={18} className={loading ? 'animate-spin' : ''} />
          </button>
        </div>

        {loading ? (
          <div className="space-y-3 md:space-y-4">
            <div className="h-6 md:h-8 bg-gray-50 rounded-xl md:rounded-2xl w-full animate-pulse"></div>
            <div className="h-6 md:h-8 bg-gray-50 rounded-xl md:rounded-2xl w-2/3 animate-pulse"></div>
          </div>
        ) : (
          <div className="max-w-4xl">
            <p className="text-gray-800 text-lg md:text-3xl font-black italic leading-tight tracking-tight">
              {insight}
            </p>
            <div className="mt-4 md:mt-6 flex items-center gap-2 md:gap-3">
               <div className="w-8 md:w-12 h-1 gold-gradient rounded-full"></div>
               <span className="text-[8px] md:text-[10px] font-black text-prem-gold uppercase tracking-widest">Tactical Insight Verified</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default GeminiInsights;
