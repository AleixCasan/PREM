import React, { useState } from 'react';
import { 
  User, 
  CoachProfile, 
  UserAccountStatus, 
  LanguageSkill 
} from '../types';
import { 
  User as UserIcon, 
  GraduationCap, 
  Award, 
  Globe, 
  Upload, 
  CheckCircle2, 
  ChevronRight, 
  ChevronLeft, 
  Eye, 
  Trash2, 
  Instagram, 
  CreditCard, 
  FileText, 
  Stethoscope, 
  ShieldCheck,
  Calendar,
  Phone,
  Mail,
  MapPin,
  AlertCircle
} from 'lucide-react';

interface CoachOnboardingProps {
  user: User;
  onComplete: (profile: CoachProfile) => void;
}

const CoachOnboarding: React.FC<CoachOnboardingProps> = ({ user, onComplete }) => {
  const [step, setStep] = useState<1 | 2>(1);
  const [formData, setFormData] = useState<Partial<CoachProfile>>({
    firstName: user.name.split(' ')[0] || '',
    lastName: user.name.split(' ').slice(1).join(' ') || '',
    email: user.email || '',
    idType: 'DNI',
    gender: 'Masculí',
    hasDrivingLicense: false,
    academicStudies: [],
    sportsTitles: [],
    languages: [{ language: 'Català', level: 'Alt' }],
    documents: {
      curriculum: null,
      healthCard: null,
      idScan: null
    }
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateStep1 = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.firstName) newErrors.firstName = 'El nom és obligatori';
    if (!formData.lastName) newErrors.lastName = 'Els cognoms són obligatoris';
    if (!formData.idNumber) newErrors.idNumber = 'El número de document és obligatori';
    if (!formData.birthDate) newErrors.birthDate = 'La data de naixement és obligatòria';
    if (!formData.phone1) newErrors.phone1 = 'El telèfon és obligatori';
    if (!formData.country) newErrors.country = 'El país és obligatori';
    if (!formData.city) newErrors.city = 'La ciutat és obligatòria';
    if (!formData.postalCode) newErrors.postalCode = 'El codi postal és obligatori';
    if (!formData.howDidYouKnowUs) newErrors.howDidYouKnowUs = 'Aquest camp és obligatori';
    
    if (!formData.documents?.curriculum) newErrors.curriculum = 'El Curriculum és obligatori';
    if (!formData.documents?.healthCard) newErrors.healthCard = 'La targeta sanitària és obligatòria';
    if (!formData.documents?.idScan) newErrors.idScan = 'El DNI escanejat és obligatori';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep2 = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.academicStudies || formData.academicStudies.length === 0) {
      newErrors.academicStudies = 'Has d\'afegir almenys un estudi acadèmic';
    }
    if (!formData.languages || formData.languages.length === 0) {
      newErrors.languages = 'Has d\'afegir almenys un idioma';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (step === 1 && validateStep1()) {
      setStep(2);
      window.scrollTo(0, 0);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateStep2()) {
      onComplete(formData as CoachProfile);
    }
  };

  const handleFileUpload = (type: keyof CoachProfile['documents'], e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // In a real app, we would upload to a server. Here we use a fake URL.
      const fakeUrl = URL.createObjectURL(file);
      setFormData(prev => ({
        ...prev,
        documents: {
          ...prev.documents!,
          [type]: fakeUrl
        }
      }));
      // Clear error if exists
      if (errors[type]) {
        const newErrors = { ...errors };
        delete newErrors[type];
        setErrors(newErrors);
      }
    }
  };

  const academicOptions = [
    'Grau en Ciències de l’Activitat Física i l’Esport (CAFE)',
    'Tècnic Superior en Animació d’Activitats Físiques i Esportives (TAFAD)',
    'Tècnic en Condicionament Físic',
    'Grau universitari',
    'Batxillerat',
    'Altres'
  ];

  const sportsTitleOptions = [
    'Monitor esportiu',
    'Nacional C (futbol)',
    'UEFA C',
    'UEFA B',
    'UEFA A',
    'Preparador físic',
    'Altres titulacions federatives'
  ];

  const languageOptions = ['Català', 'Castellà', 'Anglès', 'Francès', 'Altres'];
  const levelOptions: LanguageSkill['level'][] = ['Bàsic', 'Mitjà', 'Alt'];

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 font-inter">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 gold-gradient rounded-3xl shadow-xl mb-6 text-white">
            <ShieldCheck size={40} />
          </div>
          <h1 className="text-4xl font-black text-gray-900 uppercase tracking-tighter mb-4">Completar Perfil Professional</h1>
          <p className="text-gray-500 font-medium max-w-md mx-auto">Benvingut a l'equip de PREM ACADEMY. Necessitem algunes dades més per activar el teu compte.</p>
        </div>

        {/* Progress Steps */}
        <div className="flex items-center justify-center mb-12 gap-4">
          <div className={`flex items-center gap-3 px-6 py-3 rounded-2xl border-2 transition-all ${step === 1 ? 'border-prem-gold bg-prem-gold/5 text-prem-gold' : 'border-gray-200 bg-white text-gray-400'}`}>
            <UserIcon size={18} />
            <span className="text-xs font-black uppercase tracking-widest">Dades Personals</span>
          </div>
          <div className="w-8 h-px bg-gray-200"></div>
          <div className={`flex items-center gap-3 px-6 py-3 rounded-2xl border-2 transition-all ${step === 2 ? 'border-prem-gold bg-prem-gold/5 text-prem-gold' : 'border-gray-200 bg-white text-gray-400'}`}>
            <GraduationCap size={18} />
            <span className="text-xs font-black uppercase tracking-widest">Formació i Esport</span>
          </div>
        </div>

        <div className="bg-white rounded-[40px] shadow-2xl shadow-gray-200/50 border border-gray-100 overflow-hidden">
          {step === 1 ? (
            <div className="p-8 lg:p-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Identification Section */}
                <div className="md:col-span-2">
                  <h3 className="text-sm font-black text-gray-900 uppercase tracking-widest mb-6 flex items-center gap-3">
                    <span className="w-8 h-8 rounded-lg bg-gray-900 text-white flex items-center justify-center text-[10px]">01</span>
                    Identificació
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest px-1">Nom *</label>
                      <input 
                        type="text" 
                        value={formData.firstName}
                        onChange={e => setFormData({...formData, firstName: e.target.value})}
                        className={`w-full bg-gray-50 border ${errors.firstName ? 'border-red-500' : 'border-gray-100'} rounded-2xl px-5 py-4 text-sm font-bold focus:outline-none focus:ring-4 focus:ring-prem-gold/10`}
                      />
                      {errors.firstName && <p className="text-[10px] text-red-500 font-bold mt-1">{errors.firstName}</p>}
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest px-1">Cognoms *</label>
                      <input 
                        type="text" 
                        value={formData.lastName}
                        onChange={e => setFormData({...formData, lastName: e.target.value})}
                        className={`w-full bg-gray-50 border ${errors.lastName ? 'border-red-500' : 'border-gray-100'} rounded-2xl px-5 py-4 text-sm font-bold focus:outline-none focus:ring-4 focus:ring-prem-gold/10`}
                      />
                      {errors.lastName && <p className="text-[10px] text-red-500 font-bold mt-1">{errors.lastName}</p>}
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest px-1">Tipus de Document *</label>
                      <select 
                        value={formData.idType}
                        onChange={e => setFormData({...formData, idType: e.target.value as any})}
                        className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-5 py-4 text-sm font-bold appearance-none"
                      >
                        <option value="DNI">DNI</option>
                        <option value="NIE">NIE</option>
                        <option value="Passaport">Passaport</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest px-1">Número de Document *</label>
                      <input 
                        type="text" 
                        value={formData.idNumber}
                        onChange={e => setFormData({...formData, idNumber: e.target.value})}
                        className={`w-full bg-gray-50 border ${errors.idNumber ? 'border-red-500' : 'border-gray-100'} rounded-2xl px-5 py-4 text-sm font-bold focus:outline-none focus:ring-4 focus:ring-prem-gold/10`}
                      />
                      {errors.idNumber && <p className="text-[10px] text-red-500 font-bold mt-1">{errors.idNumber}</p>}
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest px-1">Gènere *</label>
                      <select 
                        value={formData.gender}
                        onChange={e => setFormData({...formData, gender: e.target.value as any})}
                        className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-5 py-4 text-sm font-bold appearance-none"
                      >
                        <option value="Masculí">Masculí</option>
                        <option value="Femení">Femení</option>
                        <option value="No vull especificar">No vull especificar</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest px-1">Data de Naixement *</label>
                      <input 
                        type="date" 
                        value={formData.birthDate}
                        onChange={e => setFormData({...formData, birthDate: e.target.value})}
                        className={`w-full bg-gray-50 border ${errors.birthDate ? 'border-red-500' : 'border-gray-100'} rounded-2xl px-5 py-4 text-sm font-bold focus:outline-none focus:ring-4 focus:ring-prem-gold/10`}
                      />
                      {errors.birthDate && <p className="text-[10px] text-red-500 font-bold mt-1">{errors.birthDate}</p>}
                    </div>
                  </div>
                </div>

                {/* Contact Section */}
                <div className="md:col-span-2">
                  <h3 className="text-sm font-black text-gray-900 uppercase tracking-widest mb-6 flex items-center gap-3">
                    <span className="w-8 h-8 rounded-lg bg-gray-900 text-white flex items-center justify-center text-[10px]">02</span>
                    Contacte i Residència
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest px-1">Telèfon 1 *</label>
                      <input 
                        type="tel" 
                        value={formData.phone1}
                        onChange={e => setFormData({...formData, phone1: e.target.value})}
                        className={`w-full bg-gray-50 border ${errors.phone1 ? 'border-red-500' : 'border-gray-100'} rounded-2xl px-5 py-4 text-sm font-bold focus:outline-none focus:ring-4 focus:ring-prem-gold/10`}
                      />
                      {errors.phone1 && <p className="text-[10px] text-red-500 font-bold mt-1">{errors.phone1}</p>}
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest px-1">Telèfon 2 (Opcional)</label>
                      <input 
                        type="tel" 
                        value={formData.phone2}
                        onChange={e => setFormData({...formData, phone2: e.target.value})}
                        className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-5 py-4 text-sm font-bold focus:outline-none focus:ring-4 focus:ring-prem-gold/10"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest px-1">País de Residència *</label>
                      <input 
                        type="text" 
                        value={formData.country}
                        onChange={e => setFormData({...formData, country: e.target.value})}
                        className={`w-full bg-gray-50 border ${errors.country ? 'border-red-500' : 'border-gray-100'} rounded-2xl px-5 py-4 text-sm font-bold focus:outline-none focus:ring-4 focus:ring-prem-gold/10`}
                      />
                      {errors.country && <p className="text-[10px] text-red-500 font-bold mt-1">{errors.country}</p>}
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest px-1">Ciutat *</label>
                      <input 
                        type="text" 
                        value={formData.city}
                        onChange={e => setFormData({...formData, city: e.target.value})}
                        className={`w-full bg-gray-50 border ${errors.city ? 'border-red-500' : 'border-gray-100'} rounded-2xl px-5 py-4 text-sm font-bold focus:outline-none focus:ring-4 focus:ring-prem-gold/10`}
                      />
                      {errors.city && <p className="text-[10px] text-red-500 font-bold mt-1">{errors.city}</p>}
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest px-1">Codi Postal *</label>
                      <input 
                        type="text" 
                        value={formData.postalCode}
                        onChange={e => setFormData({...formData, postalCode: e.target.value})}
                        className={`w-full bg-gray-50 border ${errors.postalCode ? 'border-red-500' : 'border-gray-100'} rounded-2xl px-5 py-4 text-sm font-bold focus:outline-none focus:ring-4 focus:ring-prem-gold/10`}
                      />
                      {errors.postalCode && <p className="text-[10px] text-red-500 font-bold mt-1">{errors.postalCode}</p>}
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest px-1">Perfil d'Instagram</label>
                      <div className="relative">
                        <Instagram className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
                        <input 
                          type="text" 
                          value={formData.instagram}
                          onChange={e => setFormData({...formData, instagram: e.target.value})}
                          placeholder="@usuari"
                          className="w-full bg-gray-50 border border-gray-100 rounded-2xl pl-12 pr-5 py-4 text-sm font-bold focus:outline-none focus:ring-4 focus:ring-prem-gold/10"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Additional Info Section */}
                <div className="md:col-span-2">
                  <h3 className="text-sm font-black text-gray-900 uppercase tracking-widest mb-6 flex items-center gap-3">
                    <span className="w-8 h-8 rounded-lg bg-gray-900 text-white flex items-center justify-center text-[10px]">03</span>
                    Informació Addicional
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest px-1">Tens carnet de conduir? *</label>
                      <div className="flex gap-4">
                        <button 
                          type="button"
                          onClick={() => setFormData({...formData, hasDrivingLicense: true})}
                          className={`flex-1 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest border-2 transition-all ${formData.hasDrivingLicense ? 'border-prem-gold bg-prem-gold/5 text-prem-gold' : 'border-gray-100 bg-gray-50 text-gray-400'}`}
                        >
                          Sí
                        </button>
                        <button 
                          type="button"
                          onClick={() => setFormData({...formData, hasDrivingLicense: false})}
                          className={`flex-1 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest border-2 transition-all ${!formData.hasDrivingLicense ? 'border-prem-gold bg-prem-gold/5 text-prem-gold' : 'border-gray-100 bg-gray-50 text-gray-400'}`}
                        >
                          No
                        </button>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest px-1">Com ens has conegut? *</label>
                      <select 
                        value={formData.howDidYouKnowUs}
                        onChange={e => setFormData({...formData, howDidYouKnowUs: e.target.value})}
                        className={`w-full bg-gray-50 border ${errors.howDidYouKnowUs ? 'border-red-500' : 'border-gray-100'} rounded-2xl px-5 py-4 text-sm font-bold appearance-none`}
                      >
                        <option value="">Selecciona una opció</option>
                        <option value="He participat en edicions anteriors">He participat en edicions anteriors</option>
                        <option value="Xarxes socials">Xarxes socials</option>
                        <option value="Recomanació">Recomanació</option>
                        <option value="Web">Web</option>
                        <option value="Altres">Altres</option>
                      </select>
                      {errors.howDidYouKnowUs && <p className="text-[10px] text-red-500 font-bold mt-1">{errors.howDidYouKnowUs}</p>}
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest px-1">Número d'afiliació a la Seguretat Social (Opcional)</label>
                      <input 
                        type="text" 
                        value={formData.socialSecurityNumber}
                        onChange={e => setFormData({...formData, socialSecurityNumber: e.target.value})}
                        className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-5 py-4 text-sm font-bold focus:outline-none focus:ring-4 focus:ring-prem-gold/10"
                      />
                    </div>
                  </div>
                </div>

                {/* Documents Section */}
                <div className="md:col-span-2">
                  <h3 className="text-sm font-black text-gray-900 uppercase tracking-widest mb-6 flex items-center gap-3">
                    <span className="w-8 h-8 rounded-lg bg-gray-900 text-white flex items-center justify-center text-[10px]">04</span>
                    Documents Obligatoris
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                    {[
                      { id: 'curriculum', label: 'Curriculum *', icon: <FileText size={24} /> },
                      { id: 'healthCard', label: 'Targeta Sanitària *', icon: <Stethoscope size={24} /> },
                      { id: 'idScan', label: 'DNI / NIE Escanejat *', icon: <CreditCard size={24} /> }
                    ].map((doc) => (
                      <div key={doc.id} className="space-y-3">
                        <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest px-1">{doc.label}</label>
                        <div className={`relative group h-40 rounded-3xl border-2 border-dashed transition-all flex flex-col items-center justify-center gap-3 ${formData.documents?.[doc.id as keyof CoachProfile['documents']] ? 'border-prem-gold bg-prem-gold/5' : errors[doc.id] ? 'border-red-300 bg-red-50' : 'border-gray-200 bg-gray-50 hover:border-prem-gold hover:bg-white'}`}>
                          {formData.documents?.[doc.id as keyof CoachProfile['documents']] ? (
                            <>
                              <div className="w-12 h-12 bg-white rounded-2xl shadow-sm flex items-center justify-center text-prem-gold">
                                <CheckCircle2 size={24} />
                              </div>
                              <div className="flex gap-2">
                                <button 
                                  type="button"
                                  onClick={() => window.open(formData.documents?.[doc.id as keyof CoachProfile['documents']]!, '_blank')}
                                  className="p-2 bg-white text-gray-400 hover:text-prem-gold rounded-xl shadow-sm transition-all"
                                >
                                  <Eye size={16} />
                                </button>
                                <button 
                                  type="button"
                                  onClick={() => setFormData(prev => ({ ...prev, documents: { ...prev.documents!, [doc.id]: null } }))}
                                  className="p-2 bg-white text-gray-400 hover:text-red-500 rounded-xl shadow-sm transition-all"
                                >
                                  <Trash2 size={16} />
                                </button>
                              </div>
                            </>
                          ) : (
                            <>
                              <div className="w-12 h-12 bg-white rounded-2xl shadow-sm flex items-center justify-center text-gray-300 group-hover:text-prem-gold transition-all">
                                {doc.icon}
                              </div>
                              <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Pujar Arxiu</p>
                              <input 
                                type="file" 
                                onChange={(e) => handleFileUpload(doc.id as any, e)}
                                className="absolute inset-0 opacity-0 cursor-pointer"
                              />
                            </>
                          )}
                        </div>
                        {errors[doc.id] && <p className="text-[10px] text-red-500 font-bold text-center">{errors[doc.id]}</p>}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-12 flex justify-end">
                <button 
                  onClick={handleNext}
                  className="px-10 py-5 gold-gradient text-white rounded-[24px] font-black text-sm uppercase tracking-widest shadow-xl shadow-prem-gold/20 active:scale-95 transition-all flex items-center gap-3"
                >
                  Següent Pas <ChevronRight size={18} />
                </button>
              </div>
            </div>
          ) : (
            <div className="p-8 lg:p-12 animate-in fade-in slide-in-from-right-4 duration-500">
              <form onSubmit={handleSubmit} className="space-y-12">
                {/* Academic Studies */}
                <div>
                  <h3 className="text-sm font-black text-gray-900 uppercase tracking-widest mb-6 flex items-center gap-3">
                    <span className="w-8 h-8 rounded-lg bg-gray-900 text-white flex items-center justify-center text-[10px]">05</span>
                    Informació Acadèmica *
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {academicOptions.map((option) => (
                      <button
                        key={option}
                        type="button"
                        onClick={() => {
                          const current = formData.academicStudies || [];
                          if (current.includes(option)) {
                            setFormData({...formData, academicStudies: current.filter(o => o !== option)});
                          } else {
                            setFormData({...formData, academicStudies: [...current, option]});
                          }
                        }}
                        className={`p-5 rounded-3xl border-2 transition-all text-left flex items-center gap-4 ${formData.academicStudies?.includes(option) ? 'border-prem-gold bg-prem-gold/5 text-prem-gold shadow-lg' : 'border-gray-100 bg-gray-50 text-gray-400 hover:bg-white'}`}
                      >
                        <div className={`w-3 h-3 rounded-full border-2 ${formData.academicStudies?.includes(option) ? 'border-prem-gold bg-prem-gold' : 'border-gray-300'}`} />
                        <span className="text-[10px] font-black uppercase leading-tight">{option}</span>
                      </button>
                    ))}
                  </div>
                  {errors.academicStudies && <p className="text-[10px] text-red-500 font-bold mt-4">{errors.academicStudies}</p>}
                </div>

                {/* ROPEC */}
                <div className="max-w-md">
                  <h3 className="text-sm font-black text-gray-900 uppercase tracking-widest mb-6 flex items-center gap-3">
                    <span className="w-8 h-8 rounded-lg bg-gray-900 text-white flex items-center justify-center text-[10px]">06</span>
                    Registre ROPEC (Opcional)
                  </h3>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest px-1">Última data de registre al ROPEC</label>
                    <div className="relative">
                      <Calendar className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
                      <input 
                        type="date" 
                        value={formData.ropecDate}
                        onChange={e => setFormData({...formData, ropecDate: e.target.value})}
                        className="w-full bg-gray-50 border border-gray-100 rounded-2xl pl-12 pr-5 py-4 text-sm font-bold focus:outline-none focus:ring-4 focus:ring-prem-gold/10"
                      />
                    </div>
                    <p className="text-[9px] text-gray-400 font-medium px-1">Registre Oficial de Professionals de l'Esport de Catalunya</p>
                  </div>
                </div>

                {/* Sports Titles */}
                <div>
                  <h3 className="text-sm font-black text-gray-900 uppercase tracking-widest mb-6 flex items-center gap-3">
                    <span className="w-8 h-8 rounded-lg bg-gray-900 text-white flex items-center justify-center text-[10px]">07</span>
                    Titulacions Esportives
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {sportsTitleOptions.map((option) => (
                      <button
                        key={option}
                        type="button"
                        onClick={() => {
                          const current = formData.sportsTitles || [];
                          if (current.includes(option)) {
                            setFormData({...formData, sportsTitles: current.filter(o => o !== option)});
                          } else {
                            setFormData({...formData, sportsTitles: [...current, option]});
                          }
                        }}
                        className={`p-5 rounded-3xl border-2 transition-all text-left flex items-center gap-4 ${formData.sportsTitles?.includes(option) ? 'border-prem-gold bg-prem-gold/5 text-prem-gold shadow-lg' : 'border-gray-100 bg-gray-50 text-gray-400 hover:bg-white'}`}
                      >
                        <div className={`w-3 h-3 rounded-full border-2 ${formData.sportsTitles?.includes(option) ? 'border-prem-gold bg-prem-gold' : 'border-gray-300'}`} />
                        <span className="text-[10px] font-black uppercase leading-tight">{option}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Languages */}
                <div>
                  <h3 className="text-sm font-black text-gray-900 uppercase tracking-widest mb-6 flex items-center gap-3">
                    <span className="w-8 h-8 rounded-lg bg-gray-900 text-white flex items-center justify-center text-[10px]">08</span>
                    Idiomes *
                  </h3>
                  <div className="space-y-4">
                    {formData.languages?.map((lang, idx) => (
                      <div key={idx} className="flex flex-col sm:flex-row gap-4 p-6 bg-gray-50 rounded-[32px] border border-gray-100 animate-in fade-in zoom-in-95 duration-300">
                        <div className="flex-1 space-y-2">
                          <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest px-1">Idioma</label>
                          <select 
                            value={lang.language}
                            onChange={e => {
                              const newLangs = [...formData.languages!];
                              newLangs[idx].language = e.target.value;
                              setFormData({...formData, languages: newLangs});
                            }}
                            className="w-full bg-white border border-gray-100 rounded-2xl px-5 py-3 text-xs font-bold appearance-none"
                          >
                            {languageOptions.map(o => <option key={o} value={o}>{o}</option>)}
                          </select>
                        </div>
                        <div className="flex-1 space-y-2">
                          <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest px-1">Nivell</label>
                          <div className="flex gap-2">
                            {levelOptions.map(level => (
                              <button
                                key={level}
                                type="button"
                                onClick={() => {
                                  const newLangs = [...formData.languages!];
                                  newLangs[idx].level = level;
                                  setFormData({...formData, languages: newLangs});
                                }}
                                className={`flex-1 py-3 rounded-xl font-black text-[9px] uppercase tracking-widest border-2 transition-all ${lang.level === level ? 'border-prem-gold bg-prem-gold/5 text-prem-gold' : 'border-gray-100 bg-white text-gray-300 hover:text-gray-400'}`}
                              >
                                {level}
                              </button>
                            ))}
                          </div>
                        </div>
                        <div className="flex items-end">
                          <button 
                            type="button"
                            onClick={() => {
                              const newLangs = formData.languages!.filter((_, i) => i !== idx);
                              setFormData({...formData, languages: newLangs});
                            }}
                            className="p-3 text-gray-300 hover:text-red-500 transition-colors"
                          >
                            <Trash2 size={20} />
                          </button>
                        </div>
                      </div>
                    ))}
                    <button 
                      type="button"
                      onClick={() => setFormData({...formData, languages: [...formData.languages!, { language: 'Anglès', level: 'Bàsic' }]})}
                      className="w-full py-4 border-2 border-dashed border-gray-200 rounded-[32px] text-gray-400 font-black text-[10px] uppercase tracking-widest hover:border-prem-gold hover:text-prem-gold transition-all flex items-center justify-center gap-2"
                    >
                      <Globe size={16} /> Afegir un altre idioma
                    </button>
                  </div>
                  {errors.languages && <p className="text-[10px] text-red-500 font-bold mt-4">{errors.languages}</p>}
                </div>

                <div className="pt-8 flex items-center justify-between gap-6">
                  <button 
                    type="button"
                    onClick={() => setStep(1)}
                    className="px-8 py-5 bg-gray-100 text-gray-500 rounded-[24px] font-black text-sm uppercase tracking-widest hover:bg-gray-200 transition-all flex items-center gap-3"
                  >
                    <ChevronLeft size={18} /> Enrere
                  </button>
                  <button 
                    type="submit"
                    className="flex-1 py-5 gold-gradient text-white rounded-[24px] font-black text-sm uppercase tracking-widest shadow-xl shadow-prem-gold/20 active:scale-95 transition-all flex items-center justify-center gap-3"
                  >
                    Finalitzar i Activar Compte <CheckCircle2 size={18} />
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>

        {/* Info Footer */}
        <div className="mt-12 flex items-center justify-center gap-8 text-gray-400">
          <div className="flex items-center gap-2">
            <ShieldCheck size={16} />
            <span className="text-[10px] font-bold uppercase tracking-widest">Dades Protegides</span>
          </div>
          <div className="flex items-center gap-2">
            <Mail size={16} />
            <span className="text-[10px] font-bold uppercase tracking-widest">Suport: admin@prem.cat</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CoachOnboarding;
