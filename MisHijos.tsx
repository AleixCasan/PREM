
import React, { useState } from 'react';
import { User, Shield, Target, Plus, X, UserPlus, Camera, Activity, FileText, Check, ChevronRight, ChevronLeft, Trash2, Edit2, AlertTriangle, Download, TrendingUp, Star, MapPin, CreditCard, Calendar } from 'lucide-react';

interface Hijo {
  id: string;
  firstName: string;
  lastName: string;
  birthDate: string;
  gender: string;
  dni: string;
  photo: string | null;
  club: string;
  category: string;
  mainPosition: string;
  secondaryPosition: string;
  strongFoot: string;
  height: string;
  weight: string;
  yearsPlaying: string;
  isCompeting: boolean;
  hasCurrentInjury: boolean;
  currentInjuryDetails: string;
  hasPastInjuries: boolean;
  pastInjuriesDetails: string;
  medicalProblems: string;
  allergies: string;
  medicalAuth: boolean;
  imageRightsAuth: boolean;
  sessions: number;
  performance: string;
}

const MisHijos: React.FC = () => {
  const [hijos, setHijos] = useState<Hijo[]>([
    { 
      id: '1', 
      firstName: 'Marc', 
      lastName: 'Tarrenchs', 
      birthDate: '2012-05-15',
      gender: 'Masculí',
      dni: '12345678X',
      photo: null,
      club: 'Girona FC',
      category: 'Aleví A', 
      mainPosition: 'Davanter',
      secondaryPosition: 'Migcampista',
      strongFoot: 'Dreta',
      height: '155',
      weight: '45',
      yearsPlaying: '5',
      isCompeting: true,
      hasCurrentInjury: false,
      currentInjuryDetails: '',
      hasPastInjuries: false,
      pastInjuriesDetails: '',
      medicalProblems: '',
      allergies: '',
      medicalAuth: true,
      imageRightsAuth: true,
      sessions: 24, 
      performance: 'Excelente' 
    },
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingHijoId, setEditingHijoId] = useState<string | null>(null);
  const [hijoToDelete, setHijoToDelete] = useState<Hijo | null>(null);
  const [reportsHijo, setReportsHijo] = useState<Hijo | null>(null);
  const [step, setStep] = useState(1);
  
  const [formData, setFormData] = useState({
    firstName: '', lastName: '', birthDate: '', gender: '', dni: '', photo: null as string | null,
    club: '', category: 'Aleví', mainPosition: '', secondaryPosition: '', strongFoot: 'Dreta', height: '', weight: '', yearsPlaying: '', isCompeting: true,
    hasCurrentInjury: false, currentInjuryDetails: '', hasPastInjuries: false, pastInjuriesDetails: '', medicalProblems: '', allergies: '', medicalAuth: false,
    imageRightsAuth: false
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateStep = () => {
    const newErrors: Record<string, string> = {};
    if (step === 1) {
      if (!formData.firstName) newErrors.firstName = 'El nom és obligatori';
      if (!formData.lastName) newErrors.lastName = 'Els cognoms són obligatoris';
      if (!formData.birthDate) newErrors.birthDate = 'La data de naixement és obligatòria';
      if (!formData.gender) newErrors.gender = 'El sexe és obligatori';
      if (!formData.dni) newErrors.dni = 'El DNI és obligatori';
    } else if (step === 2) {
      if (!formData.club) newErrors.club = 'El club actual és obligatori';
      if (!formData.mainPosition) newErrors.mainPosition = 'La posició és obligatòria';
      if (!formData.height) newErrors.height = 'L\'alçada és obligatòria';
    } else if (step === 3) {
      if (!formData.medicalAuth) newErrors.medicalAuth = 'Has d\'acceptar l\'autorització mèdica';
      if (!formData.imageRightsAuth) newErrors.imageRightsAuth = 'Has d\'acceptar els drets d\'imatge';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep()) setStep(step + 1);
  };

  const handleBack = () => {
    setStep(step - 1);
  };

  const handleSaveHijo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateStep()) return;
    
    if (editingHijoId) {
      setHijos(prev => prev.map(h => h.id === editingHijoId ? { ...h, ...formData } : h));
    } else {
      const newHijo: Hijo = {
        ...formData,
        id: Math.random().toString(36).substr(2, 9),
        sessions: 0,
        performance: 'Pendent'
      };
      setHijos([...hijos, newHijo]);
    }
    setIsModalOpen(false);
    resetForm();
  };

  const handleEditHijo = (hijo: Hijo) => {
    setEditingHijoId(hijo.id);
    setFormData({
      firstName: hijo.firstName, lastName: hijo.lastName, birthDate: hijo.birthDate, gender: hijo.gender, dni: hijo.dni, photo: hijo.photo,
      club: hijo.club, category: hijo.category, mainPosition: hijo.mainPosition, secondaryPosition: hijo.secondaryPosition, strongFoot: hijo.strongFoot, height: hijo.height, weight: hijo.weight, yearsPlaying: hijo.yearsPlaying, isCompeting: hijo.isCompeting,
      hasCurrentInjury: hijo.hasCurrentInjury, currentInjuryDetails: hijo.currentInjuryDetails, hasPastInjuries: hijo.hasPastInjuries, pastInjuriesDetails: hijo.pastInjuriesDetails, medicalProblems: hijo.medicalProblems, allergies: hijo.allergies, medicalAuth: hijo.medicalAuth,
      imageRightsAuth: hijo.imageRightsAuth
    });
    setStep(1);
    setIsModalOpen(true);
  };

  const confirmDelete = (hijo: Hijo) => setHijoToDelete(hijo);

  const handleDeleteHijo = () => {
    if (hijoToDelete) {
      setHijos(prev => prev.filter(h => h.id !== hijoToDelete.id));
      setHijoToDelete(null);
    }
  };

  const resetForm = () => {
    setFormData({
      firstName: '', lastName: '', birthDate: '', gender: '', dni: '', photo: null,
      club: '', category: 'Aleví', mainPosition: '', secondaryPosition: '', strongFoot: 'Dreta', height: '', weight: '', yearsPlaying: '', isCompeting: true,
      hasCurrentInjury: false, currentInjuryDetails: '', hasPastInjuries: false, pastInjuriesDetails: '', medicalProblems: '', allergies: '', medicalAuth: false,
      imageRightsAuth: false
    });
    setEditingHijoId(null);
    setStep(1);
    setErrors({});
  };

  const handleDownloadReport = (report: any) => {
    if (!reportsHijo) return;
    
    const content = `
PREM ACADEMY - INFORME EVALUATIU
-------------------------------
Jugador: ${reportsHijo.firstName} ${reportsHijo.lastName}
Seu: Banyoles
Data: ${report.date}
Categoria: ${report.category}
Títol: ${report.title}
Puntuació: ${report.score} / 10.0
Estat: ${report.status}

Comentaris del Coach:
El jugador ha mostrat una gran evolució en els conceptes treballats. 
Es recomana seguir practicant la tècnica individual durant les sessions de grup.

© 2024 Prem Academy - Tots els drets reservats.
    `.trim();

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Informe_${reportsHijo.firstName}_${report.id}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const mockReports = [
    { id: 'rep-1', title: 'Avaluació Tècnica: Control i Passada', date: '12 Mai 2024', score: '8.8', category: 'Tècnica', status: 'Finalitzat' },
    { id: 'rep-2', title: 'Informe Tàctic: Posicionament Defensiu', date: '28 Abr 2024', score: '9.2', category: 'Tàctica', status: 'Finalitzat' },
    { id: 'rep-3', title: 'Test Físic: Velocitat i Agilitat', date: '15 Abr 2024', score: '8.1', category: 'Física', status: 'Finalitzat' },
  ];

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <section className="flex flex-col md:flex-row justify-between items-end gap-6">
        <div>
          <h1 className="text-4xl font-black text-gray-900 tracking-tighter uppercase">Mis Hijos</h1>
          <p className="text-gray-400 mt-1 italic font-medium">Gestió de perfils de jugadors associats al teu compte.</p>
        </div>
        <button 
          onClick={() => { resetForm(); setIsModalOpen(true); }}
          className="gold-gradient text-white px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center gap-3 shadow-xl shadow-prem-gold/20 active:scale-95 transition-all"
        >
          <Plus size={20} /> Añadir Jugador
        </button>
      </section>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {hijos.map(hijo => (
          <div key={hijo.id} className="bg-white rounded-3xl border border-gray-100 p-8 shadow-sm hover:shadow-xl transition-all group relative overflow-hidden">
            <div className="absolute top-0 right-0 p-6 opacity-[0.03] group-hover:scale-125 transition-transform duration-700 pointer-events-none">
              <User size={120} />
            </div>
            
            <div className="flex justify-between items-start mb-8 relative z-10">
              <div className="w-20 h-20 gold-gradient rounded-full flex items-center justify-center text-white font-black text-2xl shadow-lg border-4 border-white ring-1 ring-gray-100 overflow-hidden relative group/photo">
                {hijo.photo ? (
                  <img src={hijo.photo} alt={hijo.firstName} className="w-full h-full object-cover" />
                ) : (
                  <span>{(hijo.firstName[0] || '') + (hijo.lastName[0] || '')}</span>
                )}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/photo:opacity-100 transition-opacity flex items-center justify-center">
                  <Camera size={18} className="text-white" />
                </div>
              </div>
              <div className="flex gap-2">
                <button 
                  onClick={() => handleEditHijo(hijo)}
                  className="p-2.5 bg-gray-50 text-gray-400 hover:text-prem-gold hover:bg-white rounded-xl transition-all shadow-sm border border-transparent hover:border-gray-100"
                >
                  <Edit2 size={18} />
                </button>
                <button 
                  onClick={() => confirmDelete(hijo)}
                  className="p-2.5 bg-gray-50 text-gray-400 hover:text-red-500 hover:bg-white rounded-xl transition-all shadow-sm border border-transparent hover:border-gray-100"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>

            <h3 className="text-2xl font-black text-gray-900 mb-1 tracking-tight relative z-10">{hijo.firstName} {hijo.lastName}</h3>
            <p className="text-prem-gold font-black uppercase text-xs tracking-widest mb-6 relative z-10">{hijo.category} · {hijo.club}</p>

            <div className="grid grid-cols-2 gap-4 mb-8 relative z-10">
              <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100">
                <div className="flex items-center gap-2 text-gray-400 mb-1">
                  <Shield size={14} className="text-prem-gold" />
                  <span className="text-[10px] font-black uppercase tracking-tight">Sesiones</span>
                </div>
                <div className="text-xl font-black text-gray-900">{hijo.sessions}</div>
              </div>
              <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100">
                <div className="flex items-center gap-2 text-gray-400 mb-1">
                  <Target size={14} className="text-prem-gold" />
                  <span className="text-[10px] font-black uppercase tracking-tight">Rendimiento</span>
                </div>
                <div className="text-xl font-black text-prem-gold">{hijo.performance}</div>
              </div>
            </div>

            <button 
              onClick={() => setReportsHijo(hijo)}
              className="w-full py-4 border-2 border-prem-gold text-prem-gold hover:bg-prem-gold hover:text-white rounded-xl font-black text-xs transition-all uppercase tracking-widest relative z-10 shadow-lg shadow-prem-gold/5"
            >
              Ver Informes Evaluativos
            </button>
          </div>
        ))}

        {hijos.length === 0 && (
          <div className="col-span-full py-24 text-center bg-gray-50/50 rounded-[40px] border-2 border-dashed border-gray-100">
            <UserPlus size={48} className="mx-auto text-gray-200 mb-4" />
            <p className="text-gray-400 font-bold uppercase text-xs tracking-widest">No hay jugadores registrados en tu cuenta.</p>
          </div>
        )}
      </div>

      {/* MODAL INFORMES EVALUATIVOS */}
      {reportsHijo && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-2 sm:p-6 bg-black/50 backdrop-blur-md animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-3xl rounded-[30px] sm:rounded-[40px] overflow-hidden shadow-[0_35px_60px_-15px_rgba(0,0,0,0.3)] animate-in zoom-in-95 duration-300 flex flex-col max-h-[90vh]">
            <div className="h-40 sm:h-48 relative overflow-hidden group">
              <img src="Banyoles.jpg" alt="Seu Banyoles" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 brightness-[0.7]" />
              <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-black/20" />
              <div className="absolute bottom-4 left-4 sm:bottom-6 sm:left-10 flex items-end gap-3 sm:gap-6">
                <div className="w-16 h-16 sm:w-24 h-24 rounded-2xl sm:rounded-[32px] border-2 sm:border-4 border-white shadow-2xl overflow-hidden gold-gradient flex items-center justify-center">
                  {reportsHijo.photo ? (
                    <img src={reportsHijo.photo} alt={reportsHijo.firstName} className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-white font-black text-xl sm:text-2xl uppercase">{(reportsHijo.firstName[0] || '') + (reportsHijo.lastName[0] || '')}</span>
                  )}
                </div>
                <div className="mb-1 sm:mb-2">
                  <h3 className="text-xl sm:text-4xl font-black text-gray-900 tracking-tighter uppercase leading-none drop-shadow-md">{reportsHijo.firstName} {reportsHijo.lastName}</h3>
                  <div className="flex flex-wrap items-center gap-2 sm:gap-3 mt-1 sm:mt-2">
                    <span className="bg-prem-gold/20 backdrop-blur-md text-prem-gold-dark px-2 py-0.5 sm:px-3 sm:py-1 rounded-full text-[8px] sm:text-[10px] font-black uppercase tracking-widest border border-prem-gold/30 flex items-center gap-1.5">
                      <MapPin size={8} className="sm:size-2.5" /> Seu Banyoles
                    </span>
                    <span className="text-gray-500 font-bold text-[9px] sm:text-xs">{reportsHijo.category} · {reportsHijo.club}</span>
                  </div>
                </div>
              </div>
              <button 
                onClick={() => setReportsHijo(null)} 
                className="absolute top-4 right-4 sm:top-6 sm:right-6 p-2 sm:p-3 bg-white/20 backdrop-blur-xl text-white hover:bg-white hover:text-gray-900 rounded-xl sm:rounded-2xl transition-all shadow-xl"
              >
                <X size={18} className="sm:size-5" />
              </button>
            </div>

            <div className="p-5 sm:p-10 overflow-y-auto no-scrollbar flex-1 space-y-6 sm:space-y-8 bg-white">
              <div className="flex items-center justify-between mb-1">
                <h4 className="text-[8px] sm:text-[10px] font-black text-gray-300 uppercase tracking-widest px-1">Historial de Rendiment</h4>
                <div className="flex items-center gap-1.5 sm:gap-2">
                  <TrendingUp size={12} className="text-prem-gold sm:size-3.5" />
                  <span className="text-[9px] sm:text-xs font-black text-gray-900 uppercase">EVOLUCIÓ POSITIVA +12%</span>
                </div>
              </div>

              <div className="space-y-3 sm:space-y-4">
                {mockReports.map(report => (
                  <div key={report.id} className="group bg-gray-50 border border-gray-100 p-4 sm:p-6 rounded-[24px] sm:rounded-[32px] flex flex-col sm:flex-row items-start sm:items-center justify-between hover:bg-white hover:border-prem-gold/30 hover:shadow-xl hover:shadow-prem-gold/5 transition-all duration-300 gap-4">
                    <div className="flex items-center gap-3 sm:gap-6 w-full sm:w-auto">
                      <div className="w-10 h-10 sm:w-16 sm:h-16 bg-white rounded-xl sm:rounded-3xl flex items-center justify-center text-prem-gold shadow-sm border border-gray-100 group-hover:gold-gradient group-hover:text-white transition-all duration-500 shrink-0">
                        <FileText size={20} className="sm:size-7" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 mb-0.5 sm:mb-1">
                          <span className="text-[7px] sm:text-[9px] font-black uppercase text-prem-gold bg-prem-gold/10 px-1.5 py-0.5 rounded-md group-hover:bg-prem-gold group-hover:text-white transition-colors">{report.category}</span>
                          <h4 className="font-black text-gray-900 text-sm sm:text-lg leading-tight truncate">{report.title}</h4>
                        </div>
                        <div className="flex items-center gap-2 sm:gap-3">
                          <span className="text-[8px] sm:text-[10px] font-bold text-gray-400 uppercase tracking-widest">{report.date}</span>
                          <div className="w-1 h-1 bg-gray-200 rounded-full" />
                          <span className="text-[8px] sm:text-[10px] font-black text-prem-gold uppercase tracking-widest">Verificat</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between sm:justify-end gap-4 sm:gap-8 w-full sm:w-auto border-t sm:border-t-0 border-gray-100 pt-3 sm:pt-0">
                      <div className="text-left sm:text-right">
                        <div className="flex items-center gap-1 sm:justify-end">
                          <Star size={12} className="text-prem-gold fill-prem-gold sm:size-3.5" />
                          <span className="text-xl sm:text-3xl font-black text-gray-900 leading-none">{report.score}</span>
                        </div>
                        <p className="text-[7px] sm:text-[8px] font-black text-gray-300 uppercase tracking-widest mt-0.5 sm:mt-1">Puntuació</p>
                      </div>
                      <button 
                        onClick={() => handleDownloadReport(report)}
                        className="p-2 sm:p-4 bg-white text-gray-300 hover:text-prem-gold rounded-lg sm:rounded-2xl shadow-sm border border-gray-100 transition-all active:scale-90"
                      >
                        <Download size={18} className="sm:size-6" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-5 sm:p-8 border-t border-gray-50 bg-gray-50/30 flex justify-center">
               <button 
                onClick={() => setReportsHijo(null)}
                className="w-full sm:w-auto sm:px-10 py-3 sm:py-4 gold-gradient text-white rounded-xl sm:rounded-2xl font-black text-[10px] sm:text-xs uppercase tracking-widest shadow-xl shadow-prem-gold/20 active:scale-95 transition-all"
              >
                Entès, Tancar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL CONFIRMACIÓ ELIMINACIÓ */}
      {hijoToDelete && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-6 bg-black/40 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white w-full max-sm rounded-[32px] overflow-hidden shadow-2xl animate-in zoom-in-95 duration-300">
            <div className="p-8 text-center">
              <div className="w-16 h-16 bg-red-50 text-red-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <AlertTriangle size={32} />
              </div>
              <h3 className="text-xl font-black text-gray-900 uppercase tracking-tighter mb-2">Eliminar Jugador</h3>
              <p className="text-gray-400 font-medium mb-8">
                Estàs segur que vols eliminar a <strong>{hijoToDelete.firstName}</strong>? Aquesta acció no es pot desfer.
              </p>
              
              <div className="flex gap-4">
                <button 
                  onClick={() => setHijoToDelete(null)}
                  className="flex-1 py-4 bg-gray-50 text-gray-400 rounded-2xl font-black text-xs uppercase tracking-widest hover:text-gray-600 transition-all"
                >
                  Cancelar
                </button>
                <button 
                  onClick={handleDeleteHijo}
                  className="flex-1 py-4 bg-red-500 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-red-500/20 active:scale-95 transition-all"
                >
                  Sí, Eliminar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL MULTI-PASO AFEGIR/EDITAR */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-6 bg-black/40 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-2xl rounded-[40px] overflow-hidden shadow-2xl animate-in zoom-in-95 duration-300 flex flex-col max-h-[90vh]">
            <div className="p-8 border-b border-gray-50 flex items-center justify-between bg-gray-50/30">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-white text-prem-gold rounded-2xl shadow-sm">
                  {step === 1 && <User size={24} />}
                  {step === 2 && <Activity size={24} />}
                  {step === 3 && <FileText size={24} />}
                </div>
                <div>
                  <h3 className="text-2xl font-black text-gray-900 tracking-tighter uppercase">
                    {editingHijoId ? "Editar Jugador" : "Afegir Jugador"}
                  </h3>
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Pas {step} de 3 · {step === 1 ? 'Dades Bàsiques' : step === 2 ? 'Informació Esportiva' : 'Salut i Legal'}</p>
                </div>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="p-2 text-gray-300 hover:text-gray-900 transition-colors">
                <X size={24} />
              </button>
            </div>

            <div className="w-full h-1 bg-gray-100">
              <div className="h-full gold-gradient transition-all duration-500" style={{ width: `${(step / 3) * 100}%` }} />
            </div>

            <div className="p-10 overflow-y-auto no-scrollbar flex-1">
              <form onSubmit={handleSaveHijo} className="space-y-8">
                {step === 1 && (
                  <div className="space-y-8 animate-in slide-in-from-right-10 duration-500">
                    <div className="flex flex-col items-center mb-6">
                      <div className="relative group">
                        <div className="w-24 h-24 bg-gray-50 border-2 border-dashed border-gray-200 rounded-3xl flex items-center justify-center text-gray-300 group-hover:border-prem-gold group-hover:text-prem-gold transition-all cursor-pointer overflow-hidden">
                          {formData.photo ? <img src={formData.photo} alt="Preview" className="w-full h-full object-cover" /> : <Camera size={32} />}
                        </div>
                        <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            const reader = new FileReader();
                            reader.onloadend = () => setFormData({...formData, photo: reader.result as string});
                            reader.readAsDataURL(file);
                          }
                        }} />
                      </div>
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-4">Foto del Jugador</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest px-1">Nom *</label>
                        <input type="text" required value={formData.firstName} onChange={e => setFormData({...formData, firstName: e.target.value})} className={`w-full bg-gray-50 border ${errors.firstName ? 'border-red-300' : 'border-gray-100'} rounded-2xl px-5 py-4 text-sm font-bold focus:outline-none focus:ring-4 focus:ring-prem-gold/10`} />
                        {errors.firstName && <p className="text-[10px] font-bold text-red-500 uppercase px-1">{errors.firstName}</p>}
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest px-1">Cognoms *</label>
                        <input type="text" required value={formData.lastName} onChange={e => setFormData({...formData, lastName: e.target.value})} className={`w-full bg-gray-50 border ${errors.lastName ? 'border-red-300' : 'border-gray-100'} rounded-2xl px-5 py-4 text-sm font-bold focus:outline-none focus:ring-4 focus:ring-prem-gold/10`} />
                        {errors.lastName && <p className="text-[10px] font-bold text-red-500 uppercase px-1">{errors.lastName}</p>}
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest px-1">DNI / NIE *</label>
                        <div className="relative">
                          <CreditCard className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={16} />
                          <input type="text" required value={formData.dni} onChange={e => setFormData({...formData, dni: e.target.value})} className={`w-full bg-gray-50 border ${errors.dni ? 'border-red-300' : 'border-gray-100'} rounded-2xl pl-12 pr-5 py-4 text-sm font-bold focus:outline-none focus:ring-4 focus:ring-prem-gold/10`} placeholder="12345678X" />
                        </div>
                        {errors.dni && <p className="text-[10px] font-bold text-red-500 uppercase px-1">{errors.dni}</p>}
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest px-1">Data de Naixement *</label>
                        <div className="relative">
                          <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={16} />
                          <input type="date" required value={formData.birthDate} onChange={e => setFormData({...formData, birthDate: e.target.value})} className={`w-full bg-gray-50 border ${errors.birthDate ? 'border-red-300' : 'border-gray-100'} rounded-2xl pl-12 pr-5 py-4 text-sm font-bold focus:outline-none focus:ring-4 focus:ring-prem-gold/10`} />
                        </div>
                        {errors.birthDate && <p className="text-[10px] font-bold text-red-500 uppercase px-1">{errors.birthDate}</p>}
                      </div>
                      <div className="space-y-2 md:col-span-2">
                        <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest px-1">Gènere *</label>
                        <div className="flex gap-4">
                          {['Masculí', 'Femení', 'Altre'].map((g) => (
                            <button
                              key={g}
                              type="button"
                              onClick={() => setFormData({...formData, gender: g})}
                              className={`flex-1 py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all border-2 ${formData.gender === g ? 'border-prem-gold bg-prem-gold/5 text-prem-gold shadow-md' : 'border-gray-100 bg-gray-50 text-gray-400 hover:bg-gray-100'}`}
                            >
                              {g}
                            </button>
                          ))}
                        </div>
                        {errors.gender && <p className="text-[10px] font-bold text-red-500 uppercase px-1">{errors.gender}</p>}
                      </div>
                    </div>
                  </div>
                )}
                {step === 2 && (
                  <div className="space-y-6 animate-in slide-in-from-right-10 duration-500">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest px-1">Club Actual *</label>
                        <input type="text" required value={formData.club} onChange={e => setFormData({...formData, club: e.target.value})} className={`w-full bg-gray-50 border ${errors.club ? 'border-red-300' : 'border-gray-100'} rounded-2xl px-5 py-4 text-sm font-bold focus:outline-none`} />
                        {errors.club && <p className="text-[10px] font-bold text-red-500 uppercase px-1">{errors.club}</p>}
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest px-1">Posició Principal *</label>
                        <select value={formData.mainPosition} onChange={e => setFormData({...formData, mainPosition: e.target.value})} className={`w-full bg-gray-50 border ${errors.mainPosition ? 'border-red-300' : 'border-gray-100'} rounded-2xl px-5 py-4 text-sm font-bold`}>
                          <option value="">Selecciona...</option>
                          <option value="Porter">Porter</option>
                          <option value="Defensa">Defensa</option>
                          <option value="Migcampista">Migcampista</option>
                          <option value="Davanter">Davanter</option>
                        </select>
                        {errors.mainPosition && <p className="text-[10px] font-bold text-red-500 uppercase px-1">{errors.mainPosition}</p>}
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest px-1">Alçada (cm) *</label>
                        <input type="number" required value={formData.height} onChange={e => setFormData({...formData, height: e.target.value})} className={`w-full bg-gray-50 border ${errors.height ? 'border-red-300' : 'border-gray-100'} rounded-2xl px-5 py-4 text-sm font-bold`} />
                        {errors.height && <p className="text-[10px] font-bold text-red-500 uppercase px-1">{errors.height}</p>}
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest px-1">Cama més hàbil? *</label>
                        <select value={formData.strongFoot} onChange={e => setFormData({...formData, strongFoot: e.target.value})} className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-5 py-4 text-sm font-bold">
                          <option value="Dreta">Dreta</option>
                          <option value="Esquerra">Esquerra</option>
                          <option value="Amidextre">Amidextre</option>
                        </select>
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest px-1">Pes (kg)</label>
                        <input type="number" value={formData.weight} onChange={e => setFormData({...formData, weight: e.target.value})} className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-5 py-4 text-sm font-bold" />
                      </div>
                    </div>
                  </div>
                )}
                {step === 3 && (
                  <div className="space-y-8 animate-in slide-in-from-right-10 duration-500">
                     <label className={`flex items-start gap-4 p-6 rounded-[28px] border transition-all cursor-pointer ${formData.medicalAuth ? 'bg-prem-gold/5 border-prem-gold/30' : 'bg-gray-50 border-gray-100'}`}>
                        <input type="checkbox" checked={formData.medicalAuth} onChange={e => setFormData({...formData, medicalAuth: e.target.checked})} className="mt-1 w-6 h-6 rounded border-gray-300 text-prem-gold focus:ring-prem-gold" />
                        <div>
                          <span className="text-xs font-black text-gray-900 uppercase tracking-tight block mb-1">Autorització Mèdica *</span>
                          <p className="text-[10px] font-bold text-gray-400 uppercase leading-relaxed">Autoritzo a Prem Academy a actuar en cas d'emergència mèdica durant les sessions.</p>
                        </div>
                     </label>
                     {errors.medicalAuth && <p className="text-[10px] font-bold text-red-500 uppercase px-2">{errors.medicalAuth}</p>}
                     
                     <label className={`flex items-start gap-4 p-6 rounded-[28px] border transition-all cursor-pointer ${formData.imageRightsAuth ? 'bg-prem-gold/5 border-prem-gold/30' : 'bg-gray-50 border-gray-100'}`}>
                        <input type="checkbox" checked={formData.imageRightsAuth} onChange={e => setFormData({...formData, imageRightsAuth: e.target.checked})} className="mt-1 w-6 h-6 rounded border-gray-300 text-prem-gold focus:ring-prem-gold" />
                        <div>
                          <span className="text-xs font-black text-gray-900 uppercase tracking-tight block mb-1">Drets d'Imatge *</span>
                          <p className="text-[10px] font-bold text-gray-400 uppercase leading-relaxed">Autoritzo l'ús d'imatges i vídeos per a finalitats formatives i promocionals de l'acadèmia.</p>
                        </div>
                     </label>
                     {errors.imageRightsAuth && <p className="text-[10px] font-bold text-red-500 uppercase px-2">{errors.imageRightsAuth}</p>}
                  </div>
                )}
              </form>
            </div>

            <div className="p-8 border-t border-gray-50 bg-gray-50/30 flex gap-4">
              {step > 1 && (
                <button 
                  onClick={handleBack} 
                  className="px-8 py-5 bg-white border-2 border-gray-100 text-gray-400 hover:text-gray-900 hover:border-gray-200 rounded-3xl font-black text-xs uppercase tracking-widest transition-all"
                >
                  Tornar
                </button>
              )}
              {step < 3 ? (
                <button 
                  onClick={handleNext} 
                  className="flex-1 py-5 gold-gradient text-white rounded-3xl font-black text-xs uppercase tracking-widest shadow-xl shadow-prem-gold/20 active:scale-95 transition-all hover:scale-[1.02]"
                >
                  Següent pas
                </button>
              ) : (
                <button 
                  onClick={handleSaveHijo} 
                  className="flex-1 py-5 gold-gradient text-white rounded-3xl font-black text-xs uppercase tracking-widest shadow-xl shadow-prem-gold/20 active:scale-95 transition-all hover:scale-[1.02]"
                >
                  Finalitzar i Desar
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MisHijos;
