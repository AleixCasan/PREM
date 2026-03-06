import React, { useState, useMemo } from 'react';
import { 
  TrendingUp, 
  Clock, 
  UserCheck, 
  Users, 
  ChevronRight, 
  FileText, 
  X, 
  CheckCircle2, 
  Calendar, 
  BookOpen, 
  AlertTriangle,
  MessageSquare,
  LayoutDashboard,
  Star,
  Zap,
  Smile,
  AlertCircle,
  ChevronLeft,
  ShieldCheck
} from 'lucide-react';
import Buzon from './views/Buzon';
import { User } from '../types';

interface CoachPanelProps {
  sessions?: any[];
  tasks?: any[];
  onUpdateSession?: (session: any) => void;
}

interface EvaluationData {
  rating: number;
  intensity: 'Baja' | 'Media' | 'Alta' | '';
  attitude: 'BAJA' | 'BUENA' | 'EXCELENTE' | '';
  objectives: 'No alcanzado' | 'Parcial' | 'Alcanzado' | 'Superado' | '';
  positiveAspects: string;
  improveAspects: string;
  highlightedPlayers: string[];
  hasIncidents: boolean;
  incidentDetails: string;
}

const CoachPanel: React.FC<CoachPanelProps> = ({ sessions = [], tasks = [], onUpdateSession }) => {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'calendar' | 'history' | 'messages' | 'attendance'>('dashboard');
  const [selectedSessionId, setSelectedSessionId] = useState<string | null>(null);
  const [isFinishing, setIsFinishing] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [viewingSession, setViewingSession] = useState<any | null>(null);
  const [viewingPlayerAttendance, setViewingPlayerAttendance] = useState<string | null>(null);
  
  const coachId = 'coach-1'; // Mock current coach ID
  
  const coachSessions = useMemo(() => 
    sessions.filter(s => s.coachId === coachId),
  [sessions, coachId]);

  const [attendance, setAttendance] = useState<Record<string, 'present' | 'absent'>>({});
  const [evaluation, setEvaluation] = useState<EvaluationData>({
    rating: 0,
    intensity: '',
    attitude: '',
    objectives: '',
    positiveAspects: '',
    improveAspects: '',
    highlightedPlayers: [],
    hasIncidents: false,
    incidentDetails: ''
  });

  const todaysSessions = useMemo(() => {
    const todayStr = new Date().toDateString();
    return coachSessions.filter(s => new Date(s.startTime).toDateString() === todayStr);
  }, [coachSessions]);

  const pastSessions = useMemo(() => {
    const now = new Date();
    return coachSessions.filter(s => new Date(s.startTime) < now && s.status === 'completed');
  }, [coachSessions]);

  const futureSessions = useMemo(() => {
    const now = new Date();
    return coachSessions.filter(s => new Date(s.startTime) > now);
  }, [coachSessions]);

  const currentSession = useMemo(() => 
    todaysSessions.find(s => s.id === selectedSessionId), 
  [todaysSessions, selectedSessionId]);

  const mockPlayers = ['Joan Vila', 'Marc Soler', 'Pau Comas', 'Lluc Roca', 'Sara Mas', 'Enric R.'];

  const markAttendance = (playerName: string, status: 'present' | 'absent') => {
    setAttendance(prev => ({
      ...prev,
      [playerName]: status
    }));
  };

  const toggleHighlightedPlayer = (name: string) => {
    setEvaluation(prev => ({
      ...prev,
      highlightedPlayers: prev.highlightedPlayers.includes(name)
        ? prev.highlightedPlayers.filter(p => p !== name)
        : [...prev.highlightedPlayers, name]
    }));
  };

  const handleStartFinishProcess = () => {
    setIsEvaluating(true);
  };

  const handleFinalSubmit = () => {
    setIsFinishing(true);
    setTimeout(() => {
      if (currentSession && onUpdateSession) {
        onUpdateSession({
          ...currentSession,
          status: 'completed',
          attendance,
          evaluation
        });
      }
      setIsFinishing(false);
      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
        setSelectedSessionId(null);
        setIsEvaluating(false);
        setAttendance({});
        setEvaluation({
          rating: 0,
          intensity: '',
          attitude: '',
          objectives: '',
          positiveAspects: '',
          improveAspects: '',
          highlightedPlayers: [],
          hasIncidents: false,
          incidentDetails: ''
        });
      }, 2500);
    }, 1500);
  };

  const isEvaluationComplete = useMemo(() => {
    const { rating, intensity, attitude, objectives, hasIncidents, incidentDetails } = evaluation;
    return rating > 0 && 
           intensity !== '' && 
           attitude !== '' && 
           objectives !== '' && 
           (!hasIncidents || incidentDetails.trim().length >= 5);
  }, [evaluation]);

  const coachUser: User = {
    id: 'coach-1',
    name: 'Marc Coach',
    initials: 'MC',
    role: 'Coach',
    premsBalance: 0,
    language: 'ca',
    level: 50,
    xp: 50,
    skills: { tecnica: 90, fisico: 90, tactica: 90, mentalidad: 90 }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-700 relative">
      <section className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tighter uppercase">Panel de Coach</h1>
          <p className="text-gray-500 italic">Gestió de l'agenda diària i seguiment esportiu.</p>
        </div>
        <div className="flex bg-gray-100 p-1 rounded-2xl border border-gray-200">
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
             <UserCheck size={14} /> Assistència
           </button>
        </div>
      </section>

      {activeTab === 'dashboard' ? (
        !selectedSessionId ? (
          <div className="space-y-8 max-w-5xl mx-auto">
            {/* Stats Summary */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-blue-50 text-blue-600 rounded-xl">
                      <UserCheck size={20} />
                    </div>
                    <span className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Assistència Mitjana</span>
                  </div>
                  <div className="text-3xl font-black text-gray-900">92%</div>
                  <div className="text-[10px] font-bold text-green-500 mt-1">+4% vs mes anterior</div>
                </div>
                <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-prem-gold/10 text-prem-gold rounded-xl">
                      <Star size={20} />
                    </div>
                    <span className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Valoració Mitjana</span>
                  </div>
                  <div className="text-3xl font-black text-gray-900">4.8/5</div>
                  <div className="text-[10px] font-bold text-gray-400 mt-1">Basat en 24 sessions</div>
                </div>
                <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-purple-50 text-purple-600 rounded-xl">
                      <Zap size={20} />
                    </div>
                    <span className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Intensitat Promig</span>
                  </div>
                  <div className="text-3xl font-black text-gray-900">Alta</div>
                  <div className="text-[10px] font-bold text-gray-400 mt-1">Constant en el temps</div>
                </div>
              </div>

              <div className="space-y-4">
                <h2 className="text-lg font-bold flex items-center gap-2">
                  <Calendar className="text-prem-gold" size={20} /> Agenda d'Avui
                </h2>
              {todaysSessions.length > 0 ? todaysSessions.map(session => {
                const date = new Date(session.startTime);
                const timeStr = date.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
                
                return (
                  <div 
                    key={session.id} 
                    onClick={() => setSelectedSessionId(session.id)}
                    className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between cursor-pointer hover:border-prem-gold transition-all group"
                  >
                    <div className="flex gap-4 items-center">
                      <div className="w-12 h-12 bg-gray-50 rounded-xl flex items-center justify-center text-gray-400 group-hover:gold-gradient group-hover:text-white transition-colors shadow-sm">
                        <Clock size={24} />
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-0.5">
                          <span className="text-[8px] font-black uppercase px-1.5 py-0.5 rounded bg-prem-gold/10 text-prem-gold">{session.category}</span>
                          <h3 className="font-bold text-gray-900">{session.name}</h3>
                        </div>
                        <div className="text-sm text-gray-400 flex items-center gap-2">
                          <span className="font-bold text-gray-600">{timeStr}h</span>
                          <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                          <span>{session.location || 'Banyoles'}</span>
                        </div>
                      </div>
                    </div>
                    <ChevronRight className="text-gray-300 group-hover:text-prem-gold translate-x-0 group-hover:translate-x-1 transition-all" />
                  </div>
                );
              }) : (
                <div className="bg-gray-50/50 border-2 border-dashed border-gray-100 rounded-3xl p-12 text-center">
                  <Calendar size={40} className="mx-auto text-gray-200 mb-4" />
                  <p className="text-gray-400 font-bold uppercase text-xs tracking-widest">No hi ha sessions programades per avui</p>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <button 
              onClick={() => { setSelectedSessionId(null); setIsEvaluating(false); }}
              className="text-gray-400 hover:text-prem-gold flex items-center gap-2 text-[10px] font-black uppercase tracking-widest transition-colors"
            >
              <ChevronLeft size={14} /> Tornar a l'agenda
            </button>
            
            <div className="bg-white p-6 md:p-10 rounded-[32px] md:rounded-[40px] border border-gray-100 shadow-xl overflow-hidden relative card-shadow min-h-[600px]">
              {showSuccess ? (
                <div className="py-20 text-center animate-in zoom-in duration-500">
                  <div className="w-24 h-24 gold-gradient rounded-full flex items-center justify-center mx-auto mb-8 shadow-xl shadow-prem-gold/20 border-4 border-white">
                    <CheckCircle2 size={48} className="text-white" />
                  </div>
                  <h3 className="text-4xl font-black text-gray-900 uppercase tracking-tighter mb-4">Sessió Tancada</h3>
                  <p className="text-gray-400 font-medium italic text-lg max-w-md mx-auto">Els informes i l'avaluació s'han registrat correctament al sistema de Prem Pro.</p>
                </div>
              ) : isEvaluating ? (
                <div className="animate-in slide-in-from-right-10 duration-500 space-y-8">
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-gray-100 pb-8">
                     <div>
                        <div className="flex items-center gap-2 mb-1">
                           <ShieldCheck size={18} className="text-prem-gold" />
                           <p className="text-[10px] font-black text-prem-gold uppercase tracking-widest">Control de Qualitat Prem</p>
                        </div>
                        <h2 className="text-3xl font-black text-gray-900 tracking-tighter uppercase">Avaluació de l'entrenament</h2>
                        <p className="text-gray-400 text-sm font-medium">Completa aquest informe per poder finalitzar la sessió operativa.</p>
                     </div>
                     <button onClick={() => setIsEvaluating(false)} className="text-xs font-black text-gray-300 hover:text-gray-600 uppercase tracking-widest">Tornar a llista</button>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                     <div className="space-y-10">
                        {/* 1. VALORACION GENERAL */}
                        <div className="space-y-4">
                           <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest px-1">1. Valoració General (1-5) *</label>
                           <div className="flex flex-wrap gap-3">
                              {[1,2,3,4,5].map(num => (
                                <button 
                                  key={num}
                                  onClick={() => setEvaluation({...evaluation, rating: num})}
                                  className={`w-12 h-12 rounded-xl font-black text-sm transition-all border-2 ${evaluation.rating === num ? 'gold-gradient text-white border-transparent shadow-lg scale-110' : 'bg-gray-50 text-gray-400 border-transparent hover:bg-gray-100'}`}
                                >
                                  {num}
                                </button>
                              ))}
                           </div>
                        </div>

                        {/* 2. INTENSIDAD */}
                        <div className="space-y-4">
                           <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest px-1">2. Intensitat del Training *</label>
                           <div className="flex gap-3">
                              {['Baja', 'Media', 'Alta'].map(level => (
                                <button 
                                  key={level}
                                  onClick={() => setEvaluation({...evaluation, intensity: level as any})}
                                  className={`flex-1 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all border-2 ${evaluation.intensity === level ? 'bg-black text-white border-black shadow-lg scale-[1.02]' : 'bg-gray-50 text-gray-400 border-transparent hover:bg-gray-100'}`}
                                >
                                  {level === 'Alta' && <Zap size={12} className="inline mb-0.5 mr-1 text-prem-gold" />}
                                  {level}
                                </button>
                              ))}
                           </div>
                        </div>

                        {/* 3. ACTITUD */}
                        <div className="space-y-4">
                           <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest px-1">3. Actitud del Grup *</label>
                           <div className="grid grid-cols-3 gap-3">
                              {['BAJA', 'BUENA', 'EXCELENTE'].map(item => (
                                <button 
                                  key={item}
                                  onClick={() => setEvaluation({...evaluation, attitude: item as any})}
                                  className={`py-4 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all border-2 ${evaluation.attitude === item ? 'bg-prem-gold text-white border-prem-gold shadow-md' : 'bg-gray-50 text-gray-400 border-transparent hover:bg-gray-100'}`}
                                >
                                  {item}
                                </button>
                              ))}
                           </div>
                        </div>

                        {/* 4. CUMPLIMIENTO OBJETIVOS */}
                        <div className="space-y-4">
                           <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest px-1">4. Compliment d'Objectius *</label>
                           <div className="flex flex-wrap gap-3">
                              {['No alcanzado', 'Parcial', 'Alcanzado', 'Superado'].map(obj => (
                                <button 
                                  key={obj}
                                  onClick={() => setEvaluation({...evaluation, objectives: obj as any})}
                                  className={`px-4 py-3 rounded-xl font-black text-[9px] uppercase tracking-widest transition-all border-2 ${evaluation.objectives === obj ? 'bg-green-600 text-white border-green-600 shadow-md' : 'bg-gray-50 text-gray-400 border-transparent hover:bg-gray-100'}`}
                                >
                                  {/* Fix: use 'obj' instead of 'item' to match the map callback parameter */}
                                  {obj}
                                </button>
                              ))}
                           </div>
                        </div>
                     </div>

                     <div className="space-y-8">
                        {/* 5 & 6. TEXT FEEDBACK */}
                        <div className="grid grid-cols-1 gap-6">
                           <div className="space-y-2">
                              <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest px-1 flex justify-between">
                                 <span>5. Aspectes Positius (opcional)</span>
                                 <span className={evaluation.positiveAspects.length > 200 ? 'text-red-500' : 'text-gray-300'}>{evaluation.positiveAspects.length}/200</span>
                              </label>
                              <textarea 
                                maxLength={200}
                                value={evaluation.positiveAspects}
                                onChange={(e) => setEvaluation({...evaluation, positiveAspects: e.target.value})}
                                placeholder="Punts forts de la sessió..."
                                className="w-full bg-gray-50 border border-gray-100 rounded-2xl p-5 text-sm font-bold text-gray-900 focus:outline-none focus:ring-4 focus:ring-prem-gold/10 min-h-[100px] resize-none"
                              />
                           </div>
                           <div className="space-y-2">
                              <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest px-1 flex justify-between">
                                 <span>6. Aspectes a millorar (opcional)</span>
                                 <span className={evaluation.improveAspects.length > 200 ? 'text-red-500' : 'text-gray-300'}>{evaluation.improveAspects.length}/200</span>
                              </label>
                              <textarea 
                                maxLength={200}
                                value={evaluation.improveAspects}
                                onChange={(e) => setEvaluation({...evaluation, improveAspects: e.target.value})}
                                placeholder="Conceptes a treballar..."
                                className="w-full bg-gray-50 border border-gray-100 rounded-2xl p-5 text-sm font-bold text-gray-900 focus:outline-none focus:ring-4 focus:ring-prem-gold/10 min-h-[100px] resize-none"
                              />
                           </div>
                        </div>

                        {/* 7. JUGADORES DESTACADOS */}
                        <div className="space-y-4">
                           <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest px-1">7. Jugadors Destacats</label>
                           <div className="flex flex-wrap gap-2">
                              {mockPlayers.map(p => (
                                <button
                                  key={p}
                                  onClick={() => toggleHighlightedPlayer(p)}
                                  className={`px-4 py-2 rounded-full font-bold text-[10px] uppercase transition-all flex items-center gap-2 ${evaluation.highlightedPlayers.includes(p) ? 'bg-prem-gold text-white shadow-md' : 'bg-gray-100 text-gray-400 hover:bg-gray-200'}`}
                                >
                                  {evaluation.highlightedPlayers.includes(p) ? <Star size={10} fill="white" /> : <Star size={10} />}
                                  {p}
                                </button>
                              ))}
                           </div>
                        </div>

                        {/* 8. INCIDENCIAS */}
                        <div className="p-6 bg-gray-50 rounded-3xl border border-gray-100 space-y-4">
                           <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                 <AlertCircle size={20} className={evaluation.hasIncidents ? 'text-red-500' : 'text-gray-400'} />
                                 <span className="text-[10px] font-black uppercase text-gray-900 tracking-widest">Incidències?</span>
                              </div>
                              <button 
                                onClick={() => setEvaluation({...evaluation, hasIncidents: !evaluation.hasIncidents})}
                                className={`w-12 h-6 rounded-full relative transition-all ${evaluation.hasIncidents ? 'bg-red-500' : 'bg-gray-300'}`}
                              >
                                 <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${evaluation.hasIncidents ? 'left-7' : 'left-1'}`}></div>
                              </button>
                           </div>
                           {evaluation.hasIncidents && (
                             <textarea 
                                value={evaluation.incidentDetails}
                                onChange={(e) => setEvaluation({...evaluation, incidentDetails: e.target.value})}
                                placeholder="Detalla l'incident (lesió, comportament, material...)"
                                className="w-full bg-white border border-red-100 rounded-xl p-4 text-xs font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-red-500/20 min-h-[80px] animate-in fade-in slide-in-from-top-2"
                             />
                           )}
                        </div>
                     </div>
                  </div>

                  <div className="pt-10 border-t border-gray-50">
                     <button 
                        onClick={handleFinalSubmit}
                        disabled={!isEvaluationComplete || isFinishing}
                        className={`w-full py-6 rounded-3xl font-black text-sm uppercase tracking-widest shadow-2xl transition-all flex items-center justify-center gap-4 ${isEvaluationComplete ? 'gold-gradient text-white shadow-prem-gold/30 hover:scale-[1.01] active:scale-[0.98]' : 'bg-gray-100 text-gray-300 cursor-not-allowed'}`}
                     >
                        {isFinishing ? (
                           <>
                             <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                             Guardant Sessió...
                           </>
                        ) : (
                           <>
                             <CheckCircle2 size={20} /> Tancar i Desar Sessió Ara
                           </>
                        )}
                     </button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="flex flex-col md:flex-row justify-between items-start mb-10 border-b border-gray-50 pb-8 gap-4">
                    <div>
                      <span className="px-3 py-1 gold-gradient text-white text-[10px] font-bold rounded-full uppercase tracking-widest mb-2 inline-block shadow-sm">Sessió en curs</span>
                      <h2 className="text-4xl font-black text-gray-900 tracking-tighter uppercase">{currentSession?.name}</h2>
                      <p className="text-gray-500 font-medium flex items-center gap-2 mt-1">
                        <Clock size={16} className="text-prem-gold" /> {new Date(currentSession?.startTime).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}h · {currentSession?.location}
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Assistència</div>
                      <div className="text-4xl font-black text-prem-gold leading-none">{Object.keys(attendance).filter(k => attendance[k] === 'present').length}/{mockPlayers.length}</div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    <div className="lg:col-span-7 space-y-6">
                      <h3 className="text-lg font-black uppercase tracking-tighter flex items-center gap-2 mb-4">
                        <UserCheck className="text-prem-gold" size={24} /> Llistat de Jugadors
                      </h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {mockPlayers.map((player, idx) => (
                          <div key={idx} className="flex items-center justify-between p-4 bg-gray-50/50 rounded-2xl border border-gray-100 group hover:bg-white hover:border-prem-gold/20 transition-all">
                            <div className="flex items-center gap-4">
                              <div className="w-10 h-10 gold-gradient rounded-xl flex items-center justify-center font-black text-white text-xs shadow-sm group-hover:scale-110 transition-transform">
                                {player.split(' ').map(n => n[0]).join('')}
                              </div>
                              <span className="font-bold text-gray-800 text-sm">{player}</span>
                            </div>
                            <div className="flex gap-2">
                              <button 
                                onClick={() => markAttendance(player, 'present')}
                                className={`p-2 rounded-xl transition-all ${attendance[player] === 'present' ? 'bg-green-500 text-white shadow-lg shadow-green-500/20' : 'bg-white text-gray-300 border border-gray-100 hover:text-green-500'}`}
                              >
                                <CheckCircle2 size={18} />
                              </button>
                              <button 
                                onClick={() => markAttendance(player, 'absent')}
                                className={`p-2 rounded-xl transition-all ${attendance[player] === 'absent' ? 'bg-red-500 text-white shadow-lg shadow-red-500/20' : 'bg-white text-gray-300 border border-gray-100 hover:text-red-500'}`}
                              >
                                <X size={18} />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="lg:col-span-5 space-y-6">
                      <div className="bg-gray-50 p-8 rounded-[32px] border border-gray-100 h-full flex flex-col">
                        <div className="flex items-center gap-3 mb-6">
                          <div className="p-3 bg-white rounded-2xl text-prem-gold shadow-sm">
                            <BookOpen size={20} />
                          </div>
                          <div>
                            <h3 className="text-lg font-black uppercase tracking-tighter text-gray-900 leading-none">Treball de la setmana</h3>
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1">Definit per Coordinació</p>
                          </div>
                        </div>
                        
                        <div className="flex-1 bg-white p-6 rounded-2xl border border-gray-100 shadow-inner overflow-y-auto no-scrollbar max-h-[300px]">
                          {(() => {
                            const sessionTask = tasks.find(t => t.sessionIds?.includes(currentSession?.id));
                            if (sessionTask?.pdfUrl) {
                              return (
                                <div className="h-full flex flex-col items-center justify-center gap-4">
                                  <div className="p-4 bg-red-50 text-red-500 rounded-2xl">
                                    <FileText size={40} />
                                  </div>
                                  <div className="text-center">
                                    <p className="text-sm font-bold text-gray-900 mb-1">{sessionTask.fileName || 'Planificació de la sessió'}</p>
                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">Document PDF disponible</p>
                                    <a 
                                      href={sessionTask.pdfUrl} 
                                      target="_blank" 
                                      rel="noopener noreferrer"
                                      className="inline-flex items-center gap-2 px-6 py-3 bg-gray-900 text-white rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-prem-gold transition-all shadow-lg"
                                    >
                                      <Download size={14} /> Obrir Planificació PDF
                                    </a>
                                  </div>
                                </div>
                              );
                            }
                            return currentSession?.planning ? (
                              <div className="whitespace-pre-wrap text-sm font-medium text-gray-600 leading-relaxed italic">
                                {currentSession.planning}
                              </div>
                            ) : (
                              <div className="h-full flex flex-col items-center justify-center text-center">
                                <AlertTriangle size={32} className="text-gray-200 mb-2" />
                                <p className="text-xs font-bold text-gray-300 uppercase tracking-widest">Sessió sense planificació detallada encara.</p>
                              </div>
                            );
                          })()}
                        </div>

                        <div className="mt-6 flex items-center gap-3">
                           <div className="w-1.5 h-1.5 rounded-full bg-prem-gold animate-pulse"></div>
                           <span className="text-[10px] font-black text-prem-gold uppercase tracking-widest">Consulteu els objectius abans d'iniciar</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <button 
                    onClick={handleStartFinishProcess}
                    className="w-full mt-12 py-6 gold-gradient text-white rounded-[24px] font-black text-sm uppercase tracking-widest shadow-2xl shadow-prem-gold/20 active:scale-[0.98] transition-all flex items-center justify-center gap-3 hover:scale-[1.01]"
                  >
                    Procedir a l'Avaluació Final
                  </button>
                </>
              )}
            </div>
          </div>
        )
      ) : activeTab === 'calendar' ? (
        <div className="bg-white p-6 rounded-[40px] border border-gray-100 shadow-xl animate-in fade-in duration-500 max-w-5xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-black text-gray-900 uppercase tracking-tighter">Calendari de Sessions</h2>
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
              // Adjust for Monday start (0 is Sunday in JS, we want 0 to be Monday)
              const startingDay = firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1;
              const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
              const days = [];
              
              // Empty cells before the first day
              for (let i = 0; i < startingDay; i++) {
                days.push(<div key={`empty-${i}`} className="aspect-square"></div>);
              }
              
              // Days of the month
              for (let day = 1; day <= daysInMonth; day++) {
                const sessionsOnDay = coachSessions.filter(s => {
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
                            {new Date(s.startTime).getHours()}:{new Date(s.startTime).getMinutes().toString().padStart(2, '0')} {s.name}
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
      ) : activeTab === 'history' ? (
        <div className="space-y-6 animate-in fade-in duration-500">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-black text-gray-900 uppercase tracking-tighter">Historial de Sessions</h2>
            <div className="flex gap-4">
              <select className="bg-white border border-gray-100 rounded-xl px-4 py-2 text-xs font-bold text-gray-500 outline-none">
                <option>Totes les categories</option>
                <option>Prem Pro</option>
                <option>Prem Academy</option>
              </select>
            </div>
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
                        <Star key={star} size={10} fill={star <= 4 ? "currentColor" : "none"} />
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
      ) : activeTab === 'messages' ? (
        <div className="h-[650px] bg-white rounded-[40px] border border-gray-100 overflow-hidden shadow-xl animate-in fade-in duration-500">
           <Buzon user={coachUser} />
        </div>
      ) : (
        <div className="space-y-6 animate-in fade-in duration-500">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-black text-gray-900 uppercase tracking-tighter">Control d'Assistència Global</h2>
              <p className="text-gray-400 text-sm font-medium italic">Seguiment detallat de la participació dels jugadors.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {mockPlayers.map(player => {
              const playerSessions = sessions.filter(s => s.status === 'completed' && s.attendance && s.attendance[player]);
              const presentCount = playerSessions.filter(s => s.attendance[player] === 'present').length;
              const absentCount = playerSessions.filter(s => s.attendance[player] === 'absent').length;
              const totalCompleted = playerSessions.length;
              const percentage = totalCompleted > 0 ? Math.round((presentCount / totalCompleted) * 100) : 0;

              return (
                <div key={player} className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6 hover:border-prem-gold/20 transition-all">
                  <div className="flex gap-4 items-center">
                    <div className="w-14 h-14 gold-gradient rounded-2xl flex items-center justify-center text-white font-black shadow-lg">
                      {player.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <h3 className="font-black text-gray-900 uppercase">{player}</h3>
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
                      onClick={() => setViewingPlayerAttendance(player)}
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

      {/* Session Detail Modal */}
      {viewingSession && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 md:p-6 bg-black/60 backdrop-blur-md animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-3xl rounded-[40px] overflow-hidden shadow-2xl animate-in zoom-in-95 duration-300 flex flex-col max-h-[90vh]">
            {/* Header */}
            <div className="p-8 border-b border-gray-50 flex items-center justify-between bg-gray-50/30">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-white text-prem-gold rounded-2xl shadow-sm border border-gray-100">
                  <Calendar size={24} />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="text-[8px] font-black uppercase px-1.5 py-0.5 rounded bg-prem-gold/10 text-prem-gold">{viewingSession.category}</span>
                    <h3 className="text-2xl font-black text-gray-900 tracking-tighter uppercase">{viewingSession.name}</h3>
                  </div>
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Detalls de la sessió</p>
                </div>
              </div>
              <button onClick={() => setViewingSession(null)} className="p-2 text-gray-300 hover:text-gray-900 transition-colors">
                <X size={24} />
              </button>
            </div>

            {/* Content */}
            <div className="p-8 overflow-y-auto no-scrollbar space-y-8 flex-1">
              {/* Basic Info */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100">
                  <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest mb-1">Data i Hora</p>
                  <p className="text-sm font-bold text-gray-900">
                    {new Date(viewingSession.startTime).toLocaleDateString('ca-ES')} a les {new Date(viewingSession.startTime).toLocaleTimeString('ca-ES', { hour: '2-digit', minute: '2-digit' })}h
                  </p>
                </div>
                <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100">
                  <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest mb-1">Ubicació</p>
                  <p className="text-sm font-bold text-gray-900">{viewingSession.location || 'Banyoles'}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100">
                  <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest mb-1">Estat</p>
                  <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded ${viewingSession.status === 'completed' ? 'bg-green-100 text-green-600' : 'bg-blue-100 text-blue-600'}`}>
                    {viewingSession.status === 'completed' ? 'Finalitzada' : 'Programada'}
                  </span>
                </div>
              </div>

              {viewingSession.status === 'completed' ? (
                <div className="space-y-8">
                  {/* Report Section */}
                  <div className="space-y-4">
                    <h4 className="text-xs font-black uppercase tracking-widest text-gray-900 flex items-center gap-2">
                      <FileText size={14} className="text-prem-gold" /> Informe d'Avaluació
                    </h4>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm text-center">
                        <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest mb-1">Valoració</p>
                        <div className="flex justify-center gap-0.5 text-prem-gold">
                          {[1,2,3,4,5].map(star => (
                            <Star key={star} size={12} fill={star <= (viewingSession.evaluation?.rating || 0) ? "currentColor" : "none"} />
                          ))}
                        </div>
                      </div>
                      <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm text-center">
                        <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest mb-1">Intensitat</p>
                        <p className="text-xs font-black text-gray-900 uppercase">{viewingSession.evaluation?.intensity || 'N/A'}</p>
                      </div>
                      <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm text-center">
                        <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest mb-1">Actitud</p>
                        <p className="text-xs font-black text-gray-900 uppercase">{viewingSession.evaluation?.attitude || 'N/A'}</p>
                      </div>
                      <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm text-center">
                        <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest mb-1">Objectius</p>
                        <p className="text-xs font-black text-gray-900 uppercase">{viewingSession.evaluation?.objectives || 'N/A'}</p>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">Aspectes Positius</p>
                      <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100 text-sm font-medium text-gray-600 italic leading-relaxed">
                        {viewingSession.evaluation?.positiveAspects || 'Cap comentari registrat.'}
                      </div>
                    </div>
                    <div className="space-y-2">
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">Aspectes a Millorar</p>
                      <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100 text-sm font-medium text-gray-600 italic leading-relaxed">
                        {viewingSession.evaluation?.improveAspects || 'Cap comentari registrat.'}
                      </div>
                    </div>
                  </div>

                  {/* Highlighted Players */}
                  {viewingSession.evaluation?.highlightedPlayers?.length > 0 && (
                    <div className="space-y-3">
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">Jugadors Destacats</p>
                      <div className="flex flex-wrap gap-2">
                        {viewingSession.evaluation.highlightedPlayers.map((p: string) => (
                          <span key={p} className="px-3 py-1 bg-prem-gold/10 text-prem-gold rounded-full text-[10px] font-black uppercase flex items-center gap-1">
                            <Star size={10} fill="currentColor" /> {p}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Incidents */}
                  {viewingSession.evaluation?.hasIncidents && (
                    <div className="p-4 bg-red-50 rounded-2xl border border-red-100">
                      <div className="flex items-center gap-2 mb-2">
                        <AlertTriangle size={16} className="text-red-500" />
                        <p className="text-[10px] font-black text-red-600 uppercase tracking-widest">Incidències Registrades</p>
                      </div>
                      <p className="text-sm font-medium text-red-700">{viewingSession.evaluation.incidentDetails}</p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="bg-gray-900 p-8 rounded-[32px] text-white relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
                      <BookOpen size={120} />
                    </div>
                    <h4 className="text-lg font-black uppercase tracking-tighter mb-4 text-prem-gold">Planificació de la Sessió</h4>
                    <div className="bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-white/10 text-sm font-medium leading-relaxed italic text-gray-200">
                      {(() => {
                        const sessionTask = tasks.find(t => t.sessionIds?.includes(viewingSession?.id));
                        if (sessionTask?.pdfUrl) {
                          return (
                            <div className="flex flex-col items-center gap-4 py-4">
                              <FileText size={48} className="text-prem-gold" />
                              <div className="text-center">
                                <p className="text-white font-bold mb-3">{sessionTask.fileName || 'Planificació PDF'}</p>
                                <a 
                                  href={sessionTask.pdfUrl} 
                                  target="_blank" 
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center gap-2 px-6 py-3 bg-prem-gold text-white rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-white hover:text-gray-900 transition-all shadow-lg"
                                >
                                  <Download size={14} /> Descarregar / Veure PDF
                                </a>
                              </div>
                            </div>
                          );
                        }
                        return viewingSession.planning || 'No hi ha una planificació detallada per a aquesta sessió encara.';
                      })()}
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 p-4 bg-blue-50 rounded-2xl border border-blue-100">
                    <AlertCircle size={20} className="text-blue-500" />
                    <p className="text-xs font-bold text-blue-700">Aquesta sessió encara no s'ha realitzat. Els informes estaran disponibles un cop finalitzada.</p>
                  </div>
                </div>
              )}
            </div>
            
            {/* Footer */}
            <div className="p-8 border-t border-gray-50 bg-gray-50/30 flex justify-end">
              <button 
                onClick={() => setViewingSession(null)}
                className="px-8 py-3 bg-gray-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-prem-gold transition-all shadow-lg shadow-gray-900/10"
              >
                Tancar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Detalls d'Assistència per Jugador */}
      {viewingPlayerAttendance && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-2xl rounded-[40px] overflow-hidden shadow-2xl animate-in zoom-in-95 duration-300">
            <div className="p-8 border-b border-gray-100 flex justify-between items-center gold-gradient">
              <div>
                <h2 className="text-2xl font-black text-white uppercase tracking-tighter">Historial d'Assistència</h2>
                <p className="text-white/80 text-sm font-medium italic">{viewingPlayerAttendance}</p>
              </div>
              <button 
                onClick={() => setViewingPlayerAttendance(null)}
                className="w-12 h-12 bg-white/20 hover:bg-white/40 rounded-2xl flex items-center justify-center text-white transition-all"
              >
                <X size={24} />
              </button>
            </div>
            
            <div className="p-8 max-h-[60vh] overflow-y-auto custom-scrollbar">
              <div className="space-y-4">
                {sessions
                  .filter(s => s.status === 'completed' && s.attendance && s.attendance[viewingPlayerAttendance])
                  .sort((a, b) => new Date(b.startTime).getTime() - new Date(a.startTime).getTime())
                  .map(session => (
                    <div key={session.id} className="flex items-center justify-between p-4 rounded-2xl border border-gray-100 hover:border-prem-gold/20 transition-all">
                      <div className="flex items-center gap-4">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${session.attendance[viewingPlayerAttendance] === 'present' ? 'bg-green-50 text-green-500' : 'bg-red-50 text-red-500'}`}>
                          {session.attendance[viewingPlayerAttendance] === 'present' ? <CheckCircle2 size={20} /> : <X size={20} />}
                        </div>
                        <div>
                          <p className="font-black text-gray-900 uppercase text-xs">{session.title}</p>
                          <p className="text-[10px] text-gray-400 font-bold uppercase">
                            {new Date(session.startTime).toLocaleDateString('ca-ES', { day: '2-digit', month: 'long', year: 'numeric' })}
                          </p>
                        </div>
                      </div>
                      <div className={`px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest ${session.attendance[viewingPlayerAttendance] === 'present' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'}`}>
                        {session.attendance[viewingPlayerAttendance] === 'present' ? 'Present' : 'Absent'}
                      </div>
                    </div>
                  ))}
                
                {sessions.filter(s => s.status === 'completed' && s.attendance && s.attendance[viewingPlayerAttendance]).length === 0 && (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Calendar size={32} className="text-gray-200" />
                    </div>
                    <p className="text-gray-400 font-bold uppercase text-xs tracking-widest">No hi ha registres per a aquest jugador</p>
                  </div>
                )}
              </div>
            </div>
            
            <div className="p-8 bg-gray-50 flex justify-end">
              <button 
                onClick={() => setViewingPlayerAttendance(null)}
                className="px-8 py-4 bg-gray-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-prem-gold transition-all shadow-lg"
              >
                Tancar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CoachPanel;