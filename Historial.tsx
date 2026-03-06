
import React from 'react';
import { History, ArrowUpRight, ArrowDownLeft, Calendar } from 'lucide-react';

const Historial: React.FC = () => {
  const historial = [
    { id: 1, type: 'consumo', label: 'Sesión Elite Performance', date: 'Hoy, 10:30', amount: -15, sede: 'Banyoles' },
    { id: 2, type: 'recarga', label: 'Recarga Pack Premium', date: '12 May, 14:20', amount: 50, sede: '-' },
    { id: 3, type: 'consumo', label: 'Sesión Development U12', date: '10 May, 18:00', amount: -5, sede: 'Calonge' },
    { id: 4, type: 'consumo', label: 'Sesión Performance Pro', date: '08 May, 17:30', amount: -8, sede: 'Banyoles' },
  ];

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <section>
        <h1 className="text-4xl font-black text-gray-900 tracking-tighter uppercase">Historial de Actividad</h1>
        <p className="text-gray-500 mt-1 italic">Registro completo de tus movimientos y sesiones en Prem Academy.</p>
      </section>

      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-8 border-b border-gray-50 flex items-center justify-between">
          <h2 className="text-xl font-bold flex items-center gap-3">
            <History className="text-prem-green" size={24} /> Movimientos Recientes
          </h2>
          <button className="flex items-center gap-2 text-xs font-bold text-gray-400 hover:text-prem-green uppercase tracking-widest transition-colors">
            <Calendar size={14} /> Filtrar por fecha
          </button>
        </div>

        <div className="divide-y divide-gray-50">
          {historial.map(item => (
            <div key={item.id} className="p-8 flex items-center justify-between hover:bg-gray-50/50 transition-colors">
              <div className="flex items-center gap-6">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${item.type === 'recarga' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-500'}`}>
                  {item.type === 'recarga' ? <ArrowDownLeft size={20} /> : <ArrowUpRight size={20} />}
                </div>
                <div>
                  <h3 className="text-lg font-black text-gray-900 leading-tight">{item.label}</h3>
                  <div className="flex items-center gap-3 mt-1">
                    <span className="text-xs font-bold text-gray-400 uppercase tracking-tighter">{item.date}</span>
                    <span className="w-1 h-1 bg-gray-200 rounded-full"></span>
                    <span className="text-xs font-bold text-gray-400 uppercase tracking-tighter">{item.sede}</span>
                  </div>
                </div>
              </div>

              <div className={`text-2xl font-black ${item.type === 'recarga' ? 'text-green-600' : 'text-gray-900'}`}>
                {item.amount > 0 ? `+${item.amount}` : item.amount} 
                <span className="text-xs uppercase font-bold text-gray-400 ml-2">Prems</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Historial;
