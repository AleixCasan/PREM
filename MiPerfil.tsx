
import React, { useState, useRef } from 'react';
import { 
  User as UserIcon, 
  Mail, 
  Phone, 
  MapPin, 
  Camera, 
  Settings, 
  ShieldCheck, 
  Globe, 
  Calendar, 
  CreditCard,
  Lock,
  Bell,
  X,
  Key,
  CheckCircle2,
  Loader2
} from 'lucide-react';
import { User, Language } from '../../types';

interface MiPerfilProps {
  user: User;
  onLanguageChange: (lang: Language) => void;
  t: (key: any) => string;
}

const MiPerfil: React.FC<MiPerfilProps> = ({ user, onLanguageChange, t }) => {
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Password Change State
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [passwordData, setPasswordData] = useState({ current: '', new: '', confirm: '' });
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [passwordSuccess, setPasswordSuccess] = useState(false);

  const handleCameraClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordData.new !== passwordData.confirm) {
      alert("Las nuevas contraseñas no coinciden.");
      return;
    }
    
    setIsChangingPassword(true);
    // Simulate API call
    setTimeout(() => {
      setIsChangingPassword(false);
      setPasswordSuccess(true);
      setTimeout(() => {
        setIsPasswordModalOpen(false);
        setPasswordSuccess(false);
        setPasswordData({ current: '', new: '', confirm: '' });
      }, 2000);
    }, 1500);
  };

  return (
    <div className="space-y-6 md:space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-10 md:pb-20">
      <section>
        <h1 className="text-2xl md:text-4xl font-black text-gray-900 tracking-tighter uppercase">{t('profile_title')}</h1>
        <p className="text-gray-400 mt-1 italic font-medium text-xs md:text-base">{t('profile_subtitle')}</p>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-10">
        {/* Perfil Resumen - Columna Izquierda */}
        <div className="lg:col-span-4 space-y-6 md:space-y-8">
          <div className="bg-white p-6 md:p-10 rounded-[32px] md:rounded-[40px] border border-gray-100 shadow-xl card-shadow flex flex-col items-center text-center relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-[0.03] group-hover:scale-110 transition-transform duration-700">
               <UserIcon size={120} md:size={180} />
            </div>
            
            <div className="relative mb-6 md:mb-8">
              <div className="w-28 h-28 md:w-40 md:h-40 gold-gradient rounded-[32px] md:rounded-[48px] flex items-center justify-center text-white font-black text-3xl md:text-5xl shadow-2xl border-4 md:border-8 border-white ring-1 ring-gray-100 overflow-hidden transition-transform duration-500 hover:rotate-2">
                {profileImage ? (
                  <img src={profileImage} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  user.initials
                )}
              </div>
              <button 
                onClick={handleCameraClick}
                className="absolute -bottom-1 -right-1 md:-bottom-2 md:-right-2 p-2.5 md:p-4 bg-white border border-gray-100 rounded-xl md:rounded-2xl shadow-2xl text-prem-gold hover:scale-110 transition-transform active:scale-90 z-20"
                title="Cambiar foto de perfil"
              >
                <Camera size={16} md:size={20} />
              </button>
              <input 
                type="file" 
                ref={fileInputRef} 
                className="hidden" 
                accept="image/*" 
                onChange={handleFileChange}
              />
            </div>
            
            <h2 className="text-3xl font-black text-gray-900 mb-1 tracking-tighter uppercase">{user.name}</h2>
            <div className="flex items-center gap-2 mb-10">
              <span className="gold-gradient text-white text-[10px] font-black px-4 py-1.5 rounded-full uppercase tracking-widest shadow-lg shadow-prem-gold/20">
                {user.role} Pro
              </span>
              <span className="bg-gray-900 text-prem-gold text-[10px] font-black px-4 py-1.5 rounded-full uppercase tracking-widest border border-prem-gold/30">
                ID: #00{user.id}
              </span>
            </div>
            
            <div className="w-full space-y-6 pt-10 border-t border-gray-50">
              <div className="flex items-center gap-5 text-left bg-gray-50/50 p-4 rounded-2xl border border-gray-100">
                <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-prem-gold shadow-sm border border-gray-100">
                  <Mail size={20} />
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase text-gray-400 tracking-tight mb-0.5">Correo Electrónico</p>
                  <p className="text-sm font-bold text-gray-900">pol.tarrenchs@example.com</p>
                </div>
              </div>
              <div className="flex items-center gap-5 text-left bg-gray-50/50 p-4 rounded-2xl border border-gray-100">
                <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-prem-gold shadow-sm border border-gray-100">
                  <Phone size={20} />
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase text-gray-400 tracking-tight mb-0.5">{t('reg_phone')}</p>
                  <p className="text-sm font-bold text-gray-900">+34 600 000 000</p>
                </div>
              </div>
            </div>

            <div className="mt-10 p-6 bg-prem-gold/5 rounded-3xl border border-prem-gold/10 w-full">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[9px] font-black text-prem-gold uppercase tracking-widest">Miembro desde</span>
                <span className="text-xs font-bold text-gray-900">May 2024</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[9px] font-black text-prem-gold uppercase tracking-widest">Estado</span>
                <div className="flex items-center gap-1.5">
                   <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                   <span className="text-xs font-bold text-green-600">Verificado</span>
                </div>
              </div>
            </div>
          </div>

          {/* Tarjeta de Seguridad Rápida */}
          <div className="bg-gray-900 p-8 rounded-[32px] shadow-xl relative overflow-hidden group">
             <div className="absolute top-0 right-0 p-4 opacity-10 rotate-12 group-hover:scale-125 transition-transform duration-700">
                <ShieldCheck size={100} className="text-prem-gold" />
             </div>
             <h4 className="text-white font-black text-lg uppercase tracking-tighter mb-4 flex items-center gap-3">
               <Lock size={18} className="text-prem-gold" /> Seguridad
             </h4>
             <p className="text-white/40 text-xs font-medium mb-6 leading-relaxed">Protege tu cuenta actualizando tu contraseña regularmente y activando 2FA.</p>
             <button 
                onClick={() => setIsPasswordModalOpen(true)}
                className="w-full py-3 bg-white/10 hover:bg-white/20 text-white border border-white/20 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all"
             >
               Cambiar Contraseña
             </button>
          </div>
        </div>

        {/* Formulario de Información Detallada - Columna Derecha */}
        <div className="lg:col-span-8 space-y-8">
          
          {/* SECCIÓN 1: DATOS PERSONALES */}
          <div className="bg-white p-10 rounded-[40px] border border-gray-100 shadow-sm card-shadow relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gray-50 rounded-bl-[100px] -mr-10 -mt-10 opacity-50"></div>
            
            <h3 className="text-2xl font-black text-gray-900 mb-10 flex items-center gap-4 tracking-tighter uppercase relative z-10">
              <div className="p-3 bg-gray-50 rounded-2xl text-prem-gold border border-gray-100">
                <Settings size={22} />
              </div>
              {t('profile_details')}
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10">
              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest px-1 flex items-center gap-2">
                  <UserIcon size={12} className="text-prem-gold" /> {t('profile_name')}
                </label>
                <input 
                  type="text" 
                  defaultValue={user.name} 
                  className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-6 py-4 text-sm font-bold text-gray-900 focus:outline-none focus:ring-4 focus:ring-prem-gold/10 focus:border-prem-gold transition-all" 
                />
              </div>

              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest px-1 flex items-center gap-2">
                  <CreditCard size={12} className="text-prem-gold" /> DNI / NIE
                </label>
                <input 
                  type="text" 
                  defaultValue="47231XXX-P" 
                  className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-6 py-4 text-sm font-bold text-gray-900 focus:outline-none focus:ring-4 focus:ring-prem-gold/10 focus:border-prem-gold transition-all" 
                />
              </div>

              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest px-1 flex items-center gap-2">
                  <Calendar size={12} className="text-prem-gold" /> Fecha de Nacimiento
                </label>
                <input 
                  type="date" 
                  defaultValue="1995-08-15" 
                  className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-6 py-4 text-sm font-bold text-gray-900 focus:outline-none focus:ring-4 focus:ring-prem-gold/10 focus:border-prem-gold transition-all" 
                />
              </div>

              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest px-1 flex items-center gap-2">
                  <Globe size={12} className="text-prem-gold" /> {t('profile_lang')}
                </label>
                <div className="relative">
                  <select 
                    value={user.language}
                    onChange={(e) => onLanguageChange(e.target.value as Language)}
                    className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-6 py-4 text-sm font-bold text-gray-900 appearance-none focus:outline-none focus:ring-4 focus:ring-prem-gold/10 focus:border-prem-gold transition-all"
                  >
                    <option value="ca">Català (CA)</option>
                    <option value="es">Español (ES)</option>
                    <option value="en">English (UK)</option>
                  </select>
                  <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-gray-300">
                    <Globe size={16} />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* SECCIÓN 2: DIRECCIÓN DE FACTURACIÓN (SEGMENTADA) */}
          <div className="bg-white p-10 rounded-[40px] border border-gray-100 shadow-sm card-shadow">
            <h3 className="text-2xl font-black text-gray-900 mb-10 flex items-center gap-4 tracking-tighter uppercase">
              <div className="p-3 bg-gray-50 rounded-2xl text-prem-gold border border-gray-100">
                <MapPin size={22} />
              </div>
              Dirección de Facturación
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-6 gap-8">
              <div className="md:col-span-4 space-y-3">
                <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest px-1">{t('profile_address')} (Calle, Nº, Piso)</label>
                <input 
                  type="text" 
                  placeholder="Carrer de l'Esport, 123" 
                  className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-6 py-4 text-sm font-bold text-gray-900 focus:outline-none focus:ring-4 focus:ring-prem-gold/10 focus:border-prem-gold transition-all" 
                />
              </div>

              <div className="md:col-span-2 space-y-3">
                <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest px-1">Código Postal</label>
                <input 
                  type="text" 
                  placeholder="17820" 
                  className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-6 py-4 text-sm font-bold text-gray-900 focus:outline-none focus:ring-4 focus:ring-prem-gold/10 focus:border-prem-gold transition-all" 
                />
              </div>

              <div className="md:col-span-3 space-y-3">
                <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest px-1">Ciudad / Población</label>
                <input 
                  type="text" 
                  placeholder="Banyoles" 
                  className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-6 py-4 text-sm font-bold text-gray-900 focus:outline-none focus:ring-4 focus:ring-prem-gold/10 focus:border-prem-gold transition-all" 
                />
              </div>

              <div className="md:col-span-3 space-y-3">
                <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest px-1">País / Región</label>
                <input 
                  type="text" 
                  defaultValue="España" 
                  className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-6 py-4 text-sm font-bold text-gray-900 focus:outline-none focus:ring-4 focus:ring-prem-gold/10 focus:border-prem-gold transition-all" 
                />
              </div>
            </div>
          </div>

          {/* SECCIÓN 3: PREFERENCIAS Y NOTIFICACIONES */}
          <div className="bg-white p-10 rounded-[40px] border border-gray-100 shadow-sm card-shadow">
             <h3 className="text-2xl font-black text-gray-900 mb-10 flex items-center gap-4 tracking-tighter uppercase">
              <div className="p-3 bg-gray-50 rounded-2xl text-prem-gold border border-gray-100">
                <Bell size={22} />
              </div>
              Preferencias
            </h3>

            <div className="space-y-6">
               <label className="flex items-center justify-between p-6 bg-gray-50 rounded-3xl border border-gray-100 cursor-pointer hover:bg-white hover:border-prem-gold/30 transition-all group">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-gray-300 group-hover:text-prem-gold transition-colors shadow-sm">
                       <Mail size={20} />
                    </div>
                    <div>
                       <p className="text-sm font-bold text-gray-900">Notificaciones por Email</p>
                       <p className="text-[10px] font-bold text-gray-400 uppercase tracking-tight">Recibe avisos de tus próximas sesiones y facturas.</p>
                    </div>
                  </div>
                  <div className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" defaultChecked className="sr-only peer" />
                    <div className="w-14 h-8 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[4px] after:start-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-prem-gold"></div>
                  </div>
               </label>

               <label className="flex items-center justify-between p-6 bg-gray-50 rounded-3xl border border-gray-100 cursor-pointer hover:bg-white hover:border-prem-gold/30 transition-all group">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-gray-300 group-hover:text-prem-gold transition-colors shadow-sm">
                       <Phone size={20} />
                    </div>
                    <div>
                       <p className="text-sm font-bold text-gray-900">Alertas SMS / WhatsApp</p>
                       <p className="text-[10px] font-bold text-gray-400 uppercase tracking-tight">Recordatorios urgentes 1 hora antes de cada entreno.</p>
                    </div>
                  </div>
                  <div className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" />
                    <div className="w-14 h-8 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[4px] after:start-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-prem-gold"></div>
                  </div>
               </label>
            </div>
          </div>

          {/* ACCIÓN FINAL: GUARDAR */}
          <div className="flex justify-end pt-4">
            <button className="gold-gradient text-white px-12 py-6 rounded-[32px] font-black text-sm uppercase tracking-widest shadow-2xl shadow-prem-gold/30 hover:scale-[1.02] active:scale-95 transition-all flex items-center gap-4">
              <ShieldCheck size={20} />
              {t('profile_save')}
            </button>
          </div>
        </div>
      </div>

      {/* MODAL CAMBIO DE CONTRASEÑA */}
      {isPasswordModalOpen && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-6 bg-black/40 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-md rounded-[40px] overflow-hidden shadow-2xl animate-in zoom-in-95 duration-300">
            <div className="p-10">
              {passwordSuccess ? (
                <div className="text-center py-10 animate-in zoom-in duration-500">
                  <div className="w-20 h-20 gold-gradient rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl shadow-prem-gold/20">
                    <CheckCircle2 size={40} className="text-white" />
                  </div>
                  <h3 className="text-2xl font-black text-gray-900 uppercase tracking-tighter mb-2">¡Hecho!</h3>
                  <p className="text-gray-400 font-medium italic">Tu contraseña ha sido actualizada con éxito.</p>
                </div>
              ) : (
                <>
                  <div className="flex justify-between items-center mb-10">
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-gray-50 text-prem-gold rounded-2xl">
                        <Key size={24} />
                      </div>
                      <h3 className="text-2xl font-black text-gray-900 tracking-tighter uppercase">
                        Cambiar Clave
                      </h3>
                    </div>
                    <button onClick={() => setIsPasswordModalOpen(false)} className="p-2 text-gray-300 hover:text-gray-900 transition-colors">
                      <X size={24} />
                    </button>
                  </div>
                  
                  <form className="space-y-6" onSubmit={handlePasswordSubmit}>
                    <div className="space-y-3">
                      <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest px-1">Contraseña Actual</label>
                      <input 
                        type="password" 
                        required
                        value={passwordData.current}
                        onChange={(e) => setPasswordData({...passwordData, current: e.target.value})}
                        className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-5 py-4 text-sm font-bold text-gray-900 focus:outline-none focus:ring-4 focus:ring-prem-gold/10 transition-all" 
                        placeholder="••••••••"
                      />
                    </div>

                    <div className="space-y-3">
                      <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest px-1">Nueva Contraseña</label>
                      <input 
                        type="password" 
                        required
                        value={passwordData.new}
                        onChange={(e) => setPasswordData({...passwordData, new: e.target.value})}
                        className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-5 py-4 text-sm font-bold text-gray-900 focus:outline-none focus:ring-4 focus:ring-prem-gold/10 transition-all" 
                        placeholder="••••••••"
                      />
                    </div>

                    <div className="space-y-3">
                      <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest px-1">Confirmar Nueva Contraseña</label>
                      <input 
                        type="password" 
                        required
                        value={passwordData.confirm}
                        onChange={(e) => setPasswordData({...passwordData, confirm: e.target.value})}
                        className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-5 py-4 text-sm font-bold text-gray-900 focus:outline-none focus:ring-4 focus:ring-prem-gold/10 transition-all" 
                        placeholder="••••••••"
                      />
                    </div>

                    <button 
                      type="submit"
                      disabled={isChangingPassword}
                      className="w-full py-5 gold-gradient text-white rounded-[24px] font-black text-sm uppercase tracking-widest shadow-xl shadow-prem-gold/20 active:scale-[0.98] transition-all flex items-center justify-center gap-3"
                    >
                      {isChangingPassword ? (
                        <>
                          <Loader2 size={18} className="animate-spin" />
                          Procesando...
                        </>
                      ) : (
                        'Actualizar Contraseña'
                      )}
                    </button>
                  </form>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MiPerfil;
