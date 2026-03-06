import React, { useState, useMemo } from 'react';
import { 
  Users, 
  TrendingUp, 
  Calendar, 
  MapPin, 
  AlertCircle, 
  Activity, 
  FileSpreadsheet, 
  Zap, 
  Target, 
  Plus, 
  Clock, 
  X, 
  BookOpen, 
  ChevronRight, 
  MessageSquare, 
  CheckCircle2, 
  Info,
  ShieldCheck,
  ClipboardList,
  BarChart3,
  Dumbbell,
  LayoutDashboard,
  ChevronLeft,
  Star
} from 'lucide-react';
import Buzon from './views/Buzon';
import { Sede, ViewType, User } from '../types';

interface CoordinationPanelProps {
  user: User;
  seus: Sede[];
  sessions?: any[];
  onAddSession?: (session: any) => void;
  onNavigate: (view: ViewType) => void;
  onAddNotification?: (notification: any) => void;
  registeredUsers?: User[];
}

const CoordinationPanel: React.FC<CoordinationPanelProps> = ({ 
  user,
  seus, 
  sessions = [], 
  onAddSession,
  onNavigate,
  onAddNotification,
  registeredUsers = []
}) => {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'calendar' | 'history' | 'messages' | 'attendance'>('dashboard');
  const [filterSede, setFilterSede] = useState('all');
  const [filterPeriod, setFilterPeriod] = useState<'week' | 'month' | 'quarter' | 'season'>('month');
  const [isSessionModalOpen, setIsSessionModalOpen] = useState(false);
  const [viewingSession, setViewingSession] = useState<any | null>(null);
  const [isGeneratingReport, setIsGeneratingReport] = useState(false);
  const [isRoadmapModalOpen, setIsRoadmapModalOpen] = useState(false);
  const [isAlertsModalOpen, setIsAlertsModalOpen] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [viewingPlayerAttendance, setViewingPlayerAttendance] = useState<string | null>(null);

  // Form states per a la nova sessió
  const [sessionName, setSessionName] = useState('');
  const [sessionSede, setSessionSede] = useState(seus[0]?.id || '');
  const [sessionTime, setSessionTime] = useState('17:00');
  const [sessionDate, setSessionDate] = useState(new Date().toISOString().split('T')[0]);
  const [sessionPlanning, setSessionPlanning] = useState('');

  // Filtrem properes sessions segons la seu seleccionada i el període
  const upcomingSessions = useMemo(() => {
    const now = new Date();
    const end = new Date();
    
    if (filterPeriod === 'week') end.setDate(now.getDate() + 7);
    else if (filterPeriod === 'month') end.setMonth(now.getMonth() + 1);
    else if (filterPeriod === 'quarter') end.setMonth(now.getMonth() + 3);
    else if (filterPeriod === 'season') end.setMonth(now.getMonth() + 6);

    return sessions
      .filter(s => {
        const matchesSede = filterSede === 'all' || s.sedeId === filterSede;
        const sDate = new Date(s.startTime);
        const matchesPeriod = sDate >= now && sDate <= end;
        return matchesSede && matchesPeriod;
      })
      .sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime())
      .slice(0, 6); // Mostrem fins a 6 sessions per a una millor navegació
  }, [sessions, filterSede, filterPeriod]);

  const pastSessions = useMemo(() => {
    const now = new Date();
    return sessions.filter(s => new Date(s.startTime) < now && s.status === 'completed');
  }, [sessions]);

  // Dades de coordinació esportiva (Sense dades econòmiques)
  const stats = useMemo(() => ({
    activePlayers: 142,
    totalRegistered: 165,
    retentionRate: 86.2,
    retentionTrend: 4.2,
    avgAttendance: 92.5,
    sessionsCount: sessions.length + 42, // Mock de sessions total del període
    activeAlerts: 3,
    playersAtRisk: [
      { id: 'p1', name: 'Marc Ros', lastBooking: 'Fa 12 dies', status: 'warning' },
      { id: 'p2', name: 'Carla Soler', lastBooking: 'Fa 18 dies', status: 'danger' },
      { id: 'p3', name: 'Oriol Mas', lastBooking: 'Fa 9 dies', status: 'warning' }
    ]
  }), [sessions]);

  const handleCreateSession = (e: React.FormEvent) => {
    e.preventDefault();
    if (!onAddSession) return;

    const [h, m] = sessionTime.split(':').map(Number);
    const [y, mon, d] = sessionDate.split('-').map(Number);
    const startDateTime = new Date(y, mon - 1, d, h, m);
    const selectedSede = seus.find(s => s.id === sessionSede);

    const newSession = {
      id: `sess-${Math.random().toString(36).substr(2, 9)}`,
      name: sessionName,
      sedeId: sessionSede,
      serviceId: '1',
      startTime: startDateTime.toISOString(),
      duration: 90,
      category: sessionName.toLowerCase().includes('elite') || sessionName.toLowerCase().includes('pro') ? 'Prem Pro' : 'Prem Academy',
      price: 35,
      location: selectedSede?.name || 'Seu Prem',
      planning: sessionPlanning,
      coach: 'Pendent assignar'
    };

    onAddSession(newSession);
    setIsSessionModalOpen(false);
    resetForm();
    alert("Sessió operativa penjada amb èxit.");
  };

  const resetForm = () => {
    setSessionName('');
    setSessionPlanning('');
    setSessionTime('17:00');
    setSessionDate(new Date().toISOString().split('T')[0]);
  };

  const handleExportCSV = () => {
    const csvContent = "data:text/csv;charset=utf-8,ID,Atleta,Estat_Assistència,Darrera_Sessió\n1,Marc Ros,Alerta,2024-05-01\n2,Carla Soler,Inactiu,2024-04-15";
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `coordinacio_esportiva_${filterPeriod}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const generateReport = () => {
    setIsGeneratingReport(true);
    setTimeout(() => {
      setIsGeneratingReport(false);
      alert("S'ha generat l'informe detallat d'assistència i rendiment correctament.");
    }, 2000);
  };

  return (
    <div className="space-y-10 animate-in fade-in duration-700 pb-20">
      {/* Header & Global Filters */}
      <section className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6">
        <div>
          <h1 className="text-4xl font-black text-gray-900 tracking-tighter uppercase leading-none">PANELL COORDINACIÓ</h1>
          <p className="text-gray-400 mt-2 italic font-medium tracking-tight">Supervisió de l'assistència, grups de treball i planificació esportiva.</p>
        </div>
        
        <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
          <button 
            onClick={() => setIsSessionModalOpen(true)}
            className="flex-1 lg:flex-none flex items-center justify-center gap-2 px-6 py-4 gold-gradient text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:scale-105 transition-all active:scale-95 shadow-xl shadow-prem-gold/20"
          >
            <Plus size={16} /> Nova Sessió Grup
          </button>

          <div className="flex items-center gap-2 bg-white px-4 py-4 rounded-2xl border border-gray-100 shadow-sm grow lg:grow-0">
            <MapPin size={16} className="text-prem-gold" />
            <select 
              value={filterSede}
              onChange={(e) => setFilterSede(e.target.value)}
              className="text-[10px] font-black uppercase text-gray-600 focus:outline-none bg-transparent cursor-pointer"
            >
              <option value="all">Totes les Seus</option>
              {seus.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
            </select>
          </div>

          <button 
            onClick={handleExportCSV}
            className="p-4 bg-gray-900 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-black transition-all active:scale-95 shadow-xl shadow-gray-900/10"
            title="Exportar Dades Assistència"
          >
            <FileSpreadsheet size={18} />
          </button>
        </div>
      </section>

      {/* Navigation & Period Selector */}
      <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center">
        {/* Tab Navigation */}
        <div className="flex bg-gray-100 p-1 rounded-2xl border border-gray-200 w-full lg:w-fit overflow-x-auto no-scrollbar">
           <button 
            onClick={() => setActiveTab('dashboard')}
            className={`flex items-center gap-2 px-4 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all ${activeTab === 'dashboard' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}
           >
             <LayoutDashboard size={14} /> Agenda
           </button>
           <button 
            onClick={() => setActiveTab('calendar')}
            className={`flex items-center gap-2 px-4 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all ${activeTab === 'calendar' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}
           >
             <Calendar size={14} /> Calendari
           </button>
           <button 
            onClick={() => setActiveTab('history')}
            className={`flex items-center gap-2 px-4 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all ${activeTab === 'history' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}
           >
             <Clock size={14} /> Historial
           </button>
           <button 
            onClick={() => setActiveTab('messages')}
            className={`flex items-center gap-2 px-4 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all ${activeTab === 'messages' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}
           >
             <MessageSquare size={14} /> Missatgeria
           </button>
           <button 
            onClick={() => setActiveTab('attendance')}
            className={`flex items-center gap-2 px-4 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all ${activeTab === 'attendance' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}
           >
             <Users size={14} /> Assistència
           </button>
        </div>

        {/* Period Selector Dropdown (Quadrant separat) */}
        {activeTab === 'dashboard' && (
          <div className="flex bg-gray-100 p-1 rounded-2xl border border-gray-200 w-full lg:w-fit">
            <div className="relative w-full lg:w-48">
              <select 
                value={filterPeriod}
                onChange={(e) => setFilterPeriod(e.target.value as any)}
                className="w-full appearance-none bg-white text-gray-900 px-6 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest shadow-sm border-none focus:ring-2 focus:ring-prem-gold/20 outline-none cursor-pointer pr-10"
              >
                <option value="week">Setmana</option>
                <option value="month">Mes</option>
                <option value="quarter">Trimestre</option>
                <option value="season">Temporada</option>
              </select>
              <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                <ChevronRight size={14} className="rotate-90" />
              </div>
            </div>
          </div>
        )}
      </div>

      {activeTab === 'dashboard' && (
        <>

      {/* Esportiu KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { icon: <Users />, label: 'Atletes Actius', val: stats.activePlayers, sub: `/ ${stats.totalRegistered}`, color: 'text-prem-gold' },
          { icon: <TrendingUp />, label: 'Taxa Continuïtat', val: `${stats.retentionRate}%`, sub: `+${stats.retentionTrend}%`, color: 'text-green-500' },
          { icon: <Activity />, label: 'Assistència Grups', val: `${stats.avgAttendance}%`, sub: 'Mitjana Període', color: 'text-blue-500' },
          { icon: <ClipboardList />, label: 'Sessions Realitzades', val: stats.sessionsCount, sub: 'GRUPS TANCATS', color: 'text-gray-900' }
        ].map((kpi, i) => (
          <div 
            key={i} 
            className="bg-white p-8 rounded-[36px] border border-gray-100 shadow-sm card-shadow relative overflow-hidden group cursor-pointer hover:border-prem-gold/20 transition-all"
            onClick={() => {
              if (i === 0) onNavigate(ViewType.ADMIN_PANEL);
              else if (i === 2) onNavigate(ViewType.COACH_PANEL);
              else alert(`Informe detallat: ${kpi.label}`);
            }}
          >
            <div className="relative z-10">
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                <span className={kpi.color}>{kpi.icon}</span> {kpi.label}
              </p>
              <div className="flex items-end gap-3">
                <span className="text-4xl font-black text-gray-900 leading-none">{kpi.val}</span>
                <span className={`text-[10px] font-bold mb-1 ${i === 1 ? 'text-green-500' : 'text-gray-300'}`}>{kpi.sub}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 space-y-8">
          {/* upcoming sessions section */}
          <div className="bg-white rounded-[40px] border border-gray-100 shadow-sm p-8 lg:p-10 card-shadow">
            <div className="flex items-center justify-between mb-8">
               <div className="flex items-center gap-3">
                  <div className="p-2 bg-prem-gold/10 rounded-lg text-prem-gold">
                     <Calendar size={18} />
                  </div>
                  <h2 className="text-xl font-black text-gray-900 uppercase tracking-tighter">Agenda Grups i Planificació</h2>
               </div>
               <button 
                onClick={() => onNavigate(ViewType.COACH_PANEL)}
                className="text-[10px] font-black text-prem-gold uppercase tracking-widest flex items-center gap-1 hover:gap-2 transition-all"
               >
                 Tota l'Agenda <ChevronRight size={14}/>
               </button>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
              {upcomingSessions.length > 0 ? upcomingSessions.map((session) => {
                const sDate = new Date(session.startTime);
                return (
                  <div 
                    key={session.id} 
                    onClick={() => setViewingSession(session)}
                    className="bg-gray-50/50 p-4 lg:p-6 rounded-[28px] lg:rounded-[32px] border border-gray-100 shadow-sm hover:shadow-md hover:bg-white hover:border-prem-gold/20 transition-all group cursor-pointer"
                  >
                    <div className="flex justify-between items-start mb-3">
                      <span className={`text-[7px] lg:text-[8px] font-black uppercase px-2 py-0.5 rounded ${session.category === 'Prem Pro' ? 'bg-black text-white' : 'gold-gradient text-white'}`}>
                        {session.category}
                      </span>
                      <div className="flex items-center gap-1 text-gray-400">
                         <MapPin size={8} className="text-prem-gold" />
                         <span className="text-[7px] lg:text-[8px] font-black uppercase">{session.location}</span>
                      </div>
                    </div>
                    <h3 className="text-sm lg:text-lg font-black text-gray-900 uppercase tracking-tight leading-tight mb-3 truncate group-hover:text-prem-gold transition-colors">{session.name}</h3>
                    <div className="flex items-center justify-between border-t border-gray-100 pt-3">
                       <div className="flex flex-col">
                          <p className="text-[8px] font-black text-gray-300 uppercase tracking-widest leading-none mb-1">Horari</p>
                          <p className="text-[10px] lg:text-xs font-bold text-gray-700">
                            {sDate.toLocaleDateString('ca-ES', { day: '2-digit', month: 'short' })} · {sDate.getHours()}:${sDate.getMinutes().toString().padStart(2, '0')}h
                          </p>
                       </div>
                       <div className="flex items-center gap-1 text-prem-gold opacity-0 group-hover:opacity-100 transition-all translate-x-1 group-hover:translate-x-0">
                          <span className="text-[8px] font-black uppercase tracking-widest">Detalls</span>
                          <ChevronRight size={12} />
                       </div>
                    </div>
                  </div>
                );
              }) : (
                <div className="col-span-full py-16 text-center bg-gray-50/30 rounded-[32px] border-2 border-dashed border-gray-100">
                   <p className="text-gray-300 font-black uppercase text-[10px] tracking-widest">Cap sessió activa per a aquesta seu</p>
                </div>
              )}
            </div>
          </div>

          {/* Retention Chart Placeholder */}
          <div className="bg-white rounded-[40px] border border-gray-100 shadow-sm p-10 card-shadow relative">
            <div className="flex items-center justify-between mb-12">
              <div>
                 <h3 className="text-xl font-black text-gray-900 uppercase tracking-tighter">Evolució Esportiva</h3>
                 <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest">Mètriques d'assistència i volum per {filterPeriod}</p>
              </div>
              <div className="flex gap-4">
                 <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-prem-gold"></div>
                    <span className="text-[9px] font-black text-gray-400 uppercase">Assistents</span>
                 </div>
                 <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-gray-200"></div>
                    <span className="text-[9px] font-black text-gray-400 uppercase">Inactius</span>
                 </div>
              </div>
            </div>
            <div className="h-48 bg-gray-50/50 rounded-3xl border border-gray-50 flex items-center justify-center relative group overflow-hidden">
               <BarChart3 size={48} className="text-gray-200 group-hover:text-prem-gold transition-colors duration-500" />
               <div className="absolute inset-0 flex items-center justify-center bg-white/40 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-all rounded-3xl">
                  <button 
                    onClick={generateReport}
                    className="px-6 py-3 bg-gray-900 text-white rounded-xl font-black text-[10px] uppercase tracking-widest shadow-xl active:scale-95"
                  >
                    {isGeneratingReport ? "Processant dades..." : "Generar Gràfica Detallada"}
                  </button>
               </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-4 flex flex-col gap-8">
          {/* Alerts Card */}
          <div className="bg-white rounded-[40px] border border-gray-100 shadow-sm p-10 card-shadow flex-1 flex flex-col">
             <div className="flex items-center gap-3 mb-8">
               <div className="p-3 bg-red-50 text-red-500 rounded-2xl shadow-sm">
                 <AlertCircle size={20} />
               </div>
               <div>
                 <h3 className="text-xl font-black text-gray-900 uppercase tracking-tighter">Alertes de Seguiment</h3>
                 <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest">Inactivitat detectada</p>
               </div>
             </div>
             <div className="space-y-4 flex-1">
               {stats.playersAtRisk.map(player => (
                 <div 
                    key={player.id} 
                    onClick={() => onNavigate(ViewType.BUZON)}
                    className="p-5 rounded-[24px] border border-gray-100 bg-gray-50/50 flex items-center justify-between group cursor-pointer hover:bg-white hover:border-prem-gold/20 hover:shadow-lg transition-all"
                  >
                   <div className="flex items-center gap-4">
                     <div className={`w-2.5 h-2.5 rounded-full ${player.status === 'danger' ? 'bg-red-500' : 'bg-orange-400'} animate-pulse shadow-sm`}></div>
                     <div className="flex flex-col">
                        <span className="text-xs font-black text-gray-900 uppercase tracking-tight">{player.name}</span>
                        <span className="text-[9px] font-bold text-gray-400 uppercase italic leading-none mt-0.5">{player.lastBooking}</span>
                     </div>
                   </div>
                   <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-gray-300 group-hover:text-prem-gold transition-all shadow-sm">
                      <MessageSquare size={16} />
                   </div>
                 </div>
               ))}
             </div>
             <button 
              onClick={() => setIsAlertsModalOpen(true)}
              className="w-full mt-10 py-4 bg-gray-50 text-gray-400 hover:bg-gray-900 hover:text-white rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all"
             >
               Gestionar Totes les Alertes
             </button>
          </div>

          <div className="bg-black text-white p-8 rounded-[40px] shadow-2xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-4 opacity-10 rotate-12 group-hover:scale-125 transition-transform duration-700 pointer-events-none">
                 <Target size={140} className="text-prem-gold" />
              </div>
              <div className="relative z-10">
                 <p className="text-[10px] font-black text-prem-gold uppercase tracking-widest mb-2">Objectius Esportius</p>
                 <h3 className="text-2xl font-black tracking-tighter uppercase mb-6">Taxa de Rendiment Grupal</h3>
                 <div className="flex items-end gap-3 mb-6">
                    <span className="text-5xl font-black leading-none">8.4</span>
                    <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest mb-1">Meta: 9.0</span>
                 </div>
                 <button 
                  onClick={() => setIsRoadmapModalOpen(true)}
                  className="w-full py-4 bg-white/10 hover:bg-white/20 border border-white/10 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all"
                 >
                   Veure Roadmap Esportiu
                 </button>
              </div>
          </div>
        </div>
      </div>
    </>
  )}

  {/* CALENDAR TAB */}
  {activeTab === 'calendar' && (
    <div className="bg-white p-6 rounded-[40px] border border-gray-100 shadow-xl animate-in fade-in duration-500">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-black text-gray-900 uppercase tracking-tighter">Calendari Global de Sessions</h2>
        <div className="flex gap-2 items-center">
          <button 
            onClick={() => {
              if (currentMonth === 0) {
                setCurrentMonth(11);
                setCurrentYear(currentYear - 1);
              } else {
                setCurrentMonth(currentMonth - 1);
              }
            }}
            className="p-1.5 hover:bg-gray-50 rounded-xl text-gray-400"
          >
            <ChevronLeft size={18} />
          </button>
          <span className="font-black text-xs uppercase tracking-widest px-3 py-1.5 min-w-[120px] text-center">
            {new Intl.DateTimeFormat('ca-ES', { month: 'long', year: 'numeric' }).format(new Date(currentYear, currentMonth))}
          </span>
          <button 
            onClick={() => {
              if (currentMonth === 11) {
                setCurrentMonth(0);
                setCurrentYear(currentYear + 1);
              } else {
                setCurrentMonth(currentMonth + 1);
              }
            }}
            className="p-1.5 hover:bg-gray-50 rounded-xl text-gray-400"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      </div>
      
      <div className="grid grid-cols-7 gap-2">
        {['Dl', 'Dt', 'Dc', 'Dj', 'Dv', 'Ds', 'Dg'].map(d => (
          <div key={d} className="text-center text-[9px] font-black text-gray-300 uppercase py-1">{d}</div>
        ))}
        {(() => {
          const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();
          const startingDay = firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1;
          const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
          const days = [];
          
          for (let i = 0; i < startingDay; i++) {
            days.push(<div key={`empty-${i}`} className="aspect-square"></div>);
          }
          
          for (let day = 1; day <= daysInMonth; day++) {
            const sessionsOnDay = sessions.filter(s => {
              const sDate = new Date(s.startTime);
              return sDate.getDate() === day && sDate.getMonth() === currentMonth && sDate.getFullYear() === currentYear;
            });
            const isToday = day === new Date().getDate() && currentMonth === new Date().getMonth() && currentYear === new Date().getFullYear();
            
            days.push(
              <div key={day} className={`aspect-square rounded-xl border p-1.5 flex flex-col justify-between transition-all ${isToday ? 'border-prem-gold bg-prem-gold/5' : 'border-gray-50 hover:border-gray-200'}`}>
                <span className={`text-[9px] font-black ${isToday ? 'text-prem-gold' : 'text-gray-400'}`}>{day}</span>
                {sessionsOnDay.length > 0 && (
                  <div className="space-y-0.5 overflow-hidden">
                    {sessionsOnDay.map(s => (
                      <div 
                        key={s.id} 
                        onClick={(e) => {
                          e.stopPropagation();
                          setViewingSession(s);
                        }}
                        className="bg-gray-900 text-white text-[7px] font-bold p-0.5 rounded truncate cursor-pointer hover:bg-prem-gold transition-colors"
                      >
                        {new Date(s.startTime).getHours()}:${new Date(s.startTime).getMinutes().toString().padStart(2, '0')} {s.name}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          }
          return days;
        })()}
      </div>
    </div>
  )}

  {/* HISTORY TAB */}
  {activeTab === 'history' && (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-black text-gray-900 uppercase tracking-tighter">Historial de Sessions Finalitzades</h2>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {pastSessions.length > 0 ? pastSessions.map(session => (
          <div key={session.id} className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6 hover:border-prem-gold/20 transition-all">
            <div className="flex gap-4 items-center">
              <div className="w-14 h-14 bg-gray-50 rounded-2xl flex items-center justify-center text-prem-gold shadow-inner">
                <CheckCircle2 size={28} />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[8px] font-black uppercase px-2 py-0.5 rounded bg-gray-100 text-gray-500">{session.category}</span>
                  <h3 className="font-black text-gray-900 uppercase">{session.name}</h3>
                </div>
                <div className="text-xs text-gray-400 flex items-center gap-3 font-medium">
                  <span className="flex items-center gap-1"><Calendar size={12} /> {new Date(session.startTime).toLocaleDateString('ca-ES')}</span>
                  <span className="flex items-center gap-1"><Clock size={12} /> {new Date(session.startTime).toLocaleTimeString('ca-ES', { hour: '2-digit', minute: '2-digit' })}h</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-8 border-l border-gray-50 pl-8">
              <div className="text-center">
                <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest mb-1">Assistència</p>
                <p className="text-lg font-black text-gray-900">
                  {session.attendance ? Object.values(session.attendance).filter(v => v === 'present').length : 'N/A'}
                </p>
              </div>
              <div className="text-center">
                <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest mb-1">Valoració</p>
                <div className="flex gap-0.5 text-prem-gold">
                  {[1,2,3,4,5].map(star => (
                    <Star key={star} size={10} fill={star <= (session.evaluation?.rating || 4) ? "currentColor" : "none"} />
                  ))}
                </div>
              </div>
              <button 
                onClick={() => setViewingSession(session)}
                className="px-6 py-3 bg-gray-900 text-white rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-prem-gold transition-colors"
              >
                Veure Informe
              </button>
            </div>
          </div>
        )) : (
          <div className="bg-gray-50/50 border-2 border-dashed border-gray-100 rounded-[40px] p-20 text-center">
            <Clock size={48} className="mx-auto text-gray-200 mb-4" />
            <p className="text-gray-400 font-black uppercase text-xs tracking-widest">No hi ha sessions finalitzades encara</p>
          </div>
        )}
      </div>
    </div>
  )}

  {/* MESSAGES TAB */}
  {activeTab === 'messages' && (
    <div className="h-[650px] bg-white rounded-[40px] border border-gray-100 overflow-hidden shadow-xl animate-in fade-in duration-500">
       <Buzon user={user} />
    </div>
  )}

  {/* ATTENDANCE TAB */}
  {activeTab === 'attendance' && (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-black text-gray-900 uppercase tracking-tighter">Control d'Assistència Global</h2>
          <p className="text-gray-400 text-sm font-medium italic">Seguiment detallat de la participació de tots els atletes.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {registeredUsers.filter(u => u.role === 'Famil').map(player => {
          const playerSessions = sessions.filter(s => s.status === 'completed' && s.attendance && s.attendance[player.name]);
          const presentCount = playerSessions.filter(s => s.attendance[player.name] === 'present').length;
          const absentCount = playerSessions.filter(s => s.attendance[player.name] === 'absent').length;
          const totalCompleted = playerSessions.length;
          const percentage = totalCompleted > 0 ? Math.round((presentCount / totalCompleted) * 100) : 0;

          return (
            <div key={player.id} className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6 hover:border-prem-gold/20 transition-all">
              <div className="flex gap-4 items-center">
                <div className="w-14 h-14 gold-gradient rounded-2xl flex items-center justify-center text-white font-black shadow-lg">
                  {player.initials || player.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div>
                  <h3 className="font-black text-gray-900 uppercase">{player.name}</h3>
                  <div className="flex items-center gap-3 mt-1">
                    <div className="flex items-center gap-1 text-[10px] font-bold text-gray-400 uppercase">
                      <CheckCircle2 size={12} className="text-green-500" /> {presentCount} Presents
                    </div>
                    <div className="flex items-center gap-1 text-[10px] font-bold text-gray-400 uppercase">
                      <X size={12} className="text-red-500" /> {absentCount} Absents
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-8 md:border-l md:border-gray-50 md:pl-8">
                <div className="text-center">
                  <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest mb-1">Ratio d'Assistència</p>
                  <div className="flex items-center gap-3">
                    <div className="w-32 h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div 
                        className={`h-full transition-all duration-1000 ${percentage > 80 ? 'bg-green-500' : percentage > 50 ? 'bg-prem-gold' : 'bg-red-500'}`}
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                    <span className="text-lg font-black text-gray-900">{percentage}%</span>
                  </div>
                </div>
                <button 
                  onClick={() => setViewingPlayerAttendance(player.name)}
                  className="px-6 py-3 bg-gray-50 text-gray-400 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-gray-900 hover:text-white transition-all"
                >
                  Veure Detalls
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  )}

      {/* MODAL DETALL SESSIÓ (PLANIFICACIÓ) */}
      {viewingSession && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-black/60 backdrop-blur-md animate-in fade-in duration-300">
           <div className="bg-white w-full max-w-xl rounded-[40px] overflow-hidden shadow-2xl animate-in zoom-in-95 duration-300 flex flex-col max-h-[85vh]">
              <div className="p-8 border-b border-gray-50 flex items-center justify-between bg-gray-50/40 shrink-0">
                 <div className="flex items-center gap-4">
                    <div className="p-3 bg-white text-prem-gold rounded-2xl shadow-sm border border-gray-100">
                       <BookOpen size={24} />
                    </div>
                    <div>
                       <h3 className="text-2xl font-black text-gray-900 uppercase tracking-tighter leading-none mb-1">{viewingSession.name}</h3>
                       <p className="text-[10px] font-black text-prem-gold uppercase tracking-widest">{viewingSession.location} · Planificació</p>
                    </div>
                 </div>
                 <button onClick={() => setViewingSession(null)} className="p-2 text-gray-400 hover:text-gray-900 transition-colors active:rotate-90 transition-all"><X size={24} /></button>
              </div>

              <div className="p-10 overflow-y-auto no-scrollbar flex-1 space-y-8">
                 <div className="bg-gray-50 p-6 rounded-3xl border border-gray-100">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4 flex items-center gap-2"><Info size={12} /> Objectius del grup</p>
                    <div className="text-sm font-medium text-gray-600 leading-relaxed italic whitespace-pre-wrap">
                       {viewingSession.planning || "Aquesta sessió encara no té una planificació detallada registrada al sistema."}
                    </div>
                 </div>

                 <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white p-5 rounded-2xl border border-gray-100 flex flex-col gap-1">
                       <span className="text-[9px] font-black text-gray-300 uppercase">Sessió per a</span>
                       <span className="text-sm font-bold text-gray-700">6 Atletes Max.</span>
                    </div>
                    <div className={`bg-white p-5 rounded-2xl border border-gray-100 flex flex-col gap-1`}>
                       <span className="text-[9px] font-black text-gray-300 uppercase">Responsable</span>
                       <span className="text-sm font-bold text-gray-700">{viewingSession.coach || 'Pendent assignar'}</span>
                    </div>
                 </div>
                 
                 <div className="p-6 bg-prem-gold/5 rounded-[32px] border border-prem-gold/10 flex items-center gap-4">
                    <div className="w-10 h-10 gold-gradient rounded-xl flex items-center justify-center text-white shrink-0 shadow-md">
                       <ShieldCheck size={20} />
                    </div>
                    <p className="text-[9px] font-bold text-gray-500 uppercase leading-relaxed tracking-tight">
                       La planificació tècnica d'aquesta sessió ha estat validada per l'equip de coordinació esportiva de Prem Academy.
                    </p>
                 </div>
              </div>

              <div className="p-8 border-t border-gray-50 bg-gray-50/20 shrink-0">
                 <button 
                  onClick={() => setViewingSession(null)}
                  className="w-full py-5 gold-gradient text-white rounded-3xl font-black text-xs uppercase tracking-widest shadow-xl shadow-prem-gold/20 active:scale-95 transition-all"
                >
                  Entès, Tancar
                </button>
              </div>
           </div>
        </div>
      )}

      {/* MODAL PENJAR SESSIÓ */}
      {isSessionModalOpen && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-6 bg-black/40 backdrop-blur-md animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-lg rounded-[40px] overflow-hidden shadow-2xl animate-in zoom-in-95 duration-300">
            <div className="p-10 max-h-[90vh] overflow-y-auto no-scrollbar">
              <div className="flex justify-between items-center mb-10">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-gray-50 text-prem-gold rounded-2xl border border-gray-100 shadow-sm">
                    <Dumbbell size={24} />
                  </div>
                  <h3 className="text-2xl font-black text-gray-900 uppercase tracking-tighter">
                    Planificar Sessió
                  </h3>
                </div>
                <button onClick={() => { setIsSessionModalOpen(false); resetForm(); }} className="p-2 text-gray-300 hover:text-gray-900 transition-colors"><X size={24} /></button>
              </div>
              
              <form className="space-y-6" onSubmit={handleCreateSession}>
                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest px-1">Títol de la Sessió</label>
                  <input 
                    type="text" 
                    required 
                    value={sessionName}
                    onChange={(e) => setSessionName(e.target.value)}
                    placeholder="Ex: Tecnificació U12 - Control Orientat" 
                    className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-5 py-4 text-sm font-bold text-gray-900 focus:outline-none focus:ring-4 focus:ring-prem-gold/10" 
                  />
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest px-1">Seu Oficial</label>
                    <div className="relative">
                      <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={16} />
                      <select 
                        value={sessionSede}
                        onChange={(e) => setSessionSede(e.target.value)}
                        className="w-full bg-gray-50 border border-gray-100 rounded-2xl pl-12 pr-4 py-4 text-sm font-bold text-gray-900 focus:outline-none focus:ring-4 focus:ring-prem-gold/10"
                      >
                        {seus.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                      </select>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest px-1">Hora d'Inici</label>
                    <div className="relative">
                      <Clock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={16} />
                      <input 
                        type="time" 
                        required 
                        value={sessionTime}
                        onChange={(e) => setSessionTime(e.target.value)}
                        className="w-full bg-gray-50 border border-gray-100 rounded-2xl pl-12 pr-4 py-4 text-sm font-bold text-gray-900 focus:outline-none focus:ring-4 focus:ring-prem-gold/10" 
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest px-1">Data</label>
                  <input 
                    type="date" 
                    required 
                    value={sessionDate}
                    onChange={(e) => setSessionDate(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-5 py-4 text-sm font-bold text-gray-900 focus:outline-none focus:ring-4 focus:ring-prem-gold/10" 
                  />
                </div>

                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest px-1 flex items-center gap-2">
                    <BookOpen size={12} className="text-prem-gold" /> Planificació de l'Entrenament
                  </label>
                  <textarea 
                    required
                    value={sessionPlanning}
                    onChange={(e) => setSessionPlanning(e.target.value)}
                    placeholder="Objectius, exercicis principals i punts tàctics..."
                    className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-5 py-4 text-sm font-bold text-gray-900 focus:outline-none focus:ring-4 focus:ring-prem-gold/10 min-h-[120px] resize-none"
                  />
                </div>

                <button 
                  type="submit"
                  className="w-full py-6 gold-gradient text-white rounded-[24px] font-black text-sm uppercase tracking-widest shadow-2xl shadow-prem-gold/20 active:scale-[0.98] transition-all flex items-center justify-center gap-3 mt-4"
                >
                  Confirmar i Publicar Sessió
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* ROADMAP MODAL */}
      {isRoadmapModalOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-2xl rounded-[40px] overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
            <div className="p-8 border-b border-gray-50 flex items-center justify-between bg-gray-50/40 shrink-0">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-white text-prem-gold rounded-2xl shadow-sm border border-gray-100">
                  <Target size={24} />
                </div>
                <div>
                  <h3 className="text-xl font-black text-gray-900 uppercase tracking-tighter">Roadmap Esportiu Q3/Q4</h3>
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Objectius i fites de l'acadèmia.</p>
                </div>
              </div>
              <button onClick={() => setIsRoadmapModalOpen(false)} className="p-2 text-gray-400 hover:text-gray-900 transition-colors"><X size={24} /></button>
            </div>
            <div className="p-8 overflow-y-auto no-scrollbar space-y-8">
              {[
                { title: 'Fase 1: Consolidació Tècnica', desc: 'Implementació del nou model de control orientat en totes les seus.', status: 'Completat', date: 'Setembre' },
                { title: 'Fase 2: Expansió Performance', desc: 'Obertura de grups d\'elit a les seus de Girona i Tarragona.', status: 'En curs', date: 'Octubre' },
                { title: 'Fase 3: Digitalització Scout', desc: 'Llançament de la plataforma de seguiment individualitzat per a famílies.', status: 'Pendent', date: 'Novembre' },
                { title: 'Fase 4: Prem Cup Winter', desc: 'Torneig intern de cloenda del primer trimestre.', status: 'Pendent', date: 'Desembre' }
              ].map((item, i) => (
                <div key={i} className="flex gap-6 relative">
                  {i !== 3 && <div className="absolute left-[15px] top-10 bottom-[-32px] w-0.5 bg-gray-100"></div>}
                  <div className={`w-8 h-8 rounded-full shrink-0 flex items-center justify-center font-black text-[10px] ${item.status === 'Completat' ? 'bg-green-500 text-white' : item.status === 'En curs' ? 'bg-prem-gold text-white animate-pulse' : 'bg-gray-100 text-gray-400'}`}>
                    {i + 1}
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-3">
                      <h4 className="font-black text-gray-900 uppercase text-sm tracking-tight">{item.title}</h4>
                      <span className={`text-[8px] font-black uppercase px-2 py-0.5 rounded ${item.status === 'Completat' ? 'bg-green-100 text-green-700' : item.status === 'En curs' ? 'bg-prem-gold/10 text-prem-gold' : 'bg-gray-100 text-gray-400'}`}>{item.status}</span>
                    </div>
                    <p className="text-xs text-gray-500 font-medium">{item.desc}</p>
                    <p className="text-[9px] font-black text-gray-300 uppercase tracking-widest pt-1">{item.date}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="p-8 border-t border-gray-50 bg-gray-50/20">
              <button onClick={() => setIsRoadmapModalOpen(false)} className="w-full py-4 bg-gray-900 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl active:scale-95 transition-all">Tancar Roadmap</button>
            </div>
          </div>
        </div>
      )}

      {/* ALERTS MANAGEMENT MODAL */}
      {isAlertsModalOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-lg rounded-[40px] overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
            <div className="p-8 border-b border-gray-50 flex items-center justify-between bg-gray-50/40 shrink-0">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-red-50 text-red-500 rounded-2xl shadow-sm border border-red-100">
                  <AlertCircle size={24} />
                </div>
                <div>
                  <h3 className="text-xl font-black text-gray-900 uppercase tracking-tighter">Gestió d'Alertes</h3>
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Accions massives per a atletes en risc.</p>
                </div>
              </div>
              <button onClick={() => setIsAlertsModalOpen(false)} className="p-2 text-gray-400 hover:text-gray-900 transition-colors"><X size={24} /></button>
            </div>
            <div className="p-8 space-y-6">
              <div className="p-6 bg-red-50 rounded-3xl border border-red-100">
                <p className="text-xs font-bold text-red-700 leading-relaxed">
                  S'han detectat <span className="font-black">{stats.playersAtRisk.length} atletes</span> amb més de 10 dies d'inactivitat. Vols enviar un recordatori massiu als seus tutors?
                </p>
              </div>
              <div className="space-y-3">
                {stats.playersAtRisk.map(p => (
                  <div key={p.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl border border-gray-100">
                    <span className="text-[10px] font-black text-gray-700 uppercase">{p.name}</span>
                    <span className="text-[9px] font-bold text-gray-400 uppercase">{p.lastBooking}</span>
                  </div>
                ))}
              </div>
              <button 
                onClick={() => {
                  if (onAddNotification) {
                    stats.playersAtRisk.forEach(p => {
                      onAddNotification({
                        title: 'T\'enyorem a Prem Academy!',
                        message: `Hola! Hem vist que fa dies que no vens a entrenar. T'esperem a la propera sessió!`,
                        type: 'info',
                        userId: 'all' // In a real app, this would be the specific tutor ID
                      });
                    });
                    alert("Notificacions enviades correctament als tutors.");
                    setIsAlertsModalOpen(false);
                  }
                }}
                className="w-full py-5 bg-red-500 text-white rounded-2xl font-black text-sm uppercase tracking-widest shadow-xl shadow-red-500/20 active:scale-95 transition-all"
              >
                Enviar Recordatori Massiu
              </button>
            </div>
          </div>
        </div>
      )}
      {/* MODAL ASSISTÈNCIA DETALLADA JUGADOR */}
      {viewingPlayerAttendance && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-black/60 backdrop-blur-md animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-2xl rounded-[40px] overflow-hidden shadow-2xl animate-in zoom-in-95 duration-300 flex flex-col max-h-[85vh]">
            <div className="p-8 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 gold-gradient rounded-2xl flex items-center justify-center text-white text-xl font-black shadow-lg">
                  {viewingPlayerAttendance.split(' ').map(n => n[0]).join('')}
                </div>
                <div>
                  <h3 className="text-2xl font-black text-gray-900 uppercase tracking-tighter">{viewingPlayerAttendance}</h3>
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Historial d'Assistència</p>
                </div>
              </div>
              <button 
                onClick={() => setViewingPlayerAttendance(null)}
                className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-gray-400 hover:text-gray-900 transition-all shadow-sm border border-gray-100"
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="p-8 overflow-y-auto">
              <div className="space-y-4">
                {sessions.filter(s => s.status === 'completed' && s.attendance && s.attendance[viewingPlayerAttendance]).map(session => (
                  <div key={session.id} className="flex items-center justify-between p-4 rounded-2xl border border-gray-50 bg-gray-50/30">
                    <div className="flex items-center gap-4">
                      <div className={`w-3 h-3 rounded-full ${session.attendance[viewingPlayerAttendance] === 'present' ? 'bg-green-500' : 'bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.3)]'}`}></div>
                      <div>
                        <p className="text-sm font-black text-gray-900 uppercase">{session.name}</p>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{new Date(session.startTime).toLocaleDateString('ca-ES')}</p>
                      </div>
                    </div>
                    <span className={`text-[10px] font-black uppercase px-3 py-1 rounded-full ${session.attendance[viewingPlayerAttendance] === 'present' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                      {session.attendance[viewingPlayerAttendance] === 'present' ? 'Present' : 'Absent'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CoordinationPanel;