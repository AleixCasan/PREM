import React, { useState, useMemo, useEffect } from 'react';
import { 
  MapPin, 
  Calendar, 
  Clock, 
  CheckCircle2, 
  ChevronRight, 
  Package, 
  CreditCard, 
  AlertCircle, 
  CalendarDays,
  ArrowLeft,
  ChevronLeft,
  Users,
  ShieldCheck
} from 'lucide-react';
import { User, Sede, Service, Player, ViewType } from '../types';

interface ReservationFlowProps {
  user: User;
  sessions: any[];
  seus: Sede[];
  players: Player[];
  onAddBooking: (booking: any) => void;
  onComplete: () => void;
  onNavigate: (view: ViewType, sede?: Sede, session?: any) => void;
  initialSede?: Sede;
  initialSession?: any;
}

const ALL_SERVICES: Service[] = [
  { id: '1', name: 'Development Group', description: 'Tècnica base i coordinació per a joves promeses.', duration: 70, capacity: 6, price: 35, category: 'Prem Academy' },
  { id: '2', name: 'Performance Group', description: 'Alta intensitat, tàctica avançada i correcció Pro.', duration: 70, capacity: 4, price: 35, category: 'Prem Pro' },
  { id: '3', name: 'Elite Pro', description: 'Entrenament individualitzat d\'elit amb anàlisi de vídeo.', duration: 90, capacity: 1, price: 35, category: 'Prem Pro' },
];

const ReservationFlow: React.FC<ReservationFlowProps> = ({ user, sessions, seus, players, onAddBooking, onComplete, onNavigate, initialSede, initialSession }) => {
  const [step, setStep] = useState(initialSession || initialSede ? 2 : 1);
  const [selection, setSelection] = useState<{
    sede?: Sede;
    player?: Player;
    service?: Service;
    selectedDate?: string; // ISO Date String (toDateString)
    session?: any;
  }>(() => {
    if (initialSession) {
      const sede = seus.find(s => s.id === initialSession.sedeId);
      const serviceId = initialSession.serviceId;
      const service = ALL_SERVICES.find(s => s.id === serviceId);
      
      return {
        sede,
        session: initialSession,
        service,
        selectedDate: new Date(initialSession.startTime).toDateString()
      };
    }
    return {
      sede: initialSede
    };
  });
  
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Estat per a la navegació del calendari al pas 3
  const [currentCalendarDate, setCurrentCalendarDate] = useState(new Date());

  const availableServices = useMemo(() => {
    if (!selection.sede) return [];
    return ALL_SERVICES.filter(s => selection.sede?.activeServiceIds?.includes(s.id) || selection.sede?.id === '1' || selection.sede?.id === '2');
  }, [selection.sede]);

  const filteredSessions = useMemo(() => {
    if (!selection.sede || !selection.service) return [];
    return sessions.filter(s => s.sedeId === selection.sede?.id && s.serviceId === selection.service?.id);
  }, [selection.sede, selection.service, sessions]);

  const uniqueAvailableDates = useMemo(() => {
    const dates = filteredSessions.map((s: any) => new Date(s.startTime).toDateString());
    return [...new Set(dates)];
  }, [filteredSessions]);

  const sessionsOnSelectedDate = useMemo(() => {
    if (!selection.selectedDate) return [];
    return filteredSessions.filter(s => new Date(s.startTime).toDateString() === selection.selectedDate);
  }, [selection.selectedDate, filteredSessions]);

  const handleConfirm = () => {
    if (!selection.session || !selection.service) {
      setError("Dades de reserva incompletes.");
      return;
    }
    
    const cost = selection.session.price || selection.service.price;

    if (user.premsBalance < cost) {
      setError("No tens suficients Prems per a aquesta reserva.");
      return;
    }

    if (!acceptedTerms) {
      setError("Has d'acceptar les condicions de reserva.");
      return;
    }

    const sessionDate = new Date(selection.session.startTime);
    const newBooking = {
      id: `res-${Math.floor(Math.random() * 10000)}`,
      sessionId: selection.session.id,
      userId: user.id,
      userName: user.name,
      playerId: selection.player?.id,
      playerName: selection.player ? `${selection.player.firstName} ${selection.player.lastName}` : user.name,
      date: sessionDate.toISOString(),
      time: `${sessionDate.getHours().toString().padStart(2, '0')}:${sessionDate.getMinutes().toString().padStart(2, '0')}`,
      name: selection.session.name,
      location: selection.session.location || selection.sede?.name,
      category: selection.session.category,
      cost: cost
    };
    onAddBooking(newBooking);
    onComplete();
  };

  const nextStep = () => {
    setError(null);
    // If we have an initial session and we just selected the player (step 2), skip to step 5
    if (initialSession && step === 2) {
      setStep(5);
      return;
    }
    setStep(prev => prev + 1);
  };
  
  const prevStep = () => {
    setError(null);
    // If we have an initial session and we are at step 5, go back to step 2
    if (initialSession && step === 5) {
      setStep(2);
      return;
    }
    setStep(prev => prev - 1);
  };

  const daysInMonth = (date: Date) => new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  const firstDayOfMonth = (date: Date) => {
    const day = new Date(date.getFullYear(), date.getMonth(), 1).getDay();
    return day === 0 ? 6 : day - 1; // Ajust L-D
  };

  const renderCalendar = () => {
    const year = currentCalendarDate.getFullYear();
    const month = currentCalendarDate.getMonth();
    const totalDays = daysInMonth(currentCalendarDate);
    const startOffset = firstDayOfMonth(currentCalendarDate);
    const monthName = currentCalendarDate.toLocaleString('ca-ES', { month: 'long', year: 'numeric' });
    const days = ['L', 'M', 'X', 'J', 'V', 'S', 'D'];

    const calendarCells = [];
    for (let i = 0; i < startOffset; i++) calendarCells.push(null);
    for (let i = 1; i <= totalDays; i++) calendarCells.push(new Date(year, month, i));

    const handlePrevMonth = () => setCurrentCalendarDate(new Date(year, month - 1, 1));
    const handleNextMonth = () => setCurrentCalendarDate(new Date(year, month + 1, 1));

    return (
      <div className="bg-white border border-gray-100 rounded-[32px] p-6 shadow-sm overflow-hidden animate-in fade-in zoom-in-95 duration-500">
        <div className="flex items-center justify-between mb-8">
          <h4 className="text-lg font-black text-gray-900 uppercase tracking-tighter capitalize">{monthName}</h4>
          <div className="flex gap-2">
            <button onClick={handlePrevMonth} className="p-2 hover:bg-gray-50 rounded-xl text-gray-400 transition-colors">
              <ChevronLeft size={20} />
            </button>
            <button onClick={handleNextMonth} className="p-2 hover:bg-gray-50 rounded-xl text-gray-400 transition-colors">
              <ChevronRight size={20} />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-7 gap-1 mb-4">
          {days.map(d => (
            <div key={d} className="text-center text-[10px] font-black text-gray-300 uppercase py-2">{d}</div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-2">
          {calendarCells.map((date, idx) => {
            if (!date) return <div key={`empty-${idx}`} className="aspect-square"></div>;
            
            const dateStr = date.toDateString();
            const isAvailable = uniqueAvailableDates.includes(dateStr);
            const isSelected = selection.selectedDate === dateStr;
            const isToday = dateStr === new Date().toDateString();

            return (
              <button
                key={idx}
                disabled={!isAvailable}
                onClick={() => setSelection({ ...selection, selectedDate: dateStr, session: undefined })}
                className={`
                  aspect-square rounded-2xl flex flex-col items-center justify-center relative transition-all duration-300
                  ${isAvailable ? 'hover:scale-110 cursor-pointer' : 'opacity-20 grayscale cursor-not-allowed'}
                  ${isSelected ? 'gold-gradient text-white shadow-lg shadow-prem-gold/20' : 'bg-gray-50 text-gray-600'}
                  ${isToday && !isSelected ? 'ring-2 ring-prem-gold ring-inset' : ''}
                `}
              >
                <span className="text-xs font-black">{date.getDate()}</span>
                {isAvailable && !isSelected && (
                  <span className="absolute bottom-2 w-1 h-1 bg-prem-gold rounded-full"></span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-4xl mx-auto py-4 md:py-8 px-3 md:px-4 animate-in fade-in duration-700">
      {/* Step Indicator */}
      <div className="mb-8 md:mb-12">
        <div className="flex items-center justify-between max-w-2xl mx-auto relative">
          <div className="absolute top-1/2 left-0 w-full h-0.5 bg-gray-100 -translate-y-1/2 z-0"></div>
          {[1, 2, 3, 4, 5].map((i) => (
            <div 
              key={i} 
              className={`relative z-10 w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center font-black text-[10px] md:text-xs transition-all duration-500 ${
                step >= i ? 'gold-gradient text-white shadow-lg shadow-prem-gold/20 scale-110' : 'bg-white border-2 border-gray-100 text-gray-300'
              }`}
            >
              {step > i ? <CheckCircle2 size={14} md:size={18} /> : i}
            </div>
          ))}
        </div>
        <div className="flex justify-between max-w-2xl mx-auto mt-3 md:mt-4">
          {['Sede', 'Jugador', 'Servei', 'Horari', 'Confirmar'].map((label, idx) => (
            <span key={label} className={`text-[8px] md:text-[10px] font-black uppercase tracking-widest ${step === idx + 1 ? 'text-prem-gold' : 'text-gray-300'}`}>
              {label}
            </span>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-[24px] md:rounded-[40px] shadow-2xl border border-gray-100 overflow-hidden card-shadow">
        {/* Header de Paso */}
        <div className="p-5 md:p-8 border-b border-gray-50 flex items-center justify-between bg-gray-50/30">
          <div className="flex items-center gap-3 md:gap-4">
            {step > 1 && (
              <button onClick={prevStep} className="p-1.5 md:p-2 text-gray-400 hover:text-prem-gold transition-colors">
                <ArrowLeft size={18} md:size={20} />
              </button>
            )}
            <h2 className="text-lg md:text-2xl font-black text-gray-900 uppercase tracking-tighter">
              {step === 1 && "Selecciona la Seu"}
              {step === 2 && "Selecciona el Jugador"}
              {step === 3 && "Tria l'Entrenament"}
              {step === 4 && "Dia i Hora Pro"}
              {step === 5 && "Confirmar Reserva"}
            </h2>
          </div>
          <span className="bg-white px-3 py-1.5 md:px-4 md:py-2 rounded-lg md:rounded-xl text-[8px] md:text-[10px] font-black text-prem-gold border border-gray-100 shadow-sm uppercase tracking-widest">
            Pas {step} de 5
          </span>
        </div>

        {error && (
          <div className="px-5 md:px-8 pt-5 md:pt-8 animate-in fade-in slide-in-from-top-2 duration-300">
            <div className="p-3 md:p-4 bg-red-50 border border-red-100 rounded-xl md:rounded-2xl flex items-center gap-2 md:gap-3 text-red-600">
               <AlertCircle size={18} md:size={20} />
               <p className="text-[10px] md:text-xs font-bold uppercase tracking-tight">{error}</p>
            </div>
          </div>
        )}

        <div className="p-5 md:p-12">
          {/* STEP 1: SEDE */}
          {step === 1 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
              {seus.map(s => (
                <button
                  key={s.id}
                  onClick={() => { 
                    setSelection(prev => ({ 
                      ...prev, 
                      sede: s, 
                      service: prev.sede?.id !== s.id ? undefined : prev.service,
                      selectedDate: prev.sede?.id !== s.id ? undefined : prev.selectedDate,
                      session: prev.sede?.id !== s.id ? undefined : prev.session
                    })); 
                    nextStep(); 
                  }}
                  className={`group relative h-48 md:h-64 border-2 rounded-[24px] md:rounded-[32px] overflow-hidden transition-all duration-500 hover:scale-[1.03] shadow-lg ${
                    selection.sede?.id === s.id ? 'border-prem-gold' : 'border-transparent'
                  }`}
                >
                  <div 
                    className="absolute inset-0 bg-cover bg-center transition-all duration-700 group-hover:scale-110 group-hover:brightness-110 blur-[1px] group-hover:blur-0"
                    style={{ backgroundImage: s.image ? `url('${s.image}')` : 'none', backgroundColor: '#eee' }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-transparent group-hover:from-black/80 transition-all duration-500" />
                  <div className="absolute inset-0 p-5 md:p-8 flex flex-col justify-end text-left relative z-10">
                    <div className="flex items-start justify-between">
                      <div className="flex flex-col">
                        <div className="flex items-center gap-2 mb-1 md:mb-2">
                           <div className="p-1.5 md:p-2 bg-prem-gold/20 backdrop-blur-md rounded-lg text-prem-gold">
                              <MapPin size={14} md:size={16} />
                           </div>
                           <span className="text-[8px] md:text-[10px] font-black uppercase text-prem-gold tracking-widest">Seu Oficial</span>
                        </div>
                        <h3 className="font-black text-xl md:text-3xl text-white tracking-tight mb-0.5 md:mb-1 group-hover:text-prem-gold transition-colors">{s.name}</h3>
                        <p className="text-gray-300 text-xs md:text-sm font-medium">{s.location}</p>
                      </div>
                      <div className={`transition-all duration-500 ${selection.sede?.id === s.id ? 'opacity-100 scale-110' : 'opacity-0 translate-x-4 group-hover:opacity-100 group-hover:translate-x-0'}`}>
                         <div className="w-8 h-8 md:w-10 md:h-10 gold-gradient rounded-lg md:rounded-xl flex items-center justify-center text-white shadow-xl">
                            <ChevronRight size={16} md:size={20} />
                         </div>
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}

          {/* STEP 2: JUGADOR */}
          {step === 2 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 animate-in slide-in-from-right-10 duration-500">
              {players.filter(p => p.guardianId === user.id).map(p => (
                <button
                  key={p.id}
                  onClick={() => { setSelection({ ...selection, player: p }); nextStep(); }}
                  className={`flex items-center gap-4 p-5 md:p-6 border-2 rounded-[24px] md:rounded-[32px] transition-all text-left group ${
                    selection.player?.id === p.id ? 'border-prem-gold bg-prem-gold/5 shadow-inner' : 'border-gray-100 hover:border-prem-gold hover:bg-gray-50/50 shadow-sm'
                  }`}
                >
                  <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-gray-100 overflow-hidden border-2 border-white shadow-md shrink-0">
                    {p.photo ? (
                      <img src={p.photo} alt={p.firstName} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-300">
                        <Users size={32} />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-black text-lg md:text-xl text-gray-900 truncate uppercase tracking-tighter">
                      {p.firstName} {p.lastName}
                    </h3>
                    <p className="text-[10px] font-black text-prem-gold uppercase tracking-widest">{p.category} · {p.club}</p>
                    <div className="mt-2 flex items-center gap-2">
                      <span className="px-2 py-0.5 bg-gray-100 rounded text-[8px] font-black text-gray-400 uppercase tracking-widest">
                        {p.mainPosition}
                      </span>
                    </div>
                  </div>
                  <ChevronRight className={`transition-colors ${selection.player?.id === p.id ? 'text-prem-gold' : 'text-gray-200 group-hover:text-prem-gold'}`} size={24} />
                </button>
              ))}
              {players.filter(p => p.guardianId === user.id).length === 0 && (
                <div className="col-span-full p-12 text-center bg-gray-50 rounded-3xl border border-gray-100">
                   <Users size={40} className="mx-auto text-gray-200 mb-4" />
                   <p className="text-gray-400 font-black uppercase tracking-widest text-xs">No tens cap jugador associat al teu compte.</p>
                </div>
              )}
            </div>
          )}

          {/* STEP 3: SERVICIO */}
          {step === 3 && (
            <div className="grid grid-cols-1 gap-4 md:gap-6 animate-in slide-in-from-right-10 duration-500">
              {availableServices.map(s => (
                <button
                  key={s.id}
                  onClick={() => { 
                    setSelection(prev => ({ 
                      ...prev, 
                      service: s,
                      selectedDate: prev.service?.id !== s.id ? undefined : prev.selectedDate,
                      session: prev.service?.id !== s.id ? undefined : prev.session
                    })); 
                    nextStep(); 
                  }}
                  className={`flex flex-col md:flex-row items-center gap-4 md:gap-8 p-5 md:p-8 border-2 rounded-[24px] md:rounded-[32px] transition-all text-left group ${
                    selection.service?.id === s.id ? 'border-prem-gold bg-prem-gold/5 shadow-inner' : 'border-gray-100 hover:border-prem-gold hover:bg-gray-50/50 shadow-sm'
                  }`}
                >
                  <div className={`w-14 h-14 md:w-20 md:h-20 shrink-0 rounded-xl md:rounded-2xl flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform ${s.category === 'Prem Pro' ? 'bg-black' : 'gold-gradient'}`}>
                    <Package size={24} md:size={32} />
                  </div>
                  <div className="flex-1 text-center md:text-left">
                    <div className="flex flex-col md:flex-row items-center gap-2 md:gap-3 mb-1 md:mb-2">
                       <span className={`text-[8px] md:text-[10px] font-black uppercase px-2 py-0.5 rounded ${s.category === 'Prem Pro' ? 'bg-prem-gold text-black' : 'gold-gradient text-white'}`}>
                        {s.category}
                       </span>
                       <h3 className="font-black text-lg md:text-2xl text-gray-900">{s.name}</h3>
                    </div>
                    <p className="text-gray-400 font-medium mb-3 md:mb-4 text-xs md:text-base">{s.description}</p>
                    <div className="flex items-center justify-center md:justify-start gap-4 md:gap-6 text-[10px] md:text-xs font-bold text-gray-500 uppercase tracking-widest">
                       <span className="flex items-center gap-1.5 md:gap-2"><Clock size={14} md:size={16} className="text-prem-gold" /> {s.duration} min</span>
                       <span className="flex items-center gap-1.5 md:gap-2"><CreditCard size={14} md:size={16} className="text-prem-gold" /> {s.price} prems</span>
                    </div>
                  </div>
                  <ChevronRight className={`hidden md:block transition-colors ${selection.service?.id === s.id ? 'text-prem-gold' : 'text-gray-200 group-hover:text-prem-gold'}`} size={32} />
                </button>
              ))}
              {availableServices.length === 0 && (
                <div className="p-12 text-center bg-gray-50 rounded-3xl border border-gray-100">
                   <AlertCircle size={40} className="mx-auto text-gray-200 mb-4" />
                   <p className="text-gray-400 font-black uppercase tracking-widest text-xs">Aquesta seu no té serveis actius actualment.</p>
                </div>
              )}
            </div>
          )}

          {/* STEP 4: CALENDARIO MENSUAL Y HORA */}
          {step === 4 && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 animate-in slide-in-from-right-10 duration-500">
              <div className="space-y-6">
                <h3 className="text-sm font-black uppercase text-gray-400 tracking-widest px-2">Selecciona un dia</h3>
                {renderCalendar()}
              </div>

              <div className="space-y-6">
                <h3 className="text-sm font-black uppercase text-gray-400 tracking-widest px-2">Torns disponibles</h3>
                
                {selection.selectedDate ? (
                  <div className="grid grid-cols-1 gap-4 animate-in fade-in slide-in-from-top-4 duration-500">
                    {sessionsOnSelectedDate.length > 0 ? sessionsOnSelectedDate.map(sess => {
                      const isFull = sess.currentAttendees >= (selection.service?.capacity || 1);
                      return (
                        <button
                          key={sess.id}
                          disabled={isFull}
                          onClick={() => { setSelection({ ...selection, session: sess }); nextStep(); }}
                          className={`p-6 border-2 rounded-3xl transition-all flex items-center justify-between group ${
                            isFull ? 'bg-gray-50 opacity-40 cursor-not-allowed border-gray-100 grayscale' :
                            selection.session?.id === sess.id 
                              ? 'border-prem-gold bg-prem-gold/5 ring-1 ring-prem-gold/20 shadow-inner' 
                              : 'border-gray-100 hover:border-prem-gold/30 hover:bg-gray-50 shadow-sm'
                          }`}
                        >
                          <div className="flex items-center gap-4">
                            <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-white transition-all ${
                              selection.session?.id === sess.id ? 'gold-gradient shadow-md' : 'bg-gray-100 text-gray-400 group-hover:bg-prem-gold/20 group-hover:text-prem-gold'
                            }`}>
                              <Clock size={24} />
                            </div>
                            <div className="text-left">
                              <p className="text-xl font-black text-gray-900">
                                {new Date(sess.startTime).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}h
                              </p>
                              <div className="flex items-center gap-2">
                                <Users size={12} className="text-gray-300" />
                                <span className={`text-[9px] font-black uppercase tracking-widest ${isFull ? 'text-red-500' : 'text-gray-400'}`}>
                                  {isFull ? 'PLE' : `${sess.currentAttendees || 0} / ${selection.service?.capacity || 0} Atletes`}
                                </span>
                              </div>
                            </div>
                          </div>
                          {isFull ? (
                            <span className="text-[10px] font-black text-red-500 uppercase tracking-widest bg-red-50 px-2 py-1 rounded">SENSE PLACES</span>
                          ) : (
                            <ChevronRight className={`transition-all ${selection.session?.id === sess.id ? 'text-prem-gold translate-x-1' : 'text-gray-200 group-hover:text-prem-gold group-hover:translate-x-1'}`} size={20} />
                          )}
                        </button>
                      );
                    }) : (
                      <div className="p-12 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-100 text-center">
                        <AlertCircle size={32} className="mx-auto text-gray-200 mb-4" />
                        <p className="text-gray-400 font-bold uppercase text-[10px] tracking-widest">No hi ha torns per a aquesta data.</p>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="p-12 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-100 text-center flex flex-col items-center">
                    <CalendarDays size={48} className="text-gray-200 mb-4" />
                    <p className="text-gray-400 font-bold uppercase text-[10px] tracking-widest">Selecciona un dia al calendari per veure les hores.</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* STEP 5: CONFIRMACIÓN */}
          {step === 5 && selection.session && (
            <div className="space-y-6 md:space-y-10 animate-in slide-in-from-right-10 duration-500">
              <div className="bg-gray-50 rounded-[24px] md:rounded-[32px] p-5 md:p-8 border border-gray-100 shadow-inner relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-[0.03] rotate-12">
                   <Package size={120} md:size={200} className="text-prem-gold" />
                </div>
                
                <div className="flex flex-col md:flex-row gap-6 md:gap-10 relative z-10">
                  <div className="w-full md:w-1/3 aspect-[16/9] md:aspect-[4/3] rounded-xl md:rounded-2xl overflow-hidden shadow-xl border-2 md:border-4 border-white">
                    <img 
                      src={selection.sede?.image} 
                      alt={selection.sede?.name} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 space-y-4 md:space-y-6">
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                      <div>
                        <span className="text-[8px] md:text-[10px] font-black text-prem-gold uppercase tracking-widest mb-0.5 md:mb-1 block">Resum de l'entrenament</span>
                        <h3 className="text-2xl md:text-4xl font-black text-gray-900 tracking-tighter leading-none uppercase">{selection.service?.name}</h3>
                      </div>
                      {selection.player && (
                        <div className="flex items-center gap-3 bg-white p-2 pr-4 rounded-2xl border border-gray-100 shadow-sm">
                          <div className="w-10 h-10 rounded-full bg-gray-50 overflow-hidden border border-gray-100">
                            {selection.player.photo ? (
                              <img src={selection.player.photo} alt={selection.player.firstName} className="w-full h-full object-cover" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-gray-300">
                                <Users size={16} />
                              </div>
                            )}
                          </div>
                          <div>
                            <p className="text-[8px] font-black text-gray-300 uppercase tracking-widest">Jugador</p>
                            <p className="text-xs font-black text-gray-900 uppercase tracking-tighter">{selection.player.firstName} {selection.player.lastName}</p>
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
                      <div className="space-y-0.5 md:space-y-1">
                        <p className="text-[8px] md:text-[10px] font-black text-gray-300 uppercase tracking-widest">Data i Hora</p>
                        <p className="text-sm md:text-lg font-bold text-gray-700 capitalize">
                          {new Date(selection.session.startTime).toLocaleDateString('ca-ES', { day: 'numeric', month: 'long' })} · {new Date(selection.session.startTime).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}h
                        </p>
                      </div>
                      <div className="space-y-0.5 md:space-y-1">
                        <p className="text-[8px] md:text-[10px] font-black text-gray-300 uppercase tracking-widest">Seu Oficial</p>
                        <p className="text-sm md:text-lg font-bold text-gray-700">{selection.sede?.name}</p>
                      </div>
                    </div>

                    <div className="pt-4 md:pt-6 border-t border-gray-200 flex items-center justify-between">
                      <div>
                        <p className="text-[8px] md:text-[10px] font-black text-gray-300 uppercase tracking-widest">Cost de la sessió</p>
                        <p className="text-xl md:text-3xl font-black text-prem-gold">{selection.service?.price || selection.session?.price} <span className="text-xs md:text-sm">PREMS</span></p>
                      </div>
                      <div className="text-right">
                        <p className="text-[8px] md:text-[10px] font-black text-gray-300 uppercase tracking-widest">Balanç Final</p>
                        <p className={`text-sm md:text-lg font-bold ${user.premsBalance - (selection.service?.price || selection.session?.price || 0) >= 0 ? 'text-gray-500' : 'text-red-500'}`}>
                          {user.premsBalance - (selection.service?.price || selection.session?.price || 0)} prems
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4 md:space-y-6">
                <label className={`flex items-start gap-3 md:gap-4 p-4 md:p-6 rounded-[20px] md:rounded-[28px] border transition-all cursor-pointer ${acceptedTerms ? 'bg-prem-gold/5 border-prem-gold/30' : 'bg-gray-50 border-gray-100 hover:border-gray-200'}`}>
                  <input 
                    type="checkbox" 
                    checked={acceptedTerms} 
                    onChange={e => { setAcceptedTerms(e.target.checked); setError(null); }}
                    className="mt-1 w-5 h-5 md:w-6 md:h-6 rounded border-gray-300 text-prem-gold focus:ring-prem-gold" 
                  />
                  <div>
                    <span className="text-[10px] md:text-xs font-black text-gray-900 uppercase tracking-tight block mb-0.5 md:mb-1">Acceptació de Condicions i Política de Cancel·lació</span>
                    <p className="text-[8px] md:text-[10px] font-bold text-gray-400 uppercase leading-relaxed">
                      Entenc que la reserva només es pot cancel·lar amb un mínim de 24 hores d'antelació per recuperar els Prems. Prem Academy es reserva el dret de canviar l'entrenador per motius operatius.
                    </p>
                  </div>
                </label>

                {user.premsBalance < (selection.service?.price || selection.session?.price || 0) ? (
                  <div className="space-y-4">
                    <div className="p-4 md:p-6 bg-red-50 border border-red-100 rounded-[20px] md:rounded-[28px] flex items-center gap-3 md:gap-4 text-red-600 shadow-sm animate-in shake duration-500">
                      <AlertCircle size={24} md:size={28} className="shrink-0" />
                      <div>
                         <p className="text-xs md:text-sm font-black uppercase tracking-tight">Saldo Insuficient</p>
                         <p className="text-[8px] md:text-[10px] font-bold uppercase tracking-widest opacity-80">Necessites recarregar Prems per confirmar aquesta reserva.</p>
                      </div>
                    </div>
                    <button 
                      onClick={() => onNavigate(ViewType.COMPRAR_PREMS)}
                      className="w-full py-4 md:py-6 rounded-[20px] md:rounded-[32px] bg-black text-white font-black text-sm md:text-lg uppercase tracking-widest shadow-xl hover:bg-gray-900 transition-all flex items-center justify-center gap-3 md:gap-4"
                    >
                      <CreditCard size={20} md:size={24} /> Recarregar Prems Ara
                    </button>
                  </div>
                ) : (
                  <button 
                    onClick={handleConfirm}
                    disabled={!acceptedTerms}
                    className={`w-full py-4 md:py-6 rounded-[20px] md:rounded-[32px] font-black text-sm md:text-lg uppercase tracking-widest shadow-2xl transition-all flex items-center justify-center gap-3 md:gap-4 ${
                      acceptedTerms ? 'gold-gradient text-white shadow-prem-gold/30 hover:scale-[1.01] active:scale-[0.98]' : 'bg-gray-100 text-gray-300 cursor-not-allowed'
                    }`}
                  >
                    <ShieldCheck size={20} md:size={24} /> Confirmar Reserva Ara
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReservationFlow;