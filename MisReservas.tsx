
import React, { useState } from 'react';
import { Calendar, Clock, MapPin, Plus, ChevronRight, Trophy, Trash2, X, AlertTriangle } from 'lucide-react';

interface MisReservasProps {
  bookings: any[];
  onCancel: (id: string) => void;
  onNew: () => void;
}

const MisReservas: React.FC<MisReservasProps> = ({ bookings, onCancel, onNew }) => {
  const [cancelModalBooking, setCancelModalBooking] = useState<any | null>(null);
  const [detailsModalBooking, setDetailsModalBooking] = useState<any | null>(null);
  const [cancelReason, setCancelReason] = useState('');

  // Sort bookings by date to show upcoming first
  const sortedBookings = [...bookings].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  const formatDisplayDate = (isoString: string) => {
    const d = new Date(isoString);
    const day = d.getDate();
    const month = d.toLocaleString('es-ES', { month: 'short' }).toUpperCase();
    return { day, month };
  };

  const handleConfirmCancel = () => {
    if (cancelModalBooking) {
      onCancel(cancelModalBooking.id);
      setCancelModalBooking(null);
      setCancelReason('');
    }
  };

  return (
    <div className="space-y-6 md:space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <section className="flex flex-col md:flex-row justify-between items-end gap-4 md:gap-6">
        <div className="w-full md:w-auto">
          <h1 className="text-2xl md:text-4xl font-black text-gray-900 tracking-tighter uppercase">Mis Reservas</h1>
          <p className="text-gray-400 mt-0.5 md:mt-1 italic font-medium text-xs md:text-base">Controla tu calendario de tecnificaciones programadas.</p>
        </div>
        <button 
          onClick={onNew}
          className="w-full md:w-auto gold-gradient text-white px-6 md:px-8 py-3.5 md:py-4 rounded-xl md:rounded-2xl font-black text-[10px] md:text-xs uppercase tracking-widest flex items-center justify-center gap-2 md:gap-3 shadow-xl shadow-prem-gold/10 active:scale-95 transition-all"
        >
          <Plus size={18} md:size={20} /> Nueva Reserva
        </button>
      </section>

      <div className="bg-white rounded-[24px] md:rounded-3xl border border-gray-50 shadow-sm overflow-hidden card-shadow">
        <div className="p-6 md:p-10 border-b border-gray-50 flex flex-col sm:flex-row items-center justify-between gap-4 bg-gray-50/30">
          <h2 className="text-lg md:text-2xl font-black flex items-center gap-3 md:gap-4 text-gray-900 uppercase tracking-tighter">
            <Calendar className="text-prem-gold" size={22} md:size={28} /> Próximas Sesiones
          </h2>
          <span className="bg-white text-prem-gold font-black px-3 py-1.5 md:px-4 md:py-2 rounded-lg md:rounded-xl text-[9px] md:text-[10px] uppercase tracking-widest border border-gray-100 shadow-sm flex items-center gap-2">
            <Trophy size={12} md:size={14} /> {bookings.length} ACTIVAS
          </span>
        </div>

        <div className="divide-y divide-gray-50">
          {sortedBookings.length > 0 ? sortedBookings.map(res => {
            const { day, month } = formatDisplayDate(res.date);
            return (
              <div key={res.id} className="p-6 md:p-10 flex flex-col lg:flex-row items-center justify-between hover:bg-gray-50/50 transition-all group gap-6 md:gap-8">
                <div className="flex flex-col sm:flex-row items-center gap-6 md:gap-10 w-full">
                  <div className="flex flex-col items-center justify-center w-16 h-16 md:w-24 md:h-24 bg-white rounded-2xl md:rounded-3xl border border-gray-100 group-hover:gold-gradient group-hover:border-transparent transition-all duration-500 shadow-sm">
                    <span className="text-gray-300 font-black text-[8px] md:text-[10px] uppercase tracking-widest group-hover:text-white/60 mb-0.5 md:mb-1">{month}</span>
                    <span className="text-gray-900 font-black text-xl md:text-3xl group-hover:text-white leading-none">{day}</span>
                  </div>
                  
                  <div className="text-center sm:text-left">
                    <div className="flex flex-wrap justify-center sm:justify-start items-center gap-2 md:gap-4 mb-2 md:mb-3">
                      <span className="px-2 py-0.5 bg-gray-100 text-[8px] md:text-[10px] font-black uppercase text-gray-400 rounded-md border border-gray-200 group-hover:bg-prem-gold/10 group-hover:text-prem-gold transition-colors">
                        {res.category}
                      </span>
                      <h3 className="text-lg md:text-2xl font-black text-gray-900 tracking-tight">{res.name}</h3>
                    </div>
                    <div className="flex flex-wrap justify-center sm:justify-start items-center gap-4 md:gap-6 text-gray-400 font-bold text-xs md:text-sm tracking-wide">
                      <span className="flex items-center gap-1.5 md:gap-2"><Clock size={14} md:size={16} className="text-prem-gold" /> {res.time}H</span>
                      <span className="flex items-center gap-1.5 md:gap-2"><MapPin size={14} md:size={16} className="text-prem-gold" /> {res.location}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4 md:gap-6 w-full lg:w-auto justify-center lg:justify-end">
                  <button 
                    onClick={() => setCancelModalBooking(res)}
                    className="px-4 py-2.5 md:px-6 md:py-3 text-[9px] md:text-xs font-black text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-lg md:rounded-xl transition-all uppercase tracking-widest flex items-center gap-1.5 md:gap-2 border border-transparent hover:border-red-100"
                  >
                    <Trash2 size={12} md:size={14} /> Anular
                  </button>
                  <button 
                    onClick={() => setDetailsModalBooking(res)}
                    className="p-3 md:p-4 bg-gray-50 text-gray-300 rounded-xl md:rounded-2xl hover:text-prem-gold group-hover:gold-gradient group-hover:text-white transition-all shadow-sm"
                  >
                    <ChevronRight size={20} md:size={24} />
                  </button>
                </div>
              </div>
            );
          }) : (
            <div className="p-12 md:p-24 text-center">
              <div className="w-16 h-16 md:w-20 md:h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 md:mb-6 text-gray-200">
                <Calendar size={28} md:size={32} />
              </div>
              <h3 className="text-lg md:text-xl font-black text-gray-900 uppercase">Sin reservas activas</h3>
              <p className="text-gray-400 mt-2 text-xs md:text-base">Empieza hoy mismo tu camino a la élite reservando tu primera sesión.</p>
            </div>
          )}
        </div>
      </div>

      {/* Modal de Anulación Personalizado */}
      {cancelModalBooking && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-6 bg-black/40 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-md rounded-[40px] overflow-hidden shadow-2xl animate-in zoom-in-95 duration-300">
            <div className="p-10">
              <div className="flex justify-between items-center mb-8">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-red-50 text-red-500 rounded-2xl">
                    <AlertTriangle size={24} />
                  </div>
                  <h3 className="text-2xl font-black text-gray-900 tracking-tighter uppercase">
                    Anular Reserva
                  </h3>
                </div>
                <button onClick={() => setCancelModalBooking(null)} className="p-2 text-gray-300 hover:text-gray-900 transition-colors">
                  <X size={24} />
                </button>
              </div>
              
              <div className="mb-8 p-4 bg-gray-50 rounded-2xl border border-gray-100">
                <p className="text-sm font-bold text-gray-600 mb-1">Sesión seleccionada:</p>
                <p className="text-lg font-black text-gray-900 uppercase tracking-tight">{cancelModalBooking.name}</p>
                <div className="flex gap-4 mt-2 text-xs text-gray-400 font-bold uppercase tracking-widest">
                  <span>{cancelModalBooking.time}h</span>
                  <span>{cancelModalBooking.location}</span>
                </div>
              </div>

              <div className="space-y-6">
                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest px-1">Motivo de la cancelación</label>
                  <textarea 
                    value={cancelReason}
                    onChange={(e) => setCancelReason(e.target.value)}
                    placeholder="Indica por qué no puedes asistir..."
                    className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-5 py-4 text-sm font-bold text-gray-900 focus:outline-none focus:ring-4 focus:ring-red-500/10 focus:border-red-200 transition-all min-h-[100px] resize-none"
                  />
                </div>

                <div className="p-4 bg-red-50 rounded-2xl border border-red-100">
                  <p className="text-[10px] font-black text-red-600 uppercase tracking-widest text-center leading-relaxed">
                    ¿Estás seguro que quieres anular? <br/> Se te devolverán los prems automáticamente a tu balance.
                  </p>
                </div>

                <div className="flex gap-4">
                  <button 
                    onClick={() => setCancelModalBooking(null)}
                    className="flex-1 py-4 bg-gray-100 text-gray-400 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-gray-200 transition-all"
                  >
                    Cerrar
                  </button>
                  <button 
                    onClick={handleConfirmCancel}
                    disabled={!cancelReason.trim()}
                    className={`flex-[2] py-4 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl transition-all active:scale-95 ${
                      cancelReason.trim() 
                        ? 'bg-red-500 text-white shadow-red-500/20 hover:bg-red-600' 
                        : 'bg-gray-100 text-gray-300 cursor-not-allowed'
                    }`}
                  >
                    Confirmar Anulación
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* Modal de Detalls de la Reserva */}
      {detailsModalBooking && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-6 bg-black/40 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-lg rounded-[40px] overflow-hidden shadow-2xl animate-in zoom-in-95 duration-300">
            <div className="p-10">
              <div className="flex justify-between items-center mb-8">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-prem-gold/10 text-prem-gold rounded-2xl">
                    <Trophy size={24} />
                  </div>
                  <h3 className="text-2xl font-black text-gray-900 tracking-tighter uppercase">
                    Detalls de la Sessió
                  </h3>
                </div>
                <button onClick={() => setDetailsModalBooking(null)} className="p-2 text-gray-300 hover:text-gray-900 transition-colors">
                  <X size={24} />
                </button>
              </div>

              <div className="space-y-8">
                <div className="grid grid-cols-2 gap-6">
                  <div className="p-6 bg-gray-50 rounded-3xl border border-gray-100">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Data i Hora</p>
                    <div className="flex items-center gap-3 text-gray-900 font-black">
                      <Calendar size={18} className="text-prem-gold" />
                      <span>{new Date(detailsModalBooking.date).toLocaleDateString('ca-ES', { day: 'numeric', month: 'long' })}</span>
                    </div>
                    <div className="flex items-center gap-3 text-gray-900 font-black mt-2">
                      <Clock size={18} className="text-prem-gold" />
                      <span>{detailsModalBooking.time}h</span>
                    </div>
                  </div>
                  <div className="p-6 bg-gray-50 rounded-3xl border border-gray-100">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Ubicació</p>
                    <div className="flex items-center gap-3 text-gray-900 font-black">
                      <MapPin size={18} className="text-prem-gold" />
                      <span>{detailsModalBooking.location}</span>
                    </div>
                    <div className="mt-2">
                      <span className="px-2 py-0.5 bg-prem-gold text-white text-[9px] font-black uppercase rounded">
                        {detailsModalBooking.category}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="p-8 bg-black text-white rounded-[32px] relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-4 opacity-10">
                    <Trophy size={80} />
                  </div>
                  <h4 className="text-sm font-black uppercase tracking-widest text-prem-gold mb-2">Sessió Reservada</h4>
                  <p className="text-2xl font-black tracking-tight mb-4">{detailsModalBooking.name}</p>
                  <div className="flex items-center gap-2 text-white/60 text-xs font-bold">
                    <span>ID Reserva: {detailsModalBooking.id}</span>
                    <span className="w-1 h-1 bg-white/20 rounded-full"></span>
                    <span>Cost: {detailsModalBooking.cost} Prems</span>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="text-xs font-black uppercase tracking-widest text-gray-400 px-1">Informació Addicional</h4>
                  <div className="p-6 bg-gray-50 rounded-3xl border border-gray-100 italic text-gray-500 text-sm leading-relaxed">
                    Aquesta sessió està confirmada. Recorda arribar 15 minuts abans de l'inici per a l'escalfament previ. En cas de no poder assistir, si us plau anul·la la reserva amb antelació.
                  </div>
                </div>

                <button 
                  onClick={() => setDetailsModalBooking(null)}
                  className="w-full py-5 gold-gradient text-white rounded-2xl font-black text-sm uppercase tracking-widest shadow-xl shadow-prem-gold/20 active:scale-95 transition-all"
                >
                  Tancar Detalls
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MisReservas;
