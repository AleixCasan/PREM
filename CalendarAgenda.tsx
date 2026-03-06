import React, { useState, useEffect, useMemo, useRef } from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  Filter, 
  Plus, 
  Clock, 
  MapPin, 
  Trash2,
  Calendar as CalendarIcon,
  X,
  Package,
  Palette,
  AlertTriangle,
  Loader2,
  Mail,
  CheckCircle2,
  Users,
  UserCheck,
  ChevronRight as ChevronRightIcon,
  ShieldCheck,
  Dumbbell,
  FileText,
  Video as VideoIcon,
  Eye,
  Download,
  Share2,
  BookOpen,
  Upload,
  Link as LinkIcon,
  ExternalLink,
  Edit2,
  MoreVertical,
  CalendarDays,
  UserCog
} from 'lucide-react';
import { Sede, Service } from '../../types';

interface CalendarAgendaProps {
  seus: Sede[];
  serveis: Service[];
  sessions: any[];
  bookings: any[];
  onAddSession: (session: any) => void;
  onDeleteSession: (id: string) => void;
  onUpdateSession: (updatedSession: any) => void;
  staffMembers?: any[];
}

type ViewType = 'day' | 'week' | 'month';

const CalendarAgenda: React.FC<CalendarAgendaProps> = ({ seus, serveis, sessions, bookings, onAddSession, onDeleteSession, onUpdateSession, staffMembers = [] }) => {
  const [view, setView] = useState<ViewType>('day');
  const [currentDate, setCurrentDate] = useState(new Date());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [sessionToDelete, setSessionToDelete] = useState<any | null>(null);
  
  const [viewingDetailSession, setViewingDetailSession] = useState<any | null>(null);
  const [isEditingSession, setIsEditingSession] = useState(false);
  
  const [selectedSedeId, setSelectedSedeId] = useState(seus[0]?.id || '');
  const [selectedServiceId, setSelectedServiceId] = useState(serveis[0]?.id || '');
  const [sessionDate, setSessionDate] = useState(new Date().toISOString().split('T')[0]);
  const [sessionStartTime, setSessionStartTime] = useState('14:00');
  const [sessionDuration, setSessionDuration] = useState(70);
  const [sessionColor, setSessionColor] = useState('gold');

  const [filterSede, setFilterSede] = useState<string>('all');

  const colorOptions = [
    { id: 'gold', class: 'gold-gradient', label: 'Prem Pro' },
    { id: 'black', class: 'bg-black text-prem-gold', label: 'Elite' },
    { id: 'blue', class: 'bg-blue-600 text-white', label: 'Academy' },
    { id: 'green', class: 'bg-emerald-500 text-white', label: 'Especial' },
  ];

  const hours = Array.from({ length: 9 }, (_, i) => i + 14); 

  const openEditModal = (session: any) => {
    setViewingDetailSession(session);
    setIsEditingSession(true);
    setSelectedSedeId(session.sedeId);
    setSelectedServiceId(session.serviceId);
    setSessionDate(new Date(session.startTime).toISOString().split('T')[0]);
    setSessionStartTime(new Date(session.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }));
    setSessionDuration(session.duration);
    setSessionColor(session.color || 'gold');
    setIsModalOpen(true);
  };

  const handleSaveSession = (e: React.FormEvent) => {
    e.preventDefault();
    const selectedService = serveis.find(s => s.id === selectedServiceId);
    const selectedSede = seus.find(s => s.id === selectedSedeId);
    const [h, m] = sessionStartTime.split(':').map(Number);
    const [y, mon, d] = sessionDate.split('-').map(Number);
    const startDateTime = new Date(y, mon - 1, d, h, m);

    const sessionData = {
      id: isEditingSession ? viewingDetailSession.id : `sess-${Math.floor(Math.random() * 10000)}`,
      name: selectedService?.name || 'Sessió Pro',
      serviceId: selectedServiceId,
      sedeId: selectedSedeId,
      startTime: startDateTime.toISOString(),
      duration: sessionDuration,
      category: selectedService?.category || 'Prem Pro',
      price: selectedService?.price || 35,
      location: selectedSede?.name || 'Seu Prem',
      color: sessionColor,
      coach: isEditingSession ? viewingDetailSession.coach : 'Pendent assignar',
      hasResources: true,
      attachedFiles: isEditingSession ? viewingDetailSession.attachedFiles : { pdf: null, videoUrl: null }
    };

    if (isEditingSession) {
      onUpdateSession(sessionData);
    } else {
      onAddSession(sessionData);
    }
    
    setIsModalOpen(false);
    setIsEditingSession(false);
    setViewingDetailSession(null);
  };

  const handleUpdateCoach = (coachName: string) => {
    if (!viewingDetailSession) return;
    const updated = { ...viewingDetailSession, coach: coachName };
    onUpdateSession(updated);
    setViewingDetailSession(updated);
  };

  const handlePrev = () => {
    const newDate = new Date(currentDate);
    if (view === 'day') newDate.setDate(newDate.getDate() - 1);
    else if (view === 'week') newDate.setDate(newDate.getDate() - 7);
    else if (view === 'month') newDate.setMonth(newDate.getMonth() - 1);
    setCurrentDate(newDate);
  };

  const handleNext = () => {
    const newDate = new Date(currentDate);
    if (view === 'day') newDate.setDate(newDate.getDate() + 1);
    else if (view === 'week') newDate.setDate(newDate.getDate() + 7);
    else if (view === 'month') newDate.setMonth(newDate.getMonth() + 1);
    setCurrentDate(newDate);
  };

  const formatTitle = () => {
    if (view === 'month') return currentDate.toLocaleString('ca-ES', { month: 'long', year: 'numeric' });
    if (view === 'day') return currentDate.toLocaleString('ca-ES', { day: 'numeric', month: 'short' });
    
    const startOfWeek = new Date(currentDate);
    startOfWeek.setDate(currentDate.getDate() - (currentDate.getDay() === 0 ? 6 : currentDate.getDay() - 1));
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);
    
    return `${startOfWeek.getDate()} - ${endOfWeek.getDate()} ${endOfWeek.toLocaleString('ca-ES', { month: 'short' })}`;
  };

  const upcomingSessions = useMemo(() => {
    return [...sessions]
      .filter(s => new Date(s.startTime) >= new Date())
      .sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime());
  }, [sessions]);

  const attendeesForSelectedSession = useMemo(() => {
    if (!viewingDetailSession) return [];
    return bookings.filter(b => b.sessionId === viewingDetailSession.id);
  }, [viewingDetailSession, bookings]);

  // VISTA DIA
  const renderDayView = () => (
    <div className="flex flex-col bg-white animate-in fade-in duration-300 overflow-hidden">
      <div className="grid grid-cols-[60px_1fr] border-b border-gray-100 shrink-0">
        <div className="bg-gray-50 border-r border-gray-100"></div>
        <div className="py-3 text-center bg-prem-gold/5">
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{currentDate.toLocaleString('ca-ES', { weekday: 'long' })}</p>
          <p className="text-xl font-black text-gray-900 leading-none mt-1">{currentDate.getDate()}</p>
        </div>
      </div>
      <div className="relative border-b border-gray-100">
        <div className="grid grid-cols-[60px_1fr] min-h-full">
          <div className="bg-gray-50/30 border-r border-gray-100 divide-y divide-gray-100">
            {hours.map(h => <div key={h} className="h-16 flex items-start justify-center pt-2 text-[10px] font-black text-gray-300">{h}:00</div>)}
          </div>
          <div className="relative divide-y divide-gray-100">
            {hours.map(h => <div key={h} className="h-16"></div>)}
            {sessions.filter(s => (filterSede === 'all' || s.sedeId === filterSede) && new Date(s.startTime).toDateString() === currentDate.toDateString()).map(session => {
              const sDate = new Date(session.startTime);
              const topPos = (sDate.getHours() - 14) * 64 + (sDate.getMinutes() / 60) * 64;
              const heightPos = (session.duration / 60) * 64;
              return (
                <div key={session.id} className="absolute left-0 w-full p-1 z-10" style={{ top: `${topPos}px`, height: `${heightPos}px` }}>
                  <div 
                    className={`h-full ${colorOptions.find(o => o.id === session.color)?.class || 'gold-gradient'} rounded-2xl p-3 shadow-lg flex flex-col justify-center overflow-hidden cursor-pointer border border-white/20 active:scale-[0.98] transition-all`}
                    onClick={() => setViewingDetailSession(session)}
                  >
                    <span className="text-[9px] font-black uppercase text-white/80">{sDate.getHours()}:${sDate.getMinutes().toString().padStart(2, '0')}h</span>
                    <h4 className="font-black text-white uppercase truncate text-xs leading-tight">{session.name}</h4>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );

  // VISTA SETMANA
  const renderWeekView = () => {
    const startOfWeek = new Date(currentDate);
    startOfWeek.setDate(currentDate.getDate() - (currentDate.getDay() === 0 ? 6 : currentDate.getDay() - 1));
    
    const weekDays = Array.from({ length: 7 }, (_, i) => {
      const d = new Date(startOfWeek);
      d.setDate(startOfWeek.getDate() + i);
      return d;
    });

    return (
      <div className="p-4 bg-white space-y-3 animate-in fade-in duration-300">
        {weekDays.map((day, i) => {
          const isToday = day.toDateString() === new Date().toDateString();
          const daySessions = sessions.filter(s => new Date(s.startTime).toDateString() === day.toDateString());
          
          return (
            <button 
              key={i} 
              onClick={() => { setCurrentDate(day); setView('day'); }}
              className={`w-full flex items-center justify-between p-4 rounded-2xl border-2 transition-all active:scale-[0.99] ${
                isToday ? 'border-prem-gold bg-prem-gold/5' : 'border-gray-50 bg-gray-50/30'
              }`}
            >
              <div className="flex items-center gap-4">
                <div className={`w-10 h-10 rounded-xl flex flex-col items-center justify-center font-black ${isToday ? 'gold-gradient text-white shadow-md' : 'bg-white text-gray-400'}`}>
                  <span className="text-[8px] uppercase">{day.toLocaleString('ca-ES', { weekday: 'short' })}</span>
                  <span className="text-sm leading-none">{day.getDate()}</span>
                </div>
                <div className="text-left">
                  <p className={`text-[10px] font-black uppercase tracking-widest ${isToday ? 'text-prem-gold' : 'text-gray-400'}`}>
                    {daySessions.length} Sessions
                  </p>
                </div>
              </div>
              <div className="flex -space-x-2">
                {daySessions.slice(0, 4).map((s, idx) => (
                  <div key={idx} className={`w-2.5 h-2.5 rounded-full border-2 border-white ${colorOptions.find(o => o.id === s.color)?.class || 'bg-prem-gold'}`} />
                ))}
              </div>
            </button>
          );
        })}
      </div>
    );
  };

  // VISTA MES
  const renderMonthView = () => {
    const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    const endOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
    const startDay = startOfMonth.getDay() === 0 ? 6 : startOfMonth.getDay() - 1;
    const days = [];
    
    for (let i = 0; i < startDay; i++) days.push(null);
    for (let i = 1; i <= endOfMonth.getDate(); i++) days.push(new Date(currentDate.getFullYear(), currentDate.getMonth(), i));

    return (
      <div className="p-4 bg-white animate-in fade-in duration-300 border-b border-gray-100">
        <div className="grid grid-cols-7 gap-1 mb-3">
          {['DL', 'DT', 'DC', 'DJ', 'DV', 'DS', 'DG'].map(d => (
            <div key={d} className="text-center text-[10px] font-black text-gray-300 py-2">{d}</div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-2">
          {days.map((day, i) => {
            if (!day) return <div key={i} className="aspect-square" />;
            const isToday = day.toDateString() === new Date().toDateString();
            const hasSessions = sessions.some(s => new Date(s.startTime).toDateString() === day.toDateString());
            
            return (
              <button 
                key={i} 
                onClick={() => { setCurrentDate(day); setView('day'); }}
                className={`aspect-square rounded-xl flex flex-col items-center justify-center relative transition-all active:scale-90 ${
                  isToday ? 'gold-gradient text-white shadow-lg' : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                }`}
              >
                <span className="text-[11px] font-black">{day.getDate()}</span>
                {hasSessions && !isToday && <div className="absolute bottom-1.5 w-1.5 h-1.5 bg-prem-gold rounded-full shadow-sm" />}
              </button>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col bg-gray-50 min-h-full">
      
      {/* HEADER AGENDA: STICKY NOMÉS SI HI HA ESPAI */}
      <div className="p-4 md:p-6 bg-white border-b border-gray-100 sticky top-0 z-30 shadow-sm shrink-0">
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div className="flex flex-col min-w-0">
              <h2 className="text-lg font-black text-gray-900 tracking-tighter uppercase leading-none truncate">{formatTitle()}</h2>
              <p className="text-[9px] font-black text-prem-gold uppercase tracking-widest mt-1">Grup de Treball Prem</p>
            </div>
            <div className="flex items-center gap-1 bg-gray-50 p-1 rounded-xl border border-gray-100 shrink-0">
               <button onClick={handlePrev} className="p-2 text-gray-400 hover:text-prem-gold active:scale-90 transition-all"><ChevronLeft size={18} /></button>
               <button onClick={handleNext} className="p-2 text-gray-400 hover:text-prem-gold active:scale-90 transition-all"><ChevronRight size={18} /></button>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex-1 flex items-center gap-1 bg-gray-100/50 p-1 rounded-xl border border-gray-100 overflow-hidden">
              {(['day', 'week', 'month'] as ViewType[]).map((v) => (
                <button 
                  key={v} 
                  onClick={() => setView(v)} 
                  className={`flex-1 py-2.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${view === v ? 'bg-white text-gray-900 shadow-md' : 'text-gray-400'}`}
                >
                  {v === 'day' ? 'Dia' : v === 'week' ? 'Setm' : 'Mes'}
                </button>
              ))}
            </div>
            <button 
              onClick={() => { setIsEditingSession(false); setViewingDetailSession(null); setIsModalOpen(true); }} 
              className="p-3 gold-gradient text-white rounded-xl shadow-xl shadow-prem-gold/20 active:scale-95 transition-all shrink-0"
            >
              <Plus size={20} />
            </button>
          </div>
        </div>
      </div>

      {/* CONTENIDOR PRINCIPAL DE L'AGENDA (SCROLLABLE GLOBAL) */}
      <div className="flex-1 overflow-visible">
        
        {/* VISTES DEL CALENDARI */}
        <div className="bg-white">
           {view === 'day' && renderDayView()}
           {view === 'week' && renderWeekView()}
           {view === 'month' && renderMonthView()}
        </div>

        {/* PRÒXIMES SESSIONS: SEMPRE ACCESSIBLE BAIXANT */}
        <div className="p-4 md:p-8 space-y-6 pb-32">
          <div className="flex items-center justify-between px-2">
             <div className="flex items-center gap-2">
                <CalendarDays size={18} className="text-prem-gold" />
                <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Pròximes Sessions</h3>
             </div>
             <div className="flex items-center gap-2 text-[9px] font-black text-prem-gold uppercase bg-prem-gold/5 px-3 py-1 rounded-full border border-prem-gold/10">
                <Clock size={12} /> Sync Online
             </div>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {upcomingSessions.length > 0 ? upcomingSessions.map((s) => {
              const date = new Date(s.startTime);
              const attendees = bookings.filter(b => b.sessionId === s.id).length;
              const maxCap = (serveis.find(srv => srv.id === s.serviceId)?.capacity || 6);
              const isFull = attendees >= maxCap;
              
              return (
                <div 
                  key={s.id} 
                  className="bg-white rounded-[32px] border border-gray-100 p-5 shadow-sm hover:shadow-xl transition-all group flex flex-col gap-4 relative overflow-hidden"
                >
                  <div className="flex justify-between items-start">
                     <div className="flex items-center gap-3">
                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-lg ${colorOptions.find(o => o.id === s.color)?.class || 'gold-gradient'}`}>
                           <Dumbbell size={20} />
                        </div>
                        <div>
                           <p className="text-[8px] font-black text-prem-gold uppercase tracking-widest mb-0.5">{s.location}</p>
                           <h4 className="font-black text-gray-900 uppercase tracking-tight text-sm leading-none">{s.name}</h4>
                        </div>
                     </div>
                     <div className="flex gap-2">
                        <button 
                          onClick={(e) => { e.stopPropagation(); openEditModal(s); }}
                          className="p-2.5 bg-gray-50 text-gray-400 hover:text-blue-500 hover:bg-white rounded-xl transition-all border border-transparent hover:border-gray-100 shadow-sm"
                        >
                           <Edit2 size={16} />
                        </button>
                        <button 
                          onClick={(e) => { e.stopPropagation(); setSessionToDelete(s); }}
                          className="p-2.5 bg-gray-50 text-gray-400 hover:text-red-500 hover:bg-white rounded-xl transition-all border border-transparent hover:border-gray-100 shadow-sm"
                        >
                           <Trash2 size={16} />
                        </button>
                     </div>
                  </div>

                  <div className="grid grid-cols-4 gap-2 py-4 border-y border-gray-50">
                     <div className="flex flex-col">
                        <span className="text-[8px] font-black text-gray-300 uppercase tracking-widest mb-1">Hora</span>
                        <span className="text-xs font-black text-gray-700">{date.getHours()}:${date.getMinutes().toString().padStart(2, '0')}h</span>
                     </div>
                     <div className="flex flex-col border-x border-gray-100 px-2">
                        <span className="text-[8px] font-black text-gray-300 uppercase tracking-widest mb-1">Data</span>
                        <span className="text-xs font-black text-gray-700">{date.toLocaleDateString('ca-ES', { day: '2-digit', month: 'short' })}</span>
                     </div>
                     <div className="flex flex-col border-r border-gray-100 px-2">
                        <span className="text-[8px] font-black text-gray-300 uppercase tracking-widest mb-1">Coach</span>
                        <span className="text-[9px] font-black text-prem-gold uppercase truncate">{s.coach || 'Pendent'}</span>
                     </div>
                     <div className="flex flex-col pl-2">
                        <span className="text-[8px] font-black text-gray-300 uppercase tracking-widest mb-1">Ocupació</span>
                        <div className="flex items-center gap-1.5">
                           <div className={`w-1.5 h-1.5 rounded-full ${isFull ? 'bg-red-500' : 'bg-green-500'}`}></div>
                           <span className={`text-xs font-black ${isFull ? 'text-red-600' : 'text-gray-900'}`}>{attendees}/{maxCap}</span>
                        </div>
                     </div>
                  </div>

                  <div className="flex gap-2">
                    <button 
                      onClick={() => setViewingDetailSession(s)}
                      className="flex-1 py-4 bg-gray-900 text-white font-black text-[10px] uppercase tracking-widest rounded-2xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-gray-900/10 active:scale-95"
                    >
                       <Users size={14} /> Atletes ({attendees})
                    </button>
                    <button 
                      onClick={() => setViewingDetailSession(s)}
                      className="flex-1 py-4 bg-white border border-gray-100 text-gray-400 font-black text-[10px] uppercase tracking-widest rounded-2xl transition-all flex items-center justify-center gap-2 hover:border-prem-gold hover:text-prem-gold active:scale-95"
                    >
                       <UserCog size={14} /> Gestionar Staff
                    </button>
                  </div>
                </div>
              );
            }) : (
              <div className="py-20 text-center bg-white rounded-[40px] border-2 border-dashed border-gray-100">
                 <CalendarIcon size={40} className="mx-auto text-gray-100 mb-4 opacity-50" />
                 <p className="text-gray-400 font-black uppercase text-[10px] tracking-[0.2em]">Cap sessió trobada</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* MODAL DETALL SESSIÓ */}
      {viewingDetailSession && !isEditingSession && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-300">
           <div className="bg-white w-full max-w-lg rounded-[40px] overflow-hidden shadow-2xl flex flex-col max-h-[85vh]">
              <div className="p-8 border-b border-gray-50 flex items-center justify-between bg-gray-50/40 shrink-0">
                 <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-2xl text-white shadow-xl flex items-center justify-center ${colorOptions.find(o => o.id === viewingDetailSession.color)?.class || 'gold-gradient'}`}>
                       <Dumbbell size={24} />
                    </div>
                    <div>
                       <h3 className="text-xl font-black text-gray-900 uppercase tracking-tighter leading-none mb-1">{viewingDetailSession.name}</h3>
                       <p className="text-[10px] font-black text-prem-gold uppercase tracking-widest">{viewingDetailSession.location}</p>
                    </div>
                 </div>
                 <button onClick={() => setViewingDetailSession(null)} className="p-2 bg-white border border-gray-100 rounded-xl text-gray-400 active:rotate-90 transition-all"><X size={20} /></button>
              </div>

              <div className="flex-1 overflow-y-auto no-scrollbar p-6 space-y-8">
                 {/* GESTIÓ STAFF */}
                 <div className="space-y-4">
                    <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2 px-1">
                       <UserCog size={16} className="text-prem-gold" /> Gestió del Staff
                    </h4>
                    <div className="p-5 bg-gray-50 rounded-[28px] border border-gray-100 space-y-4">
                       <div className="space-y-1">
                          <label className="text-[8px] font-black text-gray-400 uppercase px-1 tracking-widest">Coach Responsable</label>
                          <select 
                            value={viewingDetailSession.coach || ''} 
                            onChange={(e) => handleUpdateCoach(e.target.value)}
                            className="w-full bg-white border border-gray-100 rounded-xl px-4 py-3 text-xs font-bold text-gray-900 outline-none focus:ring-2 focus:ring-prem-gold/20 transition-all"
                          >
                             <option value="">Pendent d'assignar</option>
                             {staffMembers.map(s => (
                               <option key={s.id} value={s.name}>{s.name} ({s.role})</option>
                             ))}
                          </select>
                       </div>
                    </div>
                 </div>

                 {/* ATLETES APUNTATS */}
                 <div className="space-y-4">
                    <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2 px-1">
                       <Users size={16} className="text-prem-gold" /> Atletes al Grup ({attendeesForSelectedSession.length})
                    </h4>
                    <div className="grid grid-cols-1 gap-3">
                       {attendeesForSelectedSession.length > 0 ? attendeesForSelectedSession.map((booking: any) => (
                          <div key={booking.id} className="flex items-center justify-between p-5 bg-gray-50 rounded-[28px] border border-gray-100 group hover:bg-white hover:border-prem-gold/20 transition-all">
                             <div className="flex items-center gap-4">
                                <div className="w-12 h-12 gold-gradient rounded-2xl flex items-center justify-center text-white font-black text-xs shadow-md">
                                   {(booking.userName || 'U').substring(0, 2).toUpperCase()}
                                </div>
                                <div className="flex flex-col">
                                   <p className="text-sm font-black text-gray-900 uppercase tracking-tight">{booking.userName}</p>
                                   <p className="text-[8px] font-black text-gray-400 uppercase">Reserva Confirmada</p>
                                </div>
                             </div>
                             <div className="flex gap-2">
                                <button className="p-3 bg-white text-gray-300 hover:text-prem-gold rounded-xl shadow-sm border border-gray-100 active:scale-90"><Mail size={16} /></button>
                             </div>
                          </div>
                       )) : (
                         <div className="py-16 text-center text-gray-300 bg-gray-50/50 rounded-[32px] border-2 border-dashed border-gray-100">
                            <p className="text-[10px] font-black uppercase tracking-widest">Grup sense inscripcions</p>
                         </div>
                       )}
                    </div>
                 </div>
              </div>

              <div className="p-8 border-t border-gray-50 bg-gray-50/20 shrink-0">
                 <button onClick={() => setViewingDetailSession(null)} className="w-full py-5 bg-gray-900 text-white rounded-[24px] font-black text-[11px] uppercase tracking-widest shadow-xl active:scale-95 transition-all">Tancar Panell</button>
              </div>
           </div>
        </div>
      )}

      {/* MODAL CREAR / EDITAR SESSIÓ */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-lg rounded-[40px] overflow-hidden shadow-2xl animate-in zoom-in-95 duration-300 flex flex-col max-h-[90vh]">
            <div className="p-8 sm:p-10 overflow-y-auto no-scrollbar">
              <div className="flex justify-between items-center mb-10">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-gray-50 text-prem-gold rounded-2xl"><CalendarIcon size={24} /></div>
                  <h3 className="text-2xl font-black text-gray-900 uppercase tracking-tighter">
                    {isEditingSession ? 'Edició Sessió' : 'Nova Planificació'}
                  </h3>
                </div>
                <button onClick={() => setIsModalOpen(false)} className="p-2 text-gray-300 hover:text-gray-900"><X size={24} /></button>
              </div>
              <form className="space-y-6" onSubmit={handleSaveSession}>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-gray-400 px-1 tracking-widest">Sede Oficial</label>
                    <select value={selectedSedeId} onChange={(e) => setSelectedSedeId(e.target.value)} className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-5 py-4 text-sm font-bold text-gray-900 focus:ring-4 focus:ring-prem-gold/10 outline-none transition-all">
                      {seus.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-gray-400 px-1 tracking-widest">Pack de Tecnificació</label>
                    <select value={selectedServiceId} onChange={(e) => setSelectedServiceId(e.target.value)} className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-5 py-4 text-sm font-bold text-gray-900 focus:ring-4 focus:ring-prem-gold/10 outline-none transition-all">
                      {serveis.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                    </select>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase text-gray-400 px-1 tracking-widest">Dia</label>
                      <input type="date" value={sessionDate} onChange={(e) => setSessionDate(e.target.value)} className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-5 py-4 text-sm font-bold text-gray-900" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase text-gray-400 px-1 tracking-widest">Hora</label>
                      <input type="time" value={sessionStartTime} onChange={(e) => setSessionStartTime(e.target.value)} className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-5 py-4 text-sm font-bold text-gray-900" />
                    </div>
                  </div>
                  <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase text-gray-400 px-1 tracking-widest">Color del Grup</label>
                    <div className="flex gap-3">
                       {colorOptions.map(opt => (
                         <button 
                            key={opt.id}
                            type="button"
                            onClick={() => setSessionColor(opt.id)}
                            className={`flex-1 py-4 rounded-2xl border-2 transition-all ${sessionColor === opt.id ? 'border-prem-gold bg-prem-gold/5 shadow-md' : 'border-gray-100 bg-gray-50 grayscale opacity-40'}`}
                         >
                            <div className={`w-3 h-3 rounded-full mx-auto ${opt.class}`}></div>
                         </button>
                       ))}
                    </div>
                  </div>
                </div>
                <button type="submit" className="w-full py-6 gold-gradient text-white rounded-[24px] font-black text-[11px] uppercase tracking-widest shadow-xl shadow-prem-gold/20 active:scale-95 transition-all mt-4">
                   {isEditingSession ? 'Actualitzar Planificació' : 'Crear Sessió Ara'}
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* MODAL ELIMINAR */}
      {sessionToDelete && (
        <div className="fixed inset-0 z-[250] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-in fade-in duration-300">
          <div className="bg-white w-full max-sm rounded-[40px] p-10 text-center shadow-2xl">
            <div className="w-20 h-20 bg-red-50 text-red-500 rounded-3xl flex items-center justify-center mx-auto mb-8">
              <AlertTriangle size={40} />
            </div>
            <h3 className="text-2xl font-black text-gray-900 uppercase tracking-tighter mb-2">Eliminar?</h3>
            <p className="text-gray-400 text-sm font-medium mb-10 leading-relaxed italic">Aquesta acció esborrarà la sessió i notificarà als jugadors.</p>
            <div className="flex gap-4">
              <button onClick={() => setSessionToDelete(null)} className="flex-1 py-4 bg-gray-50 text-gray-400 rounded-2xl font-black text-[10px] uppercase tracking-widest">Enrere</button>
              <button onClick={() => { onDeleteSession(sessionToDelete.id); setSessionToDelete(null); }} className="flex-1 py-4 bg-red-500 text-white rounded-2xl font-black text-[10px] uppercase shadow-xl shadow-red-500/20 active:scale-95 transition-all">Eliminar</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default CalendarAgenda;