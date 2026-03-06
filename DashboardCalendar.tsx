
import React, { useState } from 'react';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, Trophy, X, MapPin, Clock, Zap } from 'lucide-react';

interface DashboardCalendarProps {
  t: (key: any) => string;
  bookings: any[];
  sessions: any[];
  onReserve: (session: any) => void;
}

const DashboardCalendar: React.FC<DashboardCalendarProps> = ({ t, bookings, sessions, onReserve }) => {
  const [selectedDayEvents, setSelectedDayEvents] = useState<any[] | null>(null);
  const [selectedDateLabel, setSelectedDateLabel] = useState<string>('');

  const now = new Date();
  const today = now.getDate();
  const currentMonthIndex = now.getMonth();
  const currentYear = now.getFullYear();
  
  const currentMonthName = now.toLocaleString('es-ES', { month: 'long', year: 'numeric' });
  const todayFullName = now.toLocaleString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' });

  const daysInMonth = new Date(currentYear, currentMonthIndex + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentYear, currentMonthIndex, 1).getDay();
  const startingDay = firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1;

  const daysOfWeek = ['L', 'M', 'X', 'J', 'V', 'S', 'D'];
  
  const reservedDaysMap = [...bookings, ...sessions].reduce((acc: any, b) => {
    const bDate = new Date(b.date || b.startTime);
    if (bDate.getMonth() === currentMonthIndex && bDate.getFullYear() === currentYear) {
      const d = bDate.getDate();
      if (!acc[d]) acc[d] = [];
      // Check if this session is already booked to avoid duplicates and mark it
      const isBooked = bookings.some(book => book.sessionId === (b.sessionId || b.id));
      acc[d].push({ ...b, isBooked });
    }
    return acc;
  }, {});

  const handleDayClick = (day: number) => {
    const dayEvents = reservedDaysMap[day];
    if (dayEvents && dayEvents.length > 0) {
      const dateObj = new Date(currentYear, currentMonthIndex, day);
      setSelectedDateLabel(dateObj.toLocaleString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' }));
      setSelectedDayEvents(dayEvents);
    }
  };

  const sortedBookings = [...bookings].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  const nextBooking = sortedBookings.find(b => new Date(b.date).getTime() >= new Date(currentYear, currentMonthIndex, today).getTime());
  const nextDateStr = nextBooking ? new Date(nextBooking.date).toLocaleDateString('es-ES', { day: 'numeric', month: 'long' }) : null;

  const sessionsToday = [...bookings, ...sessions].filter(b => {
    const bDate = new Date(b.date || b.startTime);
    return bDate.getDate() === today && bDate.getMonth() === currentMonthIndex && bDate.getFullYear() === currentYear;
  }).map(s => ({
    ...s,
    isBooked: bookings.some(book => book.sessionId === (s.sessionId || s.id))
  }));
  
  const days = [];
  for (let i = 0; i < startingDay; i++) {
    days.push({ value: null });
  }
  for (let i = 1; i <= daysInMonth; i++) {
    days.push({ value: i });
  }

  return (
    <div className="relative">
      <div className="bg-white rounded-[24px] md:rounded-3xl p-5 md:p-8 shadow-lg border border-gray-100 grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-10">
        <div className="lg:col-span-1">
          <div className="flex items-center justify-between mb-4 md:mb-6">
            <h3 className="font-black text-gray-900 uppercase tracking-tighter text-base md:text-lg capitalize">{currentMonthName}</h3>
            <div className="flex gap-2">
              <button className="p-1.5 hover:bg-gray-50 rounded-lg text-gray-400"><ChevronLeft size={18} /></button>
              <button className="p-1.5 hover:bg-gray-50 rounded-lg text-gray-400"><ChevronRight size={18} /></button>
            </div>
          </div>
          
          <div className="grid grid-cols-7 gap-1 text-center mb-2">
            {daysOfWeek.map(d => (
              <span key={d} className="text-[10px] font-black text-gray-300 uppercase py-2">{d}</span>
            ))}
          </div>
          
          <div className="grid grid-cols-7 gap-1">
            {days.map((day, idx) => {
              const isToday = day.value === today;
              const hasEvents = day.value !== null && reservedDaysMap[day.value];
              
              return (
                <div 
                  key={idx} 
                  onClick={() => day.value && handleDayClick(day.value)}
                  className={`aspect-square flex flex-col items-center justify-center text-[10px] font-black rounded-xl relative transition-all
                    ${day.value === null ? '' : 'hover:bg-gray-50 cursor-pointer'}
                    ${isToday ? 'gold-gradient text-white shadow-md' : 'text-gray-600'}
                    ${hasEvents ? 'ring-1 ring-prem-gold/20' : ''}
                  `}
                >
                  {day.value}
                  {hasEvents && !isToday && (
                    <span className="absolute bottom-1.5 w-1.5 h-1.5 bg-prem-gold rounded-full shadow-sm border border-white"></span>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <div className="lg:col-span-2 border-l border-gray-50 pl-0 lg:pl-10">
          <div className="flex items-center justify-between mb-6 md:mb-8">
            <div>
              <h3 className="text-lg md:text-xl font-black text-gray-900 uppercase tracking-tighter flex items-center gap-3">
                <CalendarIcon className="text-prem-gold" size={18} md:size={20} /> {t('cal_today')}
              </h3>
              <p className="text-gray-400 text-[10px] md:text-xs font-bold uppercase tracking-widest mt-0.5 md:mt-1 capitalize">{todayFullName}</p>
            </div>
            <span className="bg-gray-50 text-prem-gold font-black px-2.5 py-1 rounded-full text-[9px] md:text-[10px] uppercase tracking-widest border border-gray-100">
              {sessionsToday.length} Sesión{sessionsToday.length !== 1 ? 'es' : ''} hoy
            </span>
          </div>

          <div className="space-y-3 md:space-y-4">
            {sessionsToday.length > 0 ? sessionsToday.map((session, sidx) => (
              <div key={session.id || sidx} className="bg-gray-50/50 border border-gray-100 p-4 md:p-6 rounded-2xl flex items-center justify-between group hover:border-prem-gold/20 transition-all">
                <div className="flex items-center gap-4 md:gap-6">
                  <div className="w-12 h-12 md:w-14 md:h-14 gold-gradient rounded-xl md:rounded-2xl flex items-center justify-center text-white shadow-lg">
                    <Trophy size={20} md:size={24} />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-0.5 md:mb-1">
                      <span className="text-[8px] md:text-[9px] font-black uppercase gold-gradient text-white px-1 py-0.5 rounded">{session.category}</span>
                      <h4 className="font-black text-gray-900 text-base md:text-lg">{session.name}</h4>
                    </div>
                    <p className="text-gray-400 text-xs font-bold flex items-center gap-2">
                      <span>{session.time || new Date(session.startTime).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}</span>
                      <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                      <span>Sede {session.location}</span>
                    </p>
                  </div>
                </div>
                {session.isBooked ? (
                  <button className="gold-gradient text-white px-3 py-1.5 md:px-4 md:py-2 rounded-lg md:rounded-xl text-[9px] md:text-[10px] font-black uppercase tracking-widest shadow-md hover:scale-105 active:scale-95 transition-all">
                    {t('cal_tasks')}
                  </button>
                ) : (
                  <button 
                    onClick={() => onReserve(session)}
                    className="bg-black text-white px-3 py-1.5 md:px-4 md:py-2 rounded-lg md:rounded-xl text-[9px] md:text-[10px] font-black uppercase tracking-widest shadow-md hover:scale-105 active:scale-95 transition-all"
                  >
                    Reservar
                  </button>
                )}
              </div>
            )) : (
              <div className="bg-gray-50/30 border border-dashed border-gray-200 p-6 md:p-8 rounded-2xl text-center">
                <p className="text-gray-400 font-bold uppercase text-[9px] md:text-[10px] tracking-widest">No tienes sesiones programadas para hoy</p>
              </div>
            )}

            <div className="p-4 md:p-6 border border-dashed border-gray-200 rounded-2xl flex items-center justify-between">
              <div className="flex items-center gap-3 md:gap-4 text-gray-300">
                <div className="w-8 h-8 md:w-10 md:h-10 border border-gray-100 rounded-full flex items-center justify-center">
                  <CalendarIcon size={14} md:size={16} />
                </div>
                <p className="text-xs md:text-sm font-bold italic tracking-tight">
                  {nextDateStr ? `${t('cal_next_hint')} ${nextDateStr}...` : 'No hay próximas sesiones programadas.'}
                </p>
              </div>
              <button className="text-gray-300 hover:text-prem-gold text-[9px] md:text-[10px] font-black uppercase tracking-widest">
                {t('cal_manage')}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mini Ventana Emergente (Detalle de Sesiones) */}
      {selectedDayEvents && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-md rounded-[32px] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
            <div className="p-8 border-b border-gray-50 flex items-center justify-between bg-gray-50/50">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white rounded-xl text-prem-gold shadow-sm">
                  <CalendarIcon size={20} />
                </div>
                <div>
                  <h3 className="text-xl font-black text-gray-900 uppercase tracking-tighter">Detalles del Día</h3>
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest capitalize">{selectedDateLabel}</p>
                </div>
              </div>
              <button 
                onClick={() => setSelectedDayEvents(null)}
                className="p-2 text-gray-300 hover:text-gray-900 transition-colors"
              >
                <X size={24} />
              </button>
            </div>
            
            <div className="p-8 space-y-4 max-h-[400px] overflow-y-auto no-scrollbar">
              {selectedDayEvents.map((event, idx) => (
                <div key={idx} className="bg-white p-5 border border-gray-100 rounded-2xl shadow-sm hover:border-prem-gold/30 transition-all">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-[9px] font-black uppercase gold-gradient text-white px-2 py-1 rounded-md">{event.category}</span>
                    {event.isBooked ? (
                      <span className="text-[9px] font-black uppercase bg-green-50 text-green-600 px-2 py-1 rounded-md border border-green-100">Reservat</span>
                    ) : (
                      <span className="text-xs font-black text-prem-gold">{event.cost || event.price} Prems</span>
                    )}
                  </div>
                  <h4 className="text-lg font-black text-gray-900 mb-4">{event.name}</h4>
                  <div className="flex items-center justify-between">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex items-center gap-2 text-gray-400">
                        <Clock size={14} className="text-prem-gold" />
                        <span className="text-xs font-bold">{event.time || new Date(event.startTime).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}h</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-400">
                        <MapPin size={14} className="text-prem-gold" />
                        <span className="text-xs font-bold truncate">{event.location}</span>
                      </div>
                    </div>
                    {!event.isBooked && (
                      <button 
                        onClick={() => {
                          setSelectedDayEvents(null);
                          onReserve(event);
                        }}
                        className="gold-gradient text-white px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg active:scale-95 transition-all"
                      >
                        Reservar
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className="p-8 bg-gray-50/50 border-t border-gray-50">
              <button 
                onClick={() => setSelectedDayEvents(null)}
                className="w-full py-4 gold-gradient text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-prem-gold/20 active:scale-95 transition-all"
              >
                Entendido
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardCalendar;
